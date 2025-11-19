import { RequestHandler } from "express";
import { prisma } from "../../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRY = "30d"; // 30 days for customer sessions

// Validation schemas
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8),
});

// Customer Signup
export const handleCustomerSignup: RequestHandler = async (req, res) => {
  try {
    const data = signupSchema.parse(req.body);

    // Check if customer already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { email: data.email },
    });

    if (existingCustomer) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        createdAt: true,
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: customer.id, email: customer.email, type: "customer" },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    res.json({
      customer,
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    console.error("Signup error:", error);
    res.status(500).json({ error: "Failed to create account" });
  }
};

// Customer Login
export const handleCustomerLogin: RequestHandler = async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);

    // Find customer
    const customer = await prisma.customer.findUnique({
      where: { email: data.email },
    });

    if (!customer) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password
    const validPassword = await bcrypt.compare(data.password, customer.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: customer.id, email: customer.email, type: "customer" },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    res.json({
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        country: customer.country,
        zipCode: customer.zipCode,
      },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
};

// Get Customer Profile
export const handleGetProfile: RequestHandler = async (req, res) => {
  try {
    const customerId = (req as any).customerId;

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        city: true,
        country: true,
        zipCode: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Failed to get profile" });
  }
};

// Update Customer Profile
export const handleUpdateProfile: RequestHandler = async (req, res) => {
  try {
    const customerId = (req as any).customerId;
    const data = updateProfileSchema.parse(req.body);

    const customer = await prisma.customer.update({
      where: { id: customerId },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        city: true,
        country: true,
        zipCode: true,
        updatedAt: true,
      },
    });

    res.json(customer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// Change Password
export const handleChangePassword: RequestHandler = async (req, res) => {
  try {
    const customerId = (req as any).customerId;
    const data = changePasswordSchema.parse(req.body);

    // Get customer
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Verify current password
    const validPassword = await bcrypt.compare(data.currentPassword, customer.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    // Update password
    await prisma.customer.update({
      where: { id: customerId },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    console.error("Change password error:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
};

// Get Customer Orders
export const handleGetCustomerOrders: RequestHandler = async (req, res) => {
  try {
    const customerId = (req as any).customerId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

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
    console.error("Get orders error:", error);
    res.status(500).json({ error: "Failed to get orders" });
  }
};
