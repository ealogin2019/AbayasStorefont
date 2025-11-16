
import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { handleDemo } from "./routes/demo.js";
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from "./routes/products.js";
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from "./routes/cart.js";
import { handleContact } from "./routes/contact.js";
// Import the new Stripe checkout router
import checkoutRouter from "./routes/checkout.js";

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
import { handleUploadImage, handleDeleteImage } from "./routes/admin/upload.js";

// Auth middleware
import { authenticateAdmin, requireRole } from "./auth/middleware.js";

// Plugin system
import { pluginManager } from "./plugins/manager.js";

// Setup file upload middleware
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Special middleware for Stripe webhook (before JSON parsing)
  app.use("/api/checkout/webhook", express.raw({ type: "application/json" }));

  // Serve static files from public folder (including uploads)
  app.use(express.static(path.join(__dirname, "..", "public")));

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

  // Contact
  app.post("/api/contact", handleContact);

  // Stripe Checkout API (replaces the old handleCheckout)
  app.use("/api/checkout", checkoutRouter);

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

  // Admin Image Upload (protected)
  app.post("/api/admin/upload", authenticateAdmin, upload.single("file"), handleUploadImage);
  app.delete("/api/admin/upload/:filename", authenticateAdmin, handleDeleteImage);

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