import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import { handleDemo } from "./routes/demo";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./routes/products";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "./routes/cart";
import { handleContact } from "./routes/contact";
import checkoutRouter from "./routes/checkout";

// Customer auth
import {
  handleCustomerSignup,
  handleCustomerLogin,
  handleGetProfile as handleGetCustomerProfile,
  handleUpdateProfile,
  handleChangePassword,
  handleGetCustomerOrders,
} from "./routes/customer/auth";
import ordersRouter from "./routes/customer/orders";

// Admin auth & routes
import { handleAdminLogin, handleCreateAdmin, handleGetProfile } from "./routes/admin/auth";
import {
  handleListProducts as handleListAdminProducts,
  handleGetProduct as handleGetAdminProduct,
  handleCreateProduct as handleCreateAdminProduct,
  handleUpdateProduct,
  handleDeleteProduct,
} from "./routes/admin/products";
import {
  handleListOrders,
  handleGetOrder,
  handleCreateOrder,
  handleUpdateOrderStatus,
  handleUpdateOrderTracking,
  handleOrderStats,
} from "./routes/admin/orders";
import { handleListCustomers, handleGetCustomer, handleCustomerStats } from "./routes/admin/customers";
import {
  handleListSettings,
  handleGetSetting,
  handleCreateSetting,
  handleUpdateSetting,
  handleDeleteSetting,
  handleSettingsStats,
} from "./routes/admin/settings";
import {
  handleGetLowStock,
  handleGetOutOfStock,
  handleCheckStock,
  handleAdjustStock,
  handleInventoryStats,
} from "./routes/admin/inventory";
import {
  handleBulkDeleteProducts,
  handleBulkUpdatePrice,
  handleBulkUpdateStock,
  handleBulkAddTags,
  handleExportProducts,
} from "./routes/admin/bulk-operations";
import {
  handleListAdmins,
  handleGetAdmin,
  handleCreateAdminUser,
  handleUpdateAdmin,
  handleDeleteAdmin,
  handleAdminStats,
} from "./routes/admin/admins";
import { handleListAuditLogs, handleAuditLogStats, handleRecentActivity } from "./routes/admin/audit-logs";
import { handleDashboardStats } from "./routes/admin/dashboard";
import { handleUploadImage, handleDeleteImage } from "./routes/admin/upload";
import {
  handleListHomepageContent,
  handleCreateHomepageContent,
  handleUpdateHomepageContent,
  handleDeleteHomepageContent,
} from "./routes/admin/homepage";

// Public homepage routes
import homepageRouter from "./routes/homepage";

// Middleware
import { authenticateAdmin, requireRole } from "./middleware";
import { authenticateCustomer } from "./customer-middleware";

// Plugins
import { pluginManager } from "./plugins/manager";

// File Upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4", "video/webm", "video/quicktime"];
    cb(null, allowedMimes.includes(file.mimetype));
  },
});

