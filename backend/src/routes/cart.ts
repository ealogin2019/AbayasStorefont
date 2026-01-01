import { RequestHandler } from "express";
import { prisma } from "../db";
import { CartResponse, AddToCartRequest, UpdateCartItemRequest } from "@shared/api";

function calculateCart(items: any[]): { total: number; itemCount: number } {
  return {
    total: items.reduce((sum, item) => {
      const price = item.variant?.price ? Number(item.variant.price) : (item.product?.price || 0);
      return sum + price * item.quantity;
    }, 0),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

export const getCart: RequestHandler = async (req, res) => {
  try {
    let cartId = req.cookies.cartId;
    
    // If no cart exists, create one
    if (!cartId) {
      const newCart = await prisma.cart.create({
        data: {
          items: {
            create: [],
          },
        },
        include: {
          items: {
            include: { product: true, variant: true },
          },
        },
      });
      
      cartId = newCart.id;
      res.cookie("cartId", cartId, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });
      
      return res.json({ items: [], total: 0, itemCount: 0 });
    }

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: { product: true, variant: true },
        },
      },
    });

    if (!cart) {
      // Cart was deleted, create a new one
      const newCart = await prisma.cart.create({
        data: {
          items: {
            create: [],
          },
        },
        include: {
          items: {
            include: { product: true, variant: true },
          },
        },
      });
      
      res.cookie("cartId", newCart.id, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });
      
      return res.json({ items: [], total: 0, itemCount: 0 });
    }

    const { total, itemCount } = calculateCart(cart.items);
    const formattedItems = cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      product: item.product,
      variant: item.variant,
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
    let cartId = req.cookies.cartId;
    const { productId, quantity, size, color, variantId } = req.body as AddToCartRequest;

    if (!productId || !quantity) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get or create cart
    let cart;
    if (cartId) {
      cart = await prisma.cart.findUnique({ where: { id: cartId } });
    }
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          sessionId: req.sessionID || null, // For guest carts
        },
      });
      cartId = cart.id;
      // Set cookie
      res.cookie('cartId', cartId, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 days
    }

    // Use findFirst and pass `undefined` for optional fields so Prisma treats them as absent
    // (passing `null` caused PrismaClientValidationError when the generated client expected non-null)
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId,
        productId,
        variantId: variantId ?? undefined,
      },
    });

    let cartItem;
    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true, variant: true },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          cartId,
          productId,
          variantId: variantId ?? undefined,
          quantity,
          size,
          color,
        },
        include: { product: true, variant: true },
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
      include: { product: true, variant: true },
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
    const cartId = req.cookies.cartId;
    if (!cartId) {
      return res.status(400).json({ error: "No active cart found" });
    }

    await prisma.cartItem.deleteMany({
      where: { cartId },
    });

    res.json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: "Failed to clear cart" });
  }
};
