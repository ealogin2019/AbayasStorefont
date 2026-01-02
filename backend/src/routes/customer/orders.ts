import { Router, Request, Response } from "express";
import { prisma } from "../../db";
import { z } from "zod";
import { authenticateCustomer } from "../../customer-middleware";

const router = Router();

// Schemas
const createOrderSchema = z.object({
  paymentMethod: z.enum(["cod", "card"]).default("cod"),
  shippingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    address: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }).optional(),
});

const listOrdersSchema = z.object({
  page: z.number().optional().default(1),
  limit: z.number().optional().default(10),
});

// Create Order From Cart
const handleCreateOrderFromCart = [
  authenticateCustomer,
  async (req: Request, res: Response) => {
    try {
      const { paymentMethod, shippingAddress } = createOrderSchema.parse(req.body);
      const customerId = req.customerId;

      if (!customerId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      // Get customer's cart
      const cart = await prisma.cart.findFirst({
        where: { customerId },
        include: {
          items: {
            include: { product: true, variant: true },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: "Cart is empty or not found" });
      }

      // Calculate totals
      const subtotal = cart.items.reduce((sum, item) => {
        const price = Number(item.variant?.price ?? item.product.price ?? 0);
        return sum + price * item.quantity;
      }, 0);

      const shippingCost = subtotal > 500 ? 0 : 20;
      const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% tax
      const total = subtotal + shippingCost + tax;

      // Create order in transaction
      const order = await prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
          data: {
            orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            customerId,
            total,
            subtotal,
            shippingCost,
            tax,
            status: paymentMethod === "cod" ? "pending" : "pending",
            notes: shippingAddress ? JSON.stringify({ paymentMethod, shippingAddress }) : JSON.stringify({ paymentMethod }),
            items: {
              create: cart.items.map((item) => ({
                product: { connect: { id: item.productId } },
                variant: item.variantId ? { connect: { id: item.variantId } } : undefined,
                quantity: item.quantity,
                price: Number(item.variant?.price ?? item.product.price ?? 0),
                size: item.size,
                color: item.color,
              })),
            },
          },
          include: {
            items: { include: { product: true, variant: true } },
          },
        });

        // Clear cart items
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

        return newOrder;
      });

      res.status(201).json({
        success: true,
        message: "Order created successfully",
        orderId: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Validation failed", errors: error.errors });
      }
      console.error("Create order error:", error);
      res.status(500).json({ success: false, message: "Failed to create order" });
    }
  },
];

// List Orders (Paginated)
const handleListOrders = [
  authenticateCustomer,
  async (req: Request, res: Response) => {
    try {
      const customerId = req.customerId;
      if (!customerId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { page, limit } = listOrdersSchema.parse({
        page: Number(req.query.page) || undefined,
        limit: Number(req.query.limit) || undefined,
      });

      const skip = (page - 1) * limit;

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where: { customerId },
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            items: { include: { product: true, variant: true } },
          },
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
      res.status(500).json({ success: false, message: "Failed to list orders" });
    }
  },
];

// Get Order by ID
const handleGetOrder = [
  authenticateCustomer,
  async (req: Request, res: Response) => {
    try {
      const customerId = req.customerId;
      const orderId = req.params.id;

      if (!customerId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const order = await prisma.order.findFirst({
        where: { id: orderId, customerId },
        include: {
          items: { include: { product: true, variant: true } },
        },
      });

      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      res.json({ success: true, data: order });
    } catch (error) {
      console.error("Get order error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch order" });
    }
  },
];

// Get Order by Order Number (For Thank You Page - No Auth Required)
const handleGetOrderByNumber = async (req: Request, res: Response) => {
  try {
    const { orderNumber } = req.params;

    if (!orderNumber) {
      return res.status(400).json({ success: false, message: "Order number is required" });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: { include: { product: true, variant: true } },
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error("Get order by number error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch order" });
  }
};

// Routes
router.post("/create", handleCreateOrderFromCart);
router.get("/", handleListOrders);
router.get("/:id", handleGetOrder);
router.get("/number/:orderNumber", handleGetOrderByNumber);

export default router;

// Export handlers for direct use if needed
export { handleCreateOrderFromCart, handleListOrders, handleGetOrder, handleGetOrderByNumber };
