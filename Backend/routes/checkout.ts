
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
  customerId: z.string().optional(),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  zipCode: z.string().min(1),
  phone: z.string().min(1),
  shippingCost: z.number().optional().default(0),
  tax: z.number().optional().default(0),
  notes: z.string().optional(),
});

// Create order from checkout
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = checkoutSchema.parse(req.body);

    // Get customer ID from session or request
    const customerId = data.customerId || (req as any).customerId;

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: customerId ? { customerId } : { customerId: null },
      include: {
        product: true,
      },
    });

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0
    );
    const total = subtotal + data.shippingCost + data.tax;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Find or create customer
    let customer = customerId ? await prisma.customer.findUnique({ where: { id: customerId } }) : null;
    
    if (!customer) {
      // Create guest customer
      customer = await prisma.customer.create({
        data: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          address: data.address,
          city: data.city,
          country: data.country,
          zipCode: data.zipCode,
          passwordHash: '', // Guest customer
        },
      });
    }

    // Create order with items
    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        orderNumber,
        status: "pending",
        subtotal,
        tax: data.tax,
        shippingCost: data.shippingCost,
        total,
        notes: data.notes,
        shippingAddress: `${data.address}, ${data.city}, ${data.country} ${data.zipCode}`,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
            size: item.size,
            color: item.color,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Clear cart after order creation
    if (customer.id) {
      await prisma.cartItem.deleteMany({
        where: { customerId: customer.id },
      });
    }

    // Trigger plugin hooks (e.g., inventory deduction)
    try {
      await pluginManager.triggerHook('onOrderCreate', order);
    } catch (error) {
      console.error("Plugin hook error:", error);
      // Don't fail the order if plugins fail
    }

    res.json({
      order,
      message: "Order created successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid checkout data", details: error.errors });
    }
    console.error("Checkout error:", error);
    res.status(500).json({ error: "Checkout failed" });
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