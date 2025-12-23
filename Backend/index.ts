
import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { handleDemo } from "./routes/demo.js";
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from "./routes/products.js";
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from "./routes/cart.js";
import { handleContact } from "./routes/contact.js";
// Import the new Stripe checkout router
import checkoutRouter from "./routes/checkout.js";

// Customer auth routes
import {
  handleCustomerSignup,
  handleCustomerLogin,
  handleGetProfile as handleGetCustomerProfile,
  handleUpdateProfile,
  handleChangePassword,
  handleGetCustomerOrders,
} from "./routes/customer/auth.js";
import { handleCreateOrderFromCart } from "./routes/customer/orders.js";

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
  handleCreateOrder,
  handleUpdateOrderStatus,
  handleUpdateOrderTracking,
  handleOrderStats,
} from "./routes/admin/orders.js";
import {
  handleListCustomers,
  handleGetCustomer,
  handleCustomerStats,
} from "./routes/admin/customers.js";
import {
  handleListSettings,
  handleGetSetting,
  handleCreateSetting,
  handleUpdateSetting,
  handleDeleteSetting,
  handleSettingsStats,
} from "./routes/admin/settings.js";
import {
  handleGetLowStock,
  handleGetOutOfStock,
  handleCheckStock,
  handleAdjustStock,
  handleInventoryStats,
} from "./routes/admin/inventory.js";
import {
  handleBulkDeleteProducts,
  handleBulkUpdatePrice,
  handleBulkUpdateStock,
  handleBulkAddTags,
  handleExportProducts,
} from "./routes/admin/bulk-operations.js";
import {
  handleListAdmins,
  handleGetAdmin,
  handleCreateAdminUser,
  handleUpdateAdmin,
  handleDeleteAdmin,
  handleAdminStats,
} from "./routes/admin/admins.js";
import {
  handleListAuditLogs,
  handleAuditLogStats,
  handleRecentActivity,
} from "./routes/admin/audit-logs.js";
import { handleDashboardStats } from "./routes/admin/dashboard.js";
import { handleUploadImage, handleDeleteImage } from "./routes/admin/upload.js";
import {
  handleListHomepageContent,
  handleCreateHomepageContent,
  handleUpdateHomepageContent,
  handleDeleteHomepageContent,
} from "./routes/admin/homepage";

// Public routes
import homepageRouter from "./routes/homepage.js";

// Auth middleware
import { authenticateAdmin, requireRole } from "./auth/middleware.js";
import { authenticateCustomer } from "./auth/customer-middleware.js";

// Plugin system
import { pluginManager } from "./plugins/manager.js";

