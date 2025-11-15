import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo.js";
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from "./routes/products.js";
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from "./routes/cart.js";
import { handleContact } from "./routes/contact.js";
import { handleCheckout } from "./routes/checkout.js";

// Admin routes
import { handleAdminLogin, handleCreateAdmin, handleGetProfile } from "./routes/admin/auth.js";
import {
  handleListProducts as handleListAdminProducts,
  handleGetProduct as handleGetAdminProduct,
  handleCreateProduct as handleCreateAdminProduct,
  handleUpdateProduct,
  handleDeleteProduct,
} from "./routes/admin/products.js";
import {
  handleListOrders,
  handleGetOrder,
  handleUpdateOrderStatus,
  handleOrderStats,
} from "./routes/admin/orders.js";
import {
  handleListCustomers,
  handleGetCustomer,
  handleCustomerStats,
} from "./routes/admin/customers.js";
import { handleDashboardStats } from "./routes/admin/dashboard.js";

// Auth middleware
import { authenticateAdmin, requireRole } from "./auth/middleware.js";

// Plugin system
import { pluginManager } from "./plugins/manager.js";

export async function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize plugin system
  await pluginManager.initializeAll();

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Product API (public)
  app.get("/api/products", listProducts);
  app.get("/api/products/:id", getProduct);
  app.post("/api/products", createProduct);
  app.put("/api/products/:id", updateProduct);
  app.delete("/api/products/:id", deleteProduct);

  // Cart API
  app.get("/api/cart", getCart);
  app.post("/api/cart", addToCart);
  app.put("/api/cart/:id", updateCartItem);
  app.delete("/api/cart/:id", removeFromCart);
  app.post("/api/cart/clear", clearCart);

  // Contact & Checkout
  app.post("/api/contact", handleContact);
  app.post("/api/checkout", handleCheckout);

  // ============================================
  // ADMIN API ROUTES (Protected)
  // ============================================

  // Admin Authentication (no protection needed for login/signup)
  app.post("/api/admin/auth/login", handleAdminLogin);
  app.post("/api/admin/auth/create-admin", handleCreateAdmin);
  app.get("/api/admin/auth/profile", authenticateAdmin, handleGetProfile);

  // Admin Dashboard (protected)
  app.get("/api/admin/dashboard/stats", authenticateAdmin, handleDashboardStats);

  // Admin Products (protected)
  app.get("/api/admin/products", authenticateAdmin, handleListAdminProducts);
  app.get("/api/admin/products/:id", authenticateAdmin, handleGetAdminProduct);
  app.post("/api/admin/products", authenticateAdmin, requireRole("admin", "editor"), handleCreateAdminProduct);
  app.put("/api/admin/products/:id", authenticateAdmin, requireRole("admin", "editor"), handleUpdateProduct);
  app.delete("/api/admin/products/:id", authenticateAdmin, requireRole("admin"), handleDeleteProduct);

  // Admin Orders (protected)
  app.get("/api/admin/orders", authenticateAdmin, handleListOrders);
  app.get("/api/admin/orders/stats/summary", authenticateAdmin, handleOrderStats);
  app.get("/api/admin/orders/:id", authenticateAdmin, handleGetOrder);
  app.put("/api/admin/orders/:id/status", authenticateAdmin, requireRole("admin", "manager"), handleUpdateOrderStatus);

  // Admin Customers (protected)
  app.get("/api/admin/customers", authenticateAdmin, handleListCustomers);
  app.get("/api/admin/customers/stats/summary", authenticateAdmin, handleCustomerStats);
  app.get("/api/admin/customers/:id", authenticateAdmin, handleGetCustomer);

  return app;
}

