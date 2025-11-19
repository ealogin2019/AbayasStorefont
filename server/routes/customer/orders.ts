import { RequestHandler } from "express";
import { prisma } from "../../db.js";
import { z } from "zod";
import { pluginManager } from "../../plugins/manager.js";

const createOrderSchema = z.object({
  customerId: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    price: z.number(),
    size: z.string().optional(),
    color: z.string().optional(),
  })),
  subtotal: z.number(),
  tax: z.number().optional(),
  shippingCost: z.number().optional(),
  total: z.number(),
  notes: z.string().optional(),
});

// Create order from cart (called after successful payment)
export const handleCreateOrderFromCart: RequestHandler = async (req, res) => {
  try {
    const { customerId, cartItems, paymentIntentId, shippingCost = 0, tax = 0, notes } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "No items in cart" });
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum: number, item: any) => 
      sum + (item.product.price * item.quantity), 0
    );
    const total = subtotal + shippingCost + tax;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order with items
    const order = await prisma.order.create({
      data: {
        customerId: customerId || null,
        orderNumber,
        status: "pending",
        subtotal,
        tax,
        shippingCost,
        total,
        notes,
        items: {
          create: cartItems.map((item: any) => ({
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
    if (customerId) {
      await prisma.cartItem.deleteMany({
        where: { customerId },
      });
    }

    // Trigger plugin hooks (e.g., inventory deduction)
    try {
      await pluginManager.triggerHook('onOrderCreate', order);
    } catch (error) {
      console.error("Plugin hook error:", error);
      // Don't fail the order if plugins fail
    }

    // TODO: Send confirmation email
    // await sendOrderConfirmationEmail(order);

    res.json({
      order,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// Create order (manual - for admin or direct API usage)
export const handleCreateOrder: RequestHandler = async (req, res) => {
  try {
    const data = createOrderSchema.parse(req.body);

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const order = await prisma.order.create({
      data: {
        customerId: data.customerId || null,
        orderNumber,
        status: "pending",
        subtotal: data.subtotal,
        tax: data.tax || 0,
        shippingCost: data.shippingCost || 0,
        total: data.total,
        notes: data.notes,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
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
      },
    });

    // Trigger plugin hooks (e.g., inventory deduction)
    try {
      await pluginManager.triggerHook('onOrderCreate', order);
    } catch (error) {
      console.error("Plugin hook error:", error);
      // Don't fail the order if plugins fail
    }

    res.json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    console.error("Create order error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// Get customer orders (public endpoint with customer ID)
export const handleGetCustomerOrders: RequestHandler = async (req, res) => {
  try {
    const customerId = req.query.customerId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!customerId) {
      return res.status(400).json({ error: "customerId is required" });
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { customerId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where: { customerId } }),
    ]);

    res.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get customer orders error:", error);
    res.status(500).json({ error: "Failed to get orders" });
  }
};
