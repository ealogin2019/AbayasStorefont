import { RequestHandler } from "express";
import { prisma } from "../db";
import { ListProductsResponse, GetProductResponse, Product } from "@shared/api";

// Convert DB product to API product format
function formatProduct(product: any): Product {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    currency: product.currency,
    image: product.image,
    thumbnail: product.thumbnail,
    gallery: product.gallery ? (product.gallery as string[]) : undefined,
    colors: product.colors as string[],
    sizes: product.sizes as string[],
    tags: product.tags ? (product.tags as string[]) : [],
    inStock: product.inStock,
    quantity: product.quantity,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export const listProducts: RequestHandler = async (_req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    const formatted = products.map(formatProduct);
    res.json({ products: formatted } as ListProductsResponse);
  } catch (error) {
    console.error("Error listing products:", error);
    res.status(500).json({ error: "Failed to list products" });
  }
};

export const getProduct: RequestHandler = async (req, res) => {
  try {
    const id = String(req.params.id);
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ product: formatProduct(product) } as GetProductResponse);
  } catch (error) {
    console.error("Error getting product:", error);
    res.status(500).json({ error: "Failed to get product" });
  }
};

export const createProduct: RequestHandler = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      currency = "AED",
      image,
      thumbnail,
      gallery,
      colors,
      sizes,
      tags,
      inStock = true,
      quantity = 0,
    } = req.body;

    if (!name || !description || price === undefined || !image || !thumbnail) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        currency,
        image,
        thumbnail,
        gallery,
        colors,
        sizes,
        tags,
        inStock,
        quantity,
      },
    });

    res.status(201).json({ product: formatProduct(product) });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const updateProduct: RequestHandler = async (req, res) => {
  try {
    const id = String(req.params.id);
    const updates = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: updates,
    });

    res.json({ product: formatProduct(product) });
  } catch (error: any) {
    console.error("Error updating product:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteProduct: RequestHandler = async (req, res) => {
  try {
    const id = String(req.params.id);
    await prisma.product.delete({
      where: { id },
    });
    res.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(500).json({ error: "Failed to delete product" });
  }
};

