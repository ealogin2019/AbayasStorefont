/**
 * Admin Inventory Routes
 * Endpoints for inventory management dashboard
 */

import { RequestHandler } from "express";
import { prisma } from "../../db.js";
import { inventoryPlugin } from "../../plugins/inventory-management.js";

/**
 * Get low stock products
 * GET /api/admin/inventory/low-stock
 */
export const handleGetLowStock: RequestHandler = async (req, res) => {
  try {
    const products = await inventoryPlugin.getLowStockProducts();
    
    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Get low stock error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch low stock products" });
  }
};

/**
 * Get out of stock products
 * GET /api/admin/inventory/out-of-stock
 */
export const handleGetOutOfStock: RequestHandler = async (req, res) => {
  try {
    const products = await inventoryPlugin.getOutOfStockProducts();
    
    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Get out of stock error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch out of stock products" });
  }
};

/**
 * Check stock for a product
 * GET /api/admin/inventory/check/:productId?quantity=5
 */
export const handleCheckStock: RequestHandler = async (req, res) => {
  try {
    const { productId } = req.params;
    const quantity = parseInt(req.query.quantity as string) || 1;

    const available = await inventoryPlugin.checkStock(productId, quantity);
    
    res.json({
      success: true,
      data: { productId, requestedQuantity: quantity, available },
    });
  } catch (error) {
    console.error("Check stock error:", error);
    res.status(500).json({ success: false, error: "Failed to check stock" });
  }
};

/**
 * Adjust stock for a product
 * POST /api/admin/inventory/adjust
 * Body: { productId, quantity, reason }
 */
export const handleAdjustStock: RequestHandler = async (req, res) => {
  try {
    const { productId, quantity, reason } = req.body;

    if (!productId || typeof quantity !== "number") {
      return res.status(400).json({ success: false, error: "productId and quantity are required" });
    }

    await inventoryPlugin.adjustStock(productId, quantity, reason || "Manual adjustment");
    
    // Get updated product
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, quantity: true },
    });

    res.json({
      success: true,
      data: product,
      message: "Stock adjusted successfully",
    });
  } catch (error) {
    console.error("Adjust stock error:", error);
    res.status(500).json({ success: false, error: "Failed to adjust stock" });
  }
};

/**
 * Get inventory summary stats
 * GET /api/admin/inventory/stats
 */
export const handleInventoryStats: RequestHandler = async (req, res) => {
  try {
    const [totalProducts, inStock, lowStock, outOfStock] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { quantity: { gt: 10 } } }),
      prisma.product.count({ where: { quantity: { lte: 10, gt: 0 } } }),
      prisma.product.count({ where: { quantity: 0 } }),
    ]);

    const totalInventoryValue = await prisma.product.aggregate({
      _sum: { price: true },
    });

    res.json({
      success: true,
      data: {
        totalProducts,
        inStock,
        lowStock,
        outOfStock,
        totalInventoryValue: totalInventoryValue._sum.price || 0,
      },
    });
  } catch (error) {
    console.error("Inventory stats error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch inventory stats" });
  }
};

export default {};