// Path helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createServer() {
  const app = express();

  // Middleware
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8080",
    process.env.FRONTEND_URL,
  ].filter(Boolean);

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (!allowedOrigins.includes(origin) && process.env.NODE_ENV === "production") {
        return callback(new Error("CORS policy does not allow this origin"), false);
      }
      callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  }));

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Stripe webhook raw body
  app.use("/api/checkout/webhook", express.raw({ type: "application/json" }));

  // Serve static files
  app.use(express.static(path.join(__dirname, "..", "public")));

  // Routes

  // Demo & Ping
  app.get("/api/ping", (_req, res) => res.json({ message: process.env.PING_MESSAGE || "pong" }));
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

  // Stripe Checkout
  app.use("/api/checkout", checkoutRouter);

  // Customer Routes

  // Auth
  app.post("/api/customer/auth/signup", handleCustomerSignup);
  app.post("/api/customer/auth/login", handleCustomerLogin);

  // Profile
  app.get("/api/customer/profile", authenticateCustomer, handleGetCustomerProfile);
  app.put("/api/customer/profile", authenticateCustomer, handleUpdateProfile);
  app.post("/api/customer/change-password", authenticateCustomer, handleChangePassword);

  // Orders (using router)
  app.use("/api/customer/orders", ordersRouter);

  // Admin Routes

  // Auth
  app.post("/api/admin/auth/login", handleAdminLogin);
  app.post("/api/admin/auth/create-admin", handleCreateAdmin);
  app.get("/api/admin/auth/profile", authenticateAdmin, handleGetProfile);

  // Dashboard
  app.get("/api/admin/dashboard/stats", authenticateAdmin, handleDashboardStats);

  // Products
  app.get("/api/admin/products", authenticateAdmin, handleListAdminProducts);
  app.get("/api/admin/products/:id", authenticateAdmin, handleGetAdminProduct);
  app.post("/api/admin/products", authenticateAdmin, requireRole("admin", "editor"), handleCreateAdminProduct);
  app.put("/api/admin/products/:id", authenticateAdmin, requireRole("admin", "editor"), handleUpdateProduct);
  app.delete("/api/admin/products/:id", authenticateAdmin, requireRole("admin"), handleDeleteProduct);

  // Bulk operations
  app.post("/api/admin/products/bulk/delete", authenticateAdmin, requireRole("admin"), handleBulkDeleteProducts);
  app.post("/api/admin/products/bulk/update-price", authenticateAdmin, requireRole("admin", "manager"), handleBulkUpdatePrice);
  app.post("/api/admin/products/bulk/update-stock", authenticateAdmin, requireRole("admin", "manager"), handleBulkUpdateStock);
  app.post("/api/admin/products/bulk/add-tags", authenticateAdmin, requireRole("admin", "manager"), handleBulkAddTags);
  app.get("/api/admin/products/export", authenticateAdmin, handleExportProducts);

  // Upload
  app.post("/api/admin/upload", authenticateAdmin, upload.single("file"), handleUploadImage);
  app.delete("/api/admin/upload/:filename", authenticateAdmin, handleDeleteImage);

  // Orders
  app.get("/api/admin/orders", authenticateAdmin, handleListOrders);
  app.get("/api/admin/orders/stats/summary", authenticateAdmin, handleOrderStats);
  app.post("/api/admin/orders", authenticateAdmin, requireRole("admin", "manager"), handleCreateOrder);
  app.get("/api/admin/orders/:id", authenticateAdmin, handleGetOrder);
  app.put("/api/admin/orders/:id/status", authenticateAdmin, requireRole("admin", "manager"), handleUpdateOrderStatus);
  app.put("/api/admin/orders/:id/tracking", authenticateAdmin, requireRole("admin", "manager"), handleUpdateOrderTracking);

  // Customers
  app.get("/api/admin/customers", authenticateAdmin, handleListCustomers);
  app.get("/api/admin/customers/stats/summary", authenticateAdmin, handleCustomerStats);
  app.get("/api/admin/customers/:id", authenticateAdmin, handleGetCustomer);

  // Settings
  app.get("/api/admin/settings", authenticateAdmin, handleListSettings);
  app.get("/api/admin/settings/stats/summary", authenticateAdmin, handleSettingsStats);
  app.get("/api/admin/settings/:id", authenticateAdmin, handleGetSetting);
  app.post("/api/admin/settings", authenticateAdmin, requireRole("admin", "manager"), handleCreateSetting);
  app.put("/api/admin/settings/:id", authenticateAdmin, requireRole("admin", "manager"), handleUpdateSetting);
  app.delete("/api/admin/settings/:id", authenticateAdmin, requireRole("admin"), handleDeleteSetting);

  // Inventory
  app.get("/api/admin/inventory/stats", authenticateAdmin, handleInventoryStats);
  app.get("/api/admin/inventory/low-stock", authenticateAdmin, handleGetLowStock);
  app.get("/api/admin/inventory/out-of-stock", authenticateAdmin, handleGetOutOfStock);
  app.get("/api/admin/inventory/check/:productId", authenticateAdmin, handleCheckStock);
  app.post("/api/admin/inventory/adjust", authenticateAdmin, requireRole("admin", "manager"), handleAdjustStock);

  // Admin Users
  app.get("/api/admin/admins", authenticateAdmin, requireRole("admin"), handleListAdmins);
  app.get("/api/admin/admins/stats/summary", authenticateAdmin, requireRole("admin"), handleAdminStats);
  app.get("/api/admin/admins/:id", authenticateAdmin, requireRole("admin"), handleGetAdmin);
  app.post("/api/admin/admins", authenticateAdmin, requireRole("admin"), handleCreateAdminUser);
  app.put("/api/admin/admins/:id", authenticateAdmin, requireRole("admin"), handleUpdateAdmin);
  app.delete("/api/admin/admins/:id", authenticateAdmin, requireRole("admin"), handleDeleteAdmin);

  // Audit Logs
  app.get("/api/admin/audit-logs", authenticateAdmin, handleListAuditLogs);
  app.get("/api/admin/audit-logs/stats", authenticateAdmin, handleAuditLogStats);
  app.get("/api/admin/audit-logs/recent", authenticateAdmin, handleRecentActivity);

  // Homepage Content
  app.get("/api/admin/homepage", authenticateAdmin, handleListHomepageContent);
  app.post("/api/admin/homepage", authenticateAdmin, requireRole("admin", "editor"), handleCreateHomepageContent);
  app.put("/api/admin/homepage/:id", authenticateAdmin, requireRole("admin", "editor"), handleUpdateHomepageContent);
  app.delete("/api/admin/homepage/:id", authenticateAdmin, requireRole("admin"), handleDeleteHomepageContent);

  // Public homepage
  app.use("/api/homepage", homepageRouter);

  return app;
}