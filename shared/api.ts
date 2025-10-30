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

// Storefront types
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
}

export interface ListProductsResponse {
  products: Product[];
}

export interface GetProductResponse {
  product: Product;
}
