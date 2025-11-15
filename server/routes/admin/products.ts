/**
 * Admin Product Management Routes
 * CRUD operations for products
 */

import { RequestHandler } from "express";
import { z } from "zod";
import { prisma } from "../../db.js";
import { pluginManager } from "../../plugins/manager.js";
import { AdminResponse, PaginatedResponse } from "@shared/plugins";

/**
 * Product validation schema
 */
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  currency: z.string().default("AED"),
  image: z.string().url("Image must be a valid URL"),
  thumbnail: z.string().url("Thumbnail must be a valid URL"),
  gallery: z.array(z.string().url()).optional(),
  colors: z.array(z.string()),
  sizes: z.array(z.string()),
  tags: z.array(z.string()).optional(),
  quantity: z.number().int().default(0),
  inStock: z.boolean().default(true),
});

/**
 * List all products (with pagination)
 * GET /api/admin/products?page=1&limit=10&search=abaya
 */
export const handleListProducts: RequestHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";

    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return res.json({
      success: true,
      data: {
        items: products,
        total,
        page,
        pageSize: limit,
        totalPages: Math.ceil(total / limit),
      } as PaginatedResponse<any>,
    } as AdminResponse<PaginatedResponse<any>>);
  } catch (error) {
    console.error("List products error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch products",
    });
  }
};

/**
 * Get single product
 * GET /api/admin/products/:id
 */
export const handleGetProduct: RequestHandler = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    return res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Get product error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch product",
    });
  }
};

/**
 * Create new product
 * POST /api/admin/products
 */
export const handleCreateProduct: RequestHandler = async (req, res) => {
  try {
    const data = productSchema.parse(req.body);

    // Check if product name already exists
    const existing = await prisma.product.findUnique({
      where: { name: data.name },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: "Product with this name already exists",
      });
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        currency: data.currency,
        image: data.image,
        thumbnail: data.thumbnail,
        gallery: data.gallery,
        colors: data.colors,
        sizes: data.sizes,
        tags: data.tags,
        quantity: data.quantity,
        inStock: data.inStock,
      },
    });

    // Trigger plugin hooks
    await pluginManager.triggerHook("onProductCreate", product);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message,
      });
    }

    console.error("Create product error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to create product",
    });
  }
};

/**
 * Update product
 * PUT /api/admin/products/:id
 */
export const handleUpdateProduct: RequestHandler = async (req, res) => {
  try {
    const productId = req.params.id;

    // Get existing product for comparison
    const oldProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!oldProduct) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    const data = productSchema.partial().parse(req.body);

    // Check name uniqueness if changed
    if (data.name && data.name !== oldProduct.name) {
      const existing = await prisma.product.findUnique({
        where: { name: data.name },
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          error: "Product with this name already exists",
        });
      }
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data,
    });

    // Trigger plugin hooks
    await pluginManager.triggerHook("onProductUpdate", {
      product,
      oldProduct,
    });

    return res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message,
      });
    }

    console.error("Update product error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to update product",
    });
  }
};

/**
 * Delete product
 * DELETE /api/admin/products/:id
 */
export const handleDeleteProduct: RequestHandler = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    // Trigger plugin hooks
    await pluginManager.triggerHook("onProductDelete", productId);

    return res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to delete product",
    });
  }
};
