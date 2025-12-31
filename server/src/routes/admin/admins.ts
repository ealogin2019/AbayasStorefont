/**
 * Admin User Management Routes
 * Manage admin accounts and permissions
 */

import { RequestHandler } from "express";
import { z } from "zod";
import { prisma } from "../../db";
import { hashPassword } from "../../utils";

/**
 * List all admin users
 * GET /api/admin/admins
 */
export const handleListAdmins: RequestHandler = async (req, res) => {
  try {
    const page = parseInt((req.query.page as string) || "1");
    const limit = parseInt((req.query.limit as string) || "10");
    const skip = (page - 1) * limit;

    const [admins, total] = await Promise.all([
      prisma.admin.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          active: true,
          lastLogin: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.admin.count(),
    ]);

    res.json({
      success: true,
      data: {
        items: admins,
        total,
        page,
        pageSize: limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("List admins error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch admins" });
  }
};

/**
 * Get single admin by ID
 * GET /api/admin/admins/:id
 */
export const handleGetAdmin: RequestHandler = async (req, res) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        active: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!admin) {
      return res.status(404).json({ success: false, error: "Admin not found" });
    }

    res.json({ success: true, data: admin });
  } catch (error) {
    console.error("Get admin error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch admin" });
  }
};

/**
 * Create new admin user
 * POST /api/admin/admins
 */
export const handleCreateAdminUser: RequestHandler = async (req, res) => {
  try {
    const schema = z.object({
      email: z.string().email("Invalid email address"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      role: z.enum(["admin", "manager", "editor"]).default("editor"),
    });

    const data = schema.parse(req.body);

    // Check if email already exists
    const existing = await prisma.admin.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: "Email already in use",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        active: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        active: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      data: admin,
      message: "Admin user created successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message,
      });
    }
    console.error("Create admin error:", error);
    res.status(500).json({ success: false, error: "Failed to create admin" });
  }
};

/**
 * Update admin user
 * PUT /api/admin/admins/:id
 */
export const handleUpdateAdmin: RequestHandler = async (req, res) => {
  try {
    const schema = z.object({
      email: z.string().email().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      role: z.enum(["admin", "manager", "editor"]).optional(),
      active: z.boolean().optional(),
      password: z.string().min(8).optional(),
    });

    const data = schema.parse(req.body);

    // Check if admin exists
    const admin = await prisma.admin.findUnique({
      where: { id: req.params.id },
    });

    if (!admin) {
      return res.status(404).json({ success: false, error: "Admin not found" });
    }

    // Prevent self-deactivation
    if (data.active === false && req.admin?.adminId === req.params.id) {
      return res.status(400).json({
        success: false,
        error: "Cannot deactivate your own account",
      });
    }

    // Prepare update data
    const updateData: any = {};
    if (data.email) updateData.email = data.email;
    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.role) updateData.role = data.role;
    if (data.active !== undefined) updateData.active = data.active;
    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }

    // Update admin
    const updated = await prisma.admin.update({
      where: { id: req.params.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        active: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      data: updated,
      message: "Admin user updated successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message,
      });
    }
    console.error("Update admin error:", error);
    res.status(500).json({ success: false, error: "Failed to update admin" });
  }
};

/**
 * Delete admin user
 * DELETE /api/admin/admins/:id
 */
export const handleDeleteAdmin: RequestHandler = async (req, res) => {
  try {
    // Prevent self-deletion
    if (req.admin?.adminId === req.params.id) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete your own account",
      });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: req.params.id },
    });

    if (!admin) {
      return res.status(404).json({ success: false, error: "Admin not found" });
    }

    await prisma.admin.delete({
      where: { id: req.params.id },
    });

    res.json({
      success: true,
      message: "Admin user deleted successfully",
    });
  } catch (error) {
    console.error("Delete admin error:", error);
    res.status(500).json({ success: false, error: "Failed to delete admin" });
  }
};

/**
 * Get admin stats
 * GET /api/admin/admins/stats/summary
 */
export const handleAdminStats: RequestHandler = async (req, res) => {
  try {
    const [total, active, byRole] = await Promise.all([
      prisma.admin.count(),
      prisma.admin.count({ where: { active: true } }),
      prisma.admin.groupBy({
        by: ["role"],
        _count: true,
      }),
    ]);

    res.json({
      success: true,
      data: {
        total,
        active,
        inactive: total - active,
        byRole: byRole.reduce((acc, item) => {
          acc[item.role] = item._count;
          return acc;
        }, {} as Record<string, number>),
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch stats" });
  }
};

export default {};
