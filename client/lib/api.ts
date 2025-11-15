import {
  GetProductResponse,
  ListProductsResponse,
  CartResponse,
  CheckoutResponse,
  CreateProductRequest,
  AddToCartRequest,
  UpdateCartItemRequest,
  CheckoutRequest,
} from "@shared/api";

export async function fetchJSON<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
}

export const api = {
  // Products
  listProducts: () => fetchJSON<ListProductsResponse>("/api/products"),
  getProduct: (id: string) =>
    fetchJSON<GetProductResponse>(`/api/products/${id}`),
  createProduct: (payload: CreateProductRequest) =>
    fetchJSON<GetProductResponse>("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  updateProduct: (id: string, payload: Partial<CreateProductRequest>) =>
    fetchJSON<GetProductResponse>(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  deleteProduct: (id: string) =>
    fetchJSON<{ message: string }>(`/api/products/${id}`, {
      method: "DELETE",
    }),

  // Cart
  getCart: (customerId: string) =>
    fetchJSON<CartResponse>(`/api/cart?customerId=${customerId}`),
  addToCart: (payload: AddToCartRequest & { customerId: string }) =>
    fetchJSON<any>("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  updateCartItem: (cartItemId: string, payload: UpdateCartItemRequest) =>
    fetchJSON<any>(`/api/cart/${cartItemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  removeFromCart: (cartItemId: string) =>
    fetchJSON<{ message: string }>(`/api/cart/${cartItemId}`, {
      method: "DELETE",
    }),
  clearCart: (customerId: string) =>
    fetchJSON<{ message: string }>("/api/cart/clear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId }),
    }),

  // Contact & Checkout
  sendContact: (payload: { name: string; email: string; message: string }) =>
    fetchJSON<{ message: string }>("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  createCheckout: (payload: CheckoutRequest) =>
    fetchJSON<CheckoutResponse>("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
};

