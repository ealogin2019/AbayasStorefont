import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { listProducts, getProduct } from "./routes/products";
import { handleContact } from "./routes/contact";
import { handleCheckout } from "./routes/checkout";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Storefront API
  app.get("/api/products", listProducts);
  app.get("/api/products/:id", getProduct);
  app.post("/api/contact", handleContact);
  app.post("/api/checkout", handleCheckout);

  return app;
}
