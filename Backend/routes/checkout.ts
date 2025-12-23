
import { Router, Request, Response } from 'express'
import stripe from 'stripe'
import { z } from 'zod'
import { prisma } from '../db.js'
import { pluginManager } from '../plugins/manager.js'
// Import the correct authentication middleware
import { authenticateAdmin } from '../auth/middleware'

const router = Router()

// Don't construct a Stripe client at module load time because tests or
// environments without STRIPE_SECRET_KEY would throw. Create per-request
// and return an error if the key is missing.
function getStripeClient() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  return new stripe(key, {})
}

// Checkout schema
const checkoutSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  paymentMethod: z.enum(["cod", "card"]).default("cod"),
});

// Create order from checkout
router.post('/', async (req: Request, res: Response) => {
  try {
    // 1. Validate Request Body
    const data = checkoutSchema.parse(req.body);

    // 2. Identify the Cart
    // We try to get the cartId from the signed cookie first (secure), then fall back to body/header if necessary
    const cartId = req.cookies.cartId;

    if (!cartId) {
      return res.status(400).json({ message: "No active cart found" });
    }

    // 3. Fetch Cart and Items
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 4. Calculate Totals (Server-side calculation is crucial for security)
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);
    
    // Simple logic for shipping: Free if over 500, else 20 (example logic)
    const shippingCost = subtotal > 500 ? 0 : 20; 
    const totalAmount = subtotal + shippingCost;

    // 5. Database Transaction: Create Order & Clear Cart
    const order = await prisma.$transaction(async (tx) => {
      // Create the Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          status: "PENDING",
          total: totalAmount,
          email: data.email,
          // Store shipping address as a JSON string to preserve snapshot of address at time of order
          shippingAddress: JSON.stringify({
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            city: data.city,
            postalCode: data.postalCode,
            country: data.country,
          }),
          // Map cart items to order items
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
      });

      // Clear the Cart Items
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    // 6. Return Success Response
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: order.id,
      orderNumber: order.orderNumber,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Validation failed", errors: error.errors });
    }
    console.error("Checkout Error:", error);
    res.status(500).json({ message: "Internal server error during checkout" });
  }
});

// Create a payment intent
// Note: We're removing authentication for this public endpoint
// Payment intents are created client-side during checkout
router.post('/create-payment-intent', async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'usd', orderId } = req.body

    const stripeClient = getStripeClient()
    if (!stripeClient) {
      console.warn('Stripe secret key not configured; create-payment-intent cannot proceed')
      return res.status(500).send({ error: 'Stripe not configured' })
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency: currency,
      metadata: {
        orderId: orderId,
      },
    })

    res.send({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    res.status(500).send({ error: 'Failed to create payment intent' })
  }
})

// Webhook to handle Stripe events
// Note: The express.raw middleware is applied in index.ts to /api/checkout/webhook
// So we don't need to apply it here
router.post('/webhook', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  const stripeClient = getStripeClient()
  if (!stripeClient || !webhookSecret) {
    console.warn('Stripe or webhook secret not configured; skipping webhook processing')
    return res.status(400).send('Stripe webhook not configured')
  }

  let event: stripe.Event

  try {
    // req.body is already a Buffer because of express.raw middleware applied in index.ts
    event = stripeClient.webhooks.constructEvent(req.body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed.', err)
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`)
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object as stripe.PaymentIntent
      console.log('Payment succeeded:', paymentIntentSucceeded.id)
      
      // TODO: Create order in database
      // This would typically involve:
      // 1. Getting cart items for the customer
      // 2. Creating an Order record
      // 3. Creating OrderItem records
      // 4. Clearing the cart
      // 5. Sending confirmation email
      // 6. Triggering onOrderCreate plugin hook
      
      // Example metadata structure:
      // {
      //   orderId: string (if pre-created)
      //   customerId: string
      //   cartId: string
      // }
      
      if (paymentIntentSucceeded.metadata?.orderId) {
        console.log('Order ID from metadata:', paymentIntentSucceeded.metadata.orderId)
        // Update existing order status to 'paid'
      }
      
      break
      
    case 'payment_intent.payment_failed':
      const paymentIntentFailed = event.data.object
      console.log('Payment failed:', paymentIntentFailed.id)
      
      // Update order status to 'failed' if order exists
      if (paymentIntentFailed.metadata?.orderId) {
        console.log('Failed order ID:', paymentIntentFailed.metadata.orderId)
        // Update order status to 'cancelled' or 'failed'
      }
      break
      
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  res.json({ received: true })
})

export default router