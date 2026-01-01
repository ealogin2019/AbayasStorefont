/**
 * Admin Authentication Routes
 * Login, logout, and token management
 */

import { RequestHandler } from "express";
import { z } from "zod";
import { prisma } from "../../db";
import { verifyPassword, hashPassword, generateToken } from "../../utils";
import { AdminResponse, AdminLoginResponse } from "@shared/plugins";

/**
 * Login validation schema
 */
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

/**
 * Admin login handler
 * POST /api/admin/auth/login
 */
export const handleAdminLogin: RequestHandler = async (req, res) => {
  try {
    const body = loginSchema.parse(req.body);

    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email: body.email },
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      } as AdminResponse<null>);
    }

    if (!admin.active) {
      return res.status(401).json({
        success: false,
        error: "Account is disabled",
      } as AdminResponse<null>);
    }

    // Verify password
    const passwordMatch = await verifyPassword(body.password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      } as AdminResponse<null>);
    }

    // Update last login
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() },
    });

    // Generate token
    const token = generateToken({
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
    });

    const response: AdminLoginResponse = {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName || undefined,
        lastName: admin.lastName || undefined,
        role: admin.role,
      },
    };

    return res.json({
      success: true,
      data: response,
    } as AdminResponse<AdminLoginResponse>);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message,
      } as AdminResponse<null>);
    }

    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    } as AdminResponse<null>);
  }
};

/**
 * Create initial admin account
 * POST /api/admin/auth/create-admin (should be protected or one-time only)
 */
export const handleCreateAdmin: RequestHandler = async (req, res) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8, "Password must be at least 8 characters"),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
    });

    const body = schema.parse(req.body);

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: body.email },
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        error: "Admin account already exists",
      } as AdminResponse<null>);
    }

    // Hash password
    const hashedPassword = await hashPassword(body.password);

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        email: body.email,
        password: hashedPassword,
        firstName: body.firstName,
        lastName: body.lastName,
        role: "admin", // First admin is always admin role
      },
    });

    return res.status(201).json({
      success: true,
      message: "Admin account created successfully",
      data: {
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message,
      } as AdminResponse<null>);
    }

    console.error("Create admin error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    } as AdminResponse<null>);
  }
};

/**
 * Get current admin profile
 * GET /api/admin/auth/profile
 */
export const handleGetProfile: RequestHandler = async (req, res) => {
  if (!req.admin) {
    return res.status(401).json({
      success: false,
      error: "Not authenticated",
    });
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.adminId },
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: "Admin not found",
      });
    }

    return res.json({
      success: true,
      data: {
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
