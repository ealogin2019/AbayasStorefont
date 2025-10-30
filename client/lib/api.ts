import { GetProductResponse, ListProductsResponse } from "@shared/api";

export async function fetchJSON<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
}

export const api = {
  listProducts: () => fetchJSON<ListProductsResponse>("/api/products"),
  getProduct: (id: string) =>
    fetchJSON<GetProductResponse>(`/api/products/${id}`),
  sendContact: (payload: { name: string; email: string; message: string }) =>
    fetchJSON<{ message: string }>("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  createCheckout: (payload: {
    items: Array<{ id: string; qty: number }>;
    contact?: { name?: string; email?: string; address?: string };
  }) =>
    fetchJSON<{ orderId: string; status: string }>("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
};
