/**
 * Customer Orders Routes
 * Handles creating orders, listing orders, and fetching order details
 */

import { RequestHandler } from "express";
import { prisma } from "../../db";
import { z } from "zod";

// --------------------
// Schemas
// --------------------
const createOrderSchema = z.object({
  customerId: z.string(),
  paymentMethod: z.enum(["cod", "card"]).default("cod"),
  shippingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    address: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
});

const listOrdersSchema = z.object({
  customerId: z.string(),
  page: z.number().optional().default(1),
  limit: z.number().optional().default(10),
});

// --------------------
// Create Order
// --------------------
export const handleCreateOrder: RequestHandler = async (req, res) => {
  try {
    const data = createOrderSchema.parse(req.body);
    const { customerId, paymentMethod, shippingAddress } = data;

    // 1️⃣ Find customer's cart with items
    const cart = await prisma.cart.findFirst({
      where: { customerId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, error: "Cart is empty or not found" });
    }

    // 2️⃣ Calculate total
    const total = cart.items.reduce((sum, item) => {
      const price = item.variant?.price ?? item.product.price;
      return sum + price * item.quantity;
    }, 0);

    // 3️⃣ Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          customerId,
          total,
          status: "PENDING",
          paymentMethod,
          shippingAddress: JSON.stringify(shippingAddress),
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId ?? undefined,
              quantity: item.quantity,
              price: item.variant?.price ?? item.product.price,
              size: item.size,
              color: item.color,
            })),
          },
        },
        include: { items: true },
      });

      // Clear cart items
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors });
    }
    console.error("Create order error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// --------------------
// List Orders (Paginated)
// --------------------
export const handleListOrders: RequestHandler = async (req, res) => {
  try {
    const data = listOrdersSchema.parse({
      customerId: req.query.customerId,
      page: Number(req.query.page) || undefined,
      limit: Number(req.query.limit) || undefined,
    });

    const { customerId, page, limit } = data;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { customerId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { items: { include: { product: true, variant: true } } },
      }),
      prisma.order.count({ where: { customerId } }),
    ]);

    res.json({
      success: true,
      data: {
        items: orders,
        total,
        page,
        pageSize: limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("List orders error:", error);
    res.status(500).json({ success: false, error: "Failed to list orders" });
  }
};

// --------------------
// Get Single Order
// --------------------
export const handleGetOrder: RequestHandler = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true, variant: true },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch order" });
  }
};

// --------------------
// Update Order Status
// --------------------
export const handleUpdateOrderStatus: RequestHandler = async (req, res) => {
  try {
    const { status } = req.body as { status: string };
    const orderId = req.params.id;

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: { include: { product: true, variant: true } } },
    });

    res.json({ success: true, message: "Order status updated", data: updatedOrder });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ success: false, error: "Failed to update order status" });
  }
};
