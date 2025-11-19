/**
 * Admin Order Management Routes
 * CRUD operations and status management for orders
 */

import { RequestHandler } from "express";
import { z } from "zod";
import { prisma } from "../../db.js";
import { pluginManager } from "../../plugins/manager.js";
import { AdminResponse, PaginatedResponse } from "@shared/plugins";

/**
 * Schema for creating a new order
 */
const createOrderSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  items: z.array(
    z.object({
      productId: z.string().min(1, "Product ID is required"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      price: z.number().min(0, "Price must be a positive number"),
    })
  ).min(1, "At least one item is required"),
  subtotal: z.number().min(0),
  tax: z.number().min(0),
  shippingCost: z.number().min(0),
  total: z.number().min(0),
  notes: z.string().optional(),
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]).default("pending"),
});

/**
 * Schema for updating order status
 */
const orderStatusSchema = z.object({
  status: z.enum([
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ] as const),
  notes: z.string().optional(),
});

/**
 * Valid order statuses
 */
const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

/**
 * Create a new order (admin-only)
 * POST /api/admin/orders
 */
export const handleCreateOrder: RequestHandler = async (req, res) => {
  try {
    // Validate request body
    const payload = createOrderSchema.parse(req.body);

    // Verify customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: payload.customerId },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: "Customer not found",
      });
    }

    // Verify all products exist
    const productIds = payload.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        error: "One or more products not found",
      });
    }

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order with items
    const order = await prisma.order.create({
      data: {
        customerId: payload.customerId,
        orderNumber,
        status: payload.status || "pending",
        subtotal: payload.subtotal,
        tax: payload.tax,
        shippingCost: payload.shippingCost,
        total: payload.total,
        notes: payload.notes,
        items: {
          create: payload.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Trigger plugin hook
    await pluginManager.triggerHook("onOrderCreate", order);

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message,
      });
    }

    console.error("Create order error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to create order",
    });
  }
};

/**
 * List all orders (with pagination and filtering)
 * GET /api/admin/orders?page=1&limit=10&status=pending
 */
export const handleListOrders: RequestHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string | undefined;

    const skip = (page - 1) * limit;

    const where = status && ORDER_STATUSES.includes(status) ? { status } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          customer: true,
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ]);

    return res.json({
      success: true,
      data: {
        items: orders,
        total,
        page,
        pageSize: limit,
        totalPages: Math.ceil(total / limit),
      } as PaginatedResponse<any>,
    });
  } catch (error) {
    console.error("List orders error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch orders",
    });
  }
};

/**
 * Get single order details
 * GET /api/admin/orders/:id
 */
export const handleGetOrder: RequestHandler = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    return res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch order",
    });
  }
};

/**
 * Update order status
 * PUT /api/admin/orders/:id/status
 */
export const handleUpdateOrderStatus: RequestHandler = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status, notes } = orderStatusSchema.parse(req.body);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    const oldStatus = order.status;

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        notes: notes || order.notes,
        updatedAt: new Date(),
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Trigger appropriate plugin hooks based on status change
    if (status === "shipped" && oldStatus !== "shipped") {
      await pluginManager.triggerHook("onOrderShip", updatedOrder);
    } else if (status === "delivered" && oldStatus !== "delivered") {
      await pluginManager.triggerHook("onOrderDeliver", updatedOrder);
    } else if (status === "cancelled" && oldStatus !== "cancelled") {
      await pluginManager.triggerHook("onOrderCancel", updatedOrder);
    } else {
      await pluginManager.triggerHook("onOrderUpdate", {
        order: updatedOrder,
        status,
      });
    }

    return res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updatedOrder,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message,
      });
    }

    console.error("Update order status error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to update order",
    });
  }
};

/**
 * Update order tracking information
 * PUT /api/admin/orders/:id/tracking
 */
export const handleUpdateOrderTracking: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { trackingNumber, trackingUrl, estimatedDelivery } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: {
        trackingNumber: trackingNumber || null,
        trackingUrl: trackingUrl || null,
        estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : null,
      },
      include: {
        customer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return res.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error("Update order tracking error:", error);
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }
    return res.status(500).json({
      success: false,
      error: "Failed to update tracking information",
    });
  }
};

/**
 * Get order statistics/summary
 * GET /api/admin/orders/stats/summary
 */
export const handleOrderStats: RequestHandler = async (req, res) => {
  try {
    const [totalOrders, pendingOrders, processingOrders, shippedOrders, deliveredOrders] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.count({ where: { status: "pending" } }),
        prisma.order.count({ where: { status: "processing" } }),
        prisma.order.count({ where: { status: "shipped" } }),
        prisma.order.count({ where: { status: "delivered" } }),
      ]);

    // Calculate total revenue
    const orders = await prisma.order.findMany({
      where: { status: { in: ["processing", "shipped", "delivered"] } },
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    return res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        totalRevenue,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      },
    });
  } catch (error) {
    console.error("Order stats error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch order statistics",
    });
  }
};
