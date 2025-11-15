/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// ============ PRODUCT TYPES ============
export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  thumbnail: string;
  gallery?: string[];
  colors: string[];
  sizes: string[];
  description: string;
  tags: string[];
  inStock: boolean;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListProductsResponse {
  products: Product[];
}

export interface GetProductResponse {
  product: Product;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  currency?: string;
  image: string;
  thumbnail: string;
  gallery?: string[];
  colors: string[];
  sizes: string[];
  tags?: string[];
  inStock?: boolean;
  quantity?: number;
}

// ============ CUSTOMER TYPES ============
export interface Customer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  customer: Customer;
  token: string;
}

export interface UpdateCustomerRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  zipCode?: string;
}

// ============ CART TYPES ============
export interface CartItemData {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  size?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  items: CartItemData[];
  total: number;
  itemCount: number;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface UpdateCartItemRequest {
  quantity: number;
  size?: string;
  color?: string;
}

export interface RemoveFromCartRequest {
  cartItemId: string;
}

// ============ ORDER TYPES ============
export interface OrderItemData {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  notes?: string;
  items?: OrderItemData[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  shippingCost?: number;
  tax?: number;
  notes?: string;
}

export interface CheckoutRequest {
  customerId?: string;
  email?: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  phone: string;
  shippingCost?: number;
  tax?: number;
  notes?: string;
}

export interface CheckoutResponse {
  order: Order;
  message: string;
}

export interface OrderListResponse {
  orders: Order[];
}

// ============ API ERROR RESPONSE ============
export interface ApiError {
  error: string;
  message?: string;
  code?: string;
}
