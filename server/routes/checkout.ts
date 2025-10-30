import { RequestHandler } from "express";
import { Product } from "@shared/api";

export const handleCheckout: RequestHandler = (req, res) => {
  const { items, contact } = req.body as {
    items?: Array<{ id: string; qty: number }>;
    contact?: { name: string; email: string; address?: string };
  };

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Cart empty" });
  }

  // NOTE: This is a demo stub. In production you'd calculate totals on the server,
  // validate pricing, create an order in DB and integrate with a payment gateway.

  const orderId = `ORD_${Math.random().toString(36).slice(2, 9).toUpperCase()}`;

  console.log("Checkout request", { orderId, items, contact });

  res.json({
    orderId,
    status: "created",
    redirect: null,
    message: "Order created (demo).",
  });
};
