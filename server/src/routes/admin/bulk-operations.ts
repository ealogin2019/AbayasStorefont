import { RequestHandler } from "express";
import { z } from "zod";
import { prisma } from "../../db";
import { createAuditLog } from "./audit-logs";

/**
 * Bulk delete products
 * POST /api/admin/products/bulk/delete
 */
export const handleBulkDeleteProducts: RequestHandler = async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Product IDs array is required",
      });
    }

    // Delete products
    const result = await prisma.product.deleteMany({
      where: {
        id: { in: productIds },
      },
    });

    // Create audit logs
    const adminId = (req as any).admin?.id;
    if (adminId) {
      await Promise.all(
        productIds.map((id) =>
          createAuditLog(adminId, "delete", "product", id, { bulkOperation: true })
        )
      );
    }

    return res.json({
      success: true,
      data: {
        deletedCount: result.count,
      },
    });
  } catch (error) {
    console.error("Bulk delete products error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to delete products",
    });
  }
};

/**
 * Bulk update product prices
 * POST /api/admin/products/bulk/update-price
 */
export const handleBulkUpdatePrice: RequestHandler = async (req, res) => {
  try {
    const { productIds, priceChange, changeType } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Product IDs array is required",
      });
    }

    if (typeof priceChange !== "number") {
      return res.status(400).json({
        success: false,
        error: "Price change value is required",
      });
    }

    // Get current products
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // Calculate new prices
    const updates = products.map((product) => {
      let newPrice: number;

      if (changeType === "percentage") {
        // Percentage change (e.g., +10% or -10%)
        newPrice = product.price * (1 + priceChange / 100);
      } else if (changeType === "fixed") {
        // Fixed amount change
        newPrice = product.price + priceChange;
      } else {
        // Set to specific price
        newPrice = priceChange;
      }

      // Ensure price is not negative
      newPrice = Math.max(0, newPrice);

      return prisma.product.update({
        where: { id: product.id },
        data: { price: newPrice },
      });
    });

    await Promise.all(updates);

    // Create audit logs
    const adminId = (req as any).admin?.id;
    if (adminId) {
      await Promise.all(
        products.map((product) =>
          createAuditLog(adminId, "update", "product", product.id, {
            bulkOperation: true,
            priceChange,
            changeType,
            oldPrice: product.price,
          })
        )
      );
    }

    return res.json({
      success: true,
      data: {
        updatedCount: products.length,
      },
    });
  } catch (error) {
    console.error("Bulk update price error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to update prices",
    });
  }
};

/**
 * Bulk update product stock
 * POST /api/admin/products/bulk/update-stock
 */
export const handleBulkUpdateStock: RequestHandler = async (req, res) => {
  try {
    const { productIds, stockChange, changeType } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Product IDs array is required",
      });
    }

    if (typeof stockChange !== "number") {
      return res.status(400).json({
        success: false,
        error: "Stock change value is required",
      });
    }

    // Get current products
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // Calculate new stock quantities
    const updates = products.map((product) => {
      let newQuantity: number;

      if (changeType === "add") {
        newQuantity = product.quantity + stockChange;
      } else if (changeType === "subtract") {
        newQuantity = product.quantity - stockChange;
      } else {
        // Set to specific quantity
        newQuantity = stockChange;
      }

      // Ensure quantity is not negative
      newQuantity = Math.max(0, newQuantity);

      return prisma.product.update({
        where: { id: product.id },
        data: {
          quantity: newQuantity,
          inStock: newQuantity > 0,
        },
      });
    });

    await Promise.all(updates);

    // Create audit logs
    const adminId = (req as any).admin?.id;
    if (adminId) {
      await Promise.all(
        products.map((product) =>
          createAuditLog(adminId, "update", "product", product.id, {
            bulkOperation: true,
            stockChange,
            changeType,
            oldQuantity: product.quantity,
          })
        )
      );
    }

    return res.json({
      success: true,
      data: {
        updatedCount: products.length,
      },
    });
  } catch (error) {
    console.error("Bulk update stock error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to update stock",
    });
  }
};

/**
 * Bulk add tags to products
 * POST /api/admin/products/bulk/add-tags
 */
export const handleBulkAddTags: RequestHandler = async (req, res) => {
  try {
    const { productIds, tags } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Product IDs array is required",
      });
    }

    if (!Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Tags array is required",
      });
    }

    // Get current products
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // Add tags to existing tags
    const updates = products.map((product) => {
      const existingTags = (product.tags as string[]) || [];
      const newTags = Array.from(new Set([...existingTags, ...tags]));

      return prisma.product.update({
        where: { id: product.id },
        data: { tags: newTags },
      });
    });

    await Promise.all(updates);

    // Create audit logs
    const adminId = (req as any).admin?.id;
    if (adminId) {
      await Promise.all(
        products.map((product) =>
          createAuditLog(adminId, "update", "product", product.id, {
            bulkOperation: true,
            addedTags: tags,
          })
        )
      );
    }

    return res.json({
      success: true,
      data: {
        updatedCount: products.length,
      },
    });
  } catch (error) {
    console.error("Bulk add tags error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to add tags",
    });
  }
};

/**
 * Export products to CSV
 * GET /api/admin/products/export
 */
export const handleExportProducts: RequestHandler = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    // CSV header
    const header = [
      "ID",
      "Name",
      "Price",
      "Currency",
      "Quantity",
      "In Stock",
      "Colors",
      "Sizes",
      "Tags",
      "Created At",
    ].join(",");

    // CSV rows
    const rows = products.map((product) => {
      const colors = (product.colors as string[]).join(";");
      const sizes = (product.sizes as string[]).join(";");
      const tags = ((product.tags as string[]) || []).join(";");

      return [
        product.id,
        `"${product.name.replace(/"/g, '""')}"`,
        product.price,
        product.currency,
        product.quantity,
        product.inStock ? "Yes" : "No",
        `"${colors}"`,
        `"${sizes}"`,
        `"${tags}"`,
        product.createdAt.toISOString(),
      ].join(",");
    });

    const csv = [header, ...rows].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="products-${Date.now()}.csv"`);
    return res.send(csv);
  } catch (error) {
    console.error("Export products error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to export products",
    });
  }
};
