/**
 * Plugin System Types & Interfaces
 * Defines the contract for all plugins in the CMS
 */

// Types will be imported from prisma after migration
export type Product = any;
export type Order = any;
export type OrderItem = any;

/**
 * Plugin Setting - Configuration option for a plugin
 */
export interface PluginSetting {
  key: string;
  label: string;
  type: "text" | "number" | "boolean" | "select" | "textarea";
  default?: any;
  description?: string;
  options?: Array<{ value: string; label: string }>; // For select type
}

/**
 * Plugin Hook Types - Available lifecycle hooks
 */
export interface PluginHooks {
  // Product hooks
  onProductCreate?: (product: Product) => Promise<void>;
  onProductUpdate?: (product: Product, oldProduct?: Product) => Promise<void>;
  onProductDelete?: (productId: string) => Promise<void>;

  // Order hooks
  onOrderCreate?: (order: Order & { items: OrderItem[] }) => Promise<void>;
  onOrderUpdate?: (order: Order, status: string) => Promise<void>;
  onOrderShip?: (order: Order) => Promise<void>;
  onOrderDeliver?: (order: Order) => Promise<void>;
  onOrderCancel?: (order: Order) => Promise<void>;

  // Initialization hook
  initialize?: () => Promise<void>;

  // Scheduled task hook (runs periodically)
  onSchedule?: () => Promise<void>;
}

/**
 * Main Plugin Interface
 */
export interface Plugin extends PluginHooks {
  // Plugin metadata
  name: string; // Unique plugin identifier
  displayName?: string; // Human-readable name
  version: string;
  description?: string;
  author?: string;

  // Plugin classification
  type: "dashboard" | "data" | "service" | "integration";

  // Plugin configuration
  settings?: PluginSetting[];

  // Get admin UI component (for dashboard plugins)
  getAdminUI?: () => Promise<React.ComponentType<any>>;
}

/**
 * Plugin Manager Response Types
 */
export interface PluginInfo {
  name: string;
  displayName?: string;
  version: string;
  enabled: boolean;
  type: string;
  description?: string;
}

/**
 * Admin Response Types
 */
export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  admin: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
  };
}

export interface AdminTokenPayload {
  adminId: string;
  email: string;
  role: string;
}

/**
 * CMS API Response Types
 */
export interface AdminResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Dashboard Stats
 */
export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  pendingOrders: number;
  totalRevenue: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerEmail?: string;
    total: number;
    status: string;
    createdAt: Date;
  }>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    quantity: number;
  }>;
}