// Setup file upload middleware
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max (for videos)
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg", "image/png", "image/gif", "image/webp",
      "video/mp4", "video/webm", "video/quicktime"
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images and short videos are allowed"));
    }
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Special middleware for Stripe webhook (before JSON parsing)
  app.use("/api/checkout/webhook", express.raw({ type: "application/json" }));

  // Serve static files from public folder (including uploads)
  app.use(express.static(path.join(__dirname, "..", "public")));

  // Initialize plugin system
  // await pluginManager.initializeAll();

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
  // CUSTOMER API ROUTES
  // ============================================

  // Customer Authentication (public endpoints)
  app.post("/api/customer/auth/signup", handleCustomerSignup);
  app.post("/api/customer/auth/login", handleCustomerLogin);

  // Customer Profile (protected)
  app.get("/api/customer/profile", authenticateCustomer, handleGetCustomerProfile);
  app.put("/api/customer/profile", authenticateCustomer, handleUpdateProfile);
  app.post("/api/customer/change-password", authenticateCustomer, handleChangePassword);

  // Customer Orders (protected)
  app.get("/api/customer/orders", authenticateCustomer, handleGetCustomerOrders);
  app.post("/api/customer/orders/create", handleCreateOrderFromCart);

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
  
  // Bulk operations
  app.post("/api/admin/products/bulk/delete", authenticateAdmin, requireRole("admin"), handleBulkDeleteProducts);
  app.post("/api/admin/products/bulk/update-price", authenticateAdmin, requireRole("admin", "manager"), handleBulkUpdatePrice);
  app.post("/api/admin/products/bulk/update-stock", authenticateAdmin, requireRole("admin", "manager"), handleBulkUpdateStock);
  app.post("/api/admin/products/bulk/add-tags", authenticateAdmin, requireRole("admin", "manager"), handleBulkAddTags);
  app.get("/api/admin/products/export", authenticateAdmin, handleExportProducts);

  // Admin Image Upload (protected)
  app.post("/api/admin/upload", authenticateAdmin, upload.single("file"), handleUploadImage);
  app.delete("/api/admin/upload/:filename", authenticateAdmin, handleDeleteImage);

  // Admin Orders (protected)
  // NOTE: Stats route MUST come before :id route to avoid collision
  app.get("/api/admin/orders", authenticateAdmin, handleListOrders);
  app.get("/api/admin/orders/stats/summary", authenticateAdmin, handleOrderStats);
  app.post("/api/admin/orders", authenticateAdmin, requireRole("admin", "manager"), handleCreateOrder);
  app.get("/api/admin/orders/:id", authenticateAdmin, handleGetOrder);
  app.put("/api/admin/orders/:id/status", authenticateAdmin, requireRole("admin", "manager"), handleUpdateOrderStatus);
  app.put("/api/admin/orders/:id/tracking", authenticateAdmin, requireRole("admin", "manager"), handleUpdateOrderTracking);

  // Admin Customers (protected)
  app.get("/api/admin/customers", authenticateAdmin, handleListCustomers);
  app.get("/api/admin/customers/stats/summary", authenticateAdmin, handleCustomerStats);
  app.get("/api/admin/customers/:id", authenticateAdmin, handleGetCustomer);

  // Admin Settings (protected)
  app.get("/api/admin/settings", authenticateAdmin, handleListSettings);
  app.get("/api/admin/settings/stats/summary", authenticateAdmin, handleSettingsStats);
  app.get("/api/admin/settings/:id", authenticateAdmin, handleGetSetting);
  app.post("/api/admin/settings", authenticateAdmin, requireRole("admin", "manager"), handleCreateSetting);
  app.put("/api/admin/settings/:id", authenticateAdmin, requireRole("admin", "manager"), handleUpdateSetting);
  app.delete("/api/admin/settings/:id", authenticateAdmin, requireRole("admin"), handleDeleteSetting);

  // Admin Inventory (protected)
  app.get("/api/admin/inventory/stats", authenticateAdmin, handleInventoryStats);
  app.get("/api/admin/inventory/low-stock", authenticateAdmin, handleGetLowStock);
  app.get("/api/admin/inventory/out-of-stock", authenticateAdmin, handleGetOutOfStock);
  app.get("/api/admin/inventory/check/:productId", authenticateAdmin, handleCheckStock);
  app.post("/api/admin/inventory/adjust", authenticateAdmin, requireRole("admin", "manager"), handleAdjustStock);

  // Admin User Management (protected - admin only)
  app.get("/api/admin/admins", authenticateAdmin, requireRole("admin"), handleListAdmins);
  app.get("/api/admin/admins/stats/summary", authenticateAdmin, requireRole("admin"), handleAdminStats);
  app.get("/api/admin/admins/:id", authenticateAdmin, requireRole("admin"), handleGetAdmin);
  app.post("/api/admin/admins", authenticateAdmin, requireRole("admin"), handleCreateAdminUser);
  app.put("/api/admin/admins/:id", authenticateAdmin, requireRole("admin"), handleUpdateAdmin);
  app.delete("/api/admin/admins/:id", authenticateAdmin, requireRole("admin"), handleDeleteAdmin);

  // Audit Logs (protected)
  app.get("/api/admin/audit-logs", authenticateAdmin, handleListAuditLogs);
  app.get("/api/admin/audit-logs/stats", authenticateAdmin, handleAuditLogStats);
  app.get("/api/admin/audit-logs/recent", authenticateAdmin, handleRecentActivity);

  // Admin Homepage Content (protected)
  app.get("/api/admin/homepage", authenticateAdmin, handleListHomepageContent);
  app.post("/api/admin/homepage", authenticateAdmin, requireRole("admin", "editor"), handleCreateHomepageContent);
  app.put("/api/admin/homepage/:id", authenticateAdmin, requireRole("admin", "editor"), handleUpdateHomepageContent);
  app.delete("/api/admin/homepage/:id", authenticateAdmin, requireRole("admin"), handleDeleteHomepageContent);

  // Public Homepage Content
  app.use("/api/homepage", homepageRouter);

  return app;
}