/**
 * Admin Dashboard Routes
 * Provides overview statistics and key metrics
 */

import { RequestHandler } from "express";
import { prisma } from "../../db";
import { DashboardStats, AdminResponse } from "@shared/plugins";

/**
 * Get dashboard statistics
 * GET /api/admin/dashboard/stats
 */
export const handleDashboardStats: RequestHandler = async (req, res) => {
  try {
    // Get all counts in parallel
    const [totalProducts, totalOrders, totalCustomers, pendingOrders] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.customer.count(),
      prisma.order.count({ where: { status: "pending" } }),
    ]);

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        customer: {
          select: {
            email: true,
          },
        },
      },
    });

    // Get low stock products
    const lowStockProducts = await prisma.product.findMany({
      where: {
        quantity: {
          lte: 10, // Alert threshold
        },
      },
      select: {
        id: true,
        name: true,
        quantity: true,
      },
      orderBy: { quantity: "asc" },
      take: 5,
    });

    // Calculate total revenue
    const completedOrders = await prisma.order.findMany({
      where: {
        status: {
          in: ["delivered", "shipped"],
        },
      },
    });

    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);

    const stats: DashboardStats = {
      totalProducts,
      totalOrders,
      totalCustomers,
      pendingOrders,
      totalRevenue,
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerEmail: order.customer?.email,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
      })),
      lowStockProducts,
    };

    return res.json({
      success: true,
      data: stats,
    } as AdminResponse<DashboardStats>);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch dashboard statistics",
    });
  }
};
