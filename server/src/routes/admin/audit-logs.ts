/**
 * Audit Log Routes
 * Track and retrieve admin actions
 */

import { RequestHandler } from "express";
import { prisma } from "../../db";

/**
 * Helper function to create audit log entry
 */
export async function createAuditLog(
  adminId: string | undefined,
  action: "create" | "update" | "delete",
  entity: string,
  entityId: string,
  changes?: any
) {
  try {
    await prisma.auditLog.create({
      data: {
        adminId: adminId || null,
        action,
        entity,
        entityId,
        changes: changes || null,
      },
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
    // Don't throw - audit logs shouldn't break the main operation
  }
}

/**
 * List audit logs with filters
 * GET /api/admin/audit-logs?page=1&limit=50&entity=product&action=update&adminId=xxx
 */
export const handleListAuditLogs: RequestHandler = async (req, res) => {
  try {
    const page = parseInt((req.query.page as string) || "1");
    const limit = parseInt((req.query.limit as string) || "50");
    const skip = (page - 1) * limit;
    
    const entity = req.query.entity as string | undefined;
    const action = req.query.action as string | undefined;
    const adminId = req.query.adminId as string | undefined;

    const where: any = {};
    if (entity) where.entity = entity;
    if (action) where.action = action;
    if (adminId) where.adminId = adminId;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    // Get admin details for logs
    const adminIds = [...new Set(logs.map((log) => log.adminId).filter(Boolean))];
    const admins = await prisma.admin.findMany({
      where: { id: { in: adminIds as string[] } },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    const adminMap = new Map(admins.map((a) => [a.id, a]));

    const logsWithAdmins = logs.map((log) => ({
      ...log,
      admin: log.adminId ? adminMap.get(log.adminId) : null,
    }));

    res.json({
      success: true,
      data: {
        items: logsWithAdmins,
        total,
        page,
        pageSize: limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("List audit logs error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch audit logs" });
  }
};

/**
 * Get audit log stats
 * GET /api/admin/audit-logs/stats
 */
export const handleAuditLogStats: RequestHandler = async (req, res) => {
  try {
    const [
      total,
      byAction,
      byEntity,
      recentCount,
    ] = await Promise.all([
      prisma.auditLog.count(),
      prisma.auditLog.groupBy({
        by: ["action"],
        _count: true,
      }),
      prisma.auditLog.groupBy({
        by: ["entity"],
        _count: true,
      }),
      prisma.auditLog.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        total,
        recentCount,
        byAction: byAction.reduce((acc, item) => {
          acc[item.action] = item._count;
          return acc;
        }, {} as Record<string, number>),
        byEntity: byEntity.reduce((acc, item) => {
          acc[item.entity] = item._count;
          return acc;
        }, {} as Record<string, number>),
      },
    });
  } catch (error) {
    console.error("Audit log stats error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch stats" });
  }
};

/**
 * Get recent activity for dashboard
 * GET /api/admin/audit-logs/recent?limit=10
 */
export const handleRecentActivity: RequestHandler = async (req, res) => {
  try {
    const limit = parseInt((req.query.limit as string) || "10");

    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    // Get admin details
    const adminIds = [...new Set(logs.map((log) => log.adminId).filter(Boolean))];
    const admins = await prisma.admin.findMany({
      where: { id: { in: adminIds as string[] } },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    const adminMap = new Map(admins.map((a) => [a.id, a]));

    const logsWithAdmins = logs.map((log) => ({
      ...log,
      admin: log.adminId ? adminMap.get(log.adminId) : null,
    }));

    res.json({
      success: true,
      data: logsWithAdmins,
    });
  } catch (error) {
    console.error("Recent activity error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch recent activity" });
  }
};

export default {};
