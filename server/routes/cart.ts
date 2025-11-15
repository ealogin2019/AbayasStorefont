import { RequestHandler } from "express";
import { prisma } from "../db";
import { CartResponse, AddToCartRequest, UpdateCartItemRequest } from "@shared/api";

function calculateCart(items: any[]): { total: number; itemCount: number } {
  return {
    total: items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

export const getCart: RequestHandler = async (req, res) => {
  try {
    const customerId = req.query.customerId as string;
    if (!customerId) {
      return res.status(400).json({ error: "customerId is required" });
    }

    const items = await prisma.cartItem.findMany({
      where: { customerId },
      include: { product: true },
    });

    const { total, itemCount } = calculateCart(items);
    const formattedItems = items.map((item) => ({
      id: item.id,
      productId: item.productId,
      product: item.product,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));
    res.json({ items: formattedItems, total, itemCount });
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({ error: "Failed to get cart" });
  }
};

export const addToCart: RequestHandler = async (req, res) => {
  try {
    const { customerId, productId, quantity, size, color } = req.body as AddToCartRequest & { customerId: string };

    if (!customerId || !productId || !quantity) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        customerId_productId_size_color: {
          customerId,
          productId,
          size: size || null,
          color: color || null,
        },
      },
    });

    let cartItem;
    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          customerId,
          productId,
          quantity,
          size,
          color,
        },
        include: { product: true },
      });
    }

    res.json(cartItem);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

export const updateCartItem: RequestHandler = async (req, res) => {
  try {
    const id = String(req.params.id);
    const { quantity } = req.body as UpdateCartItemRequest;

    if (!quantity || quantity < 0) {
      return res.status(400).json({ error: "Invalid quantity" });
    }

    const cartItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: { product: true },
    });

    res.json(cartItem);
  } catch (error: any) {
    console.error("Error updating cart item:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Cart item not found" });
    }
    res.status(500).json({ error: "Failed to update cart item" });
  }
};

export const removeFromCart: RequestHandler = async (req, res) => {
  try {
    const id = String(req.params.id);
    await prisma.cartItem.delete({
      where: { id },
    });
    res.json({ message: "Item removed from cart" });
  } catch (error: any) {
    console.error("Error removing cart item:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Cart item not found" });
    }
    res.status(500).json({ error: "Failed to remove from cart" });
  }
};

export const clearCart: RequestHandler = async (req, res) => {
  try {
    const customerId = req.body.customerId as string;
    if (!customerId) {
      return res.status(400).json({ error: "customerId is required" });
    }

    await prisma.cartItem.deleteMany({
      where: { customerId },
    });

    res.json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: "Failed to clear cart" });
  }
};
