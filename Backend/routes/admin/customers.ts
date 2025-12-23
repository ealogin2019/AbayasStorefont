/**
 * Admin Customer Management Routes
 * View and manage customer accounts
 */

import { RequestHandler } from "express";
import { prisma } from "../../db.js";
import { AdminResponse, PaginatedResponse } from "@shared/plugins";

/**
 * List all customers (with pagination and search)
 * GET /api/admin/customers?page=1&limit=10&search=john
 */
export const handleListCustomers: RequestHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";

    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: "insensitive" as const } },
            { firstName: { contains: search, mode: "insensitive" as const } },
            { lastName: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          country: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              orders: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.customer.count({ where }),
    ]);

    return res.json({
      success: true,
      data: {
        items: customers,
        total,
        page,
        pageSize: limit,
        totalPages: Math.ceil(total / limit),
      } as PaginatedResponse<any>,
    });
  } catch (error) {
    console.error("List customers error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch customers",
    });
  }
};

/**
 * Get customer details with order history
 * GET /api/admin/customers/:id
 */
export const handleGetCustomer: RequestHandler = async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.params.id },
      include: {
        orders: {
          include: {
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
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        error: "Customer not found",
      });
    }

    // Calculate customer stats
    const totalOrders = customer.orders.length;
    const totalSpent = customer.orders.reduce((sum, order) => sum + order.total, 0);
    const lastOrder = customer.orders[0]?.createdAt || null;

    return res.json({
      success: true,
      data: {
        ...customer,
        stats: {
          totalOrders,
          totalSpent,
          lastOrder,
          averageOrderValue: totalOrders > 0 ? totalSpent / totalOrders : 0,
        },
      },
    });
  } catch (error) {
    console.error("Get customer error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch customer",
    });
  }
};

/**
 * Get customer statistics
 * GET /api/admin/customers/stats/summary
 */
export const handleCustomerStats: RequestHandler = async (req, res) => {
  try {
    const totalCustomers = await prisma.customer.count();

    // Get customers created last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newCustomersThisMonth = await prisma.customer.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Get total orders across all customers
    const totalOrders = await prisma.order.count();

    // Calculate average orders per customer
    const averageOrdersPerCustomer = totalCustomers > 0 ? totalOrders / totalCustomers : 0;

    // Calculate average lifetime value (total revenue / total customers)
    const orderTotals = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
    });

    const totalRevenue = orderTotals._sum.total || 0;
    const averageLifetimeValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

    return res.json({
      success: true,
      data: {
        totalCustomers,
        newCustomersThisMonth,
        averageOrdersPerCustomer,
        averageLifetimeValue,
      },
    });
  } catch (error) {
    console.error("Customer stats error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch customer statistics",
    });
  }
};
