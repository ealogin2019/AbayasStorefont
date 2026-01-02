import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

interface JWTPayload {
  id: string;
  email: string;
  type: "customer" | "admin";
}

// Middleware to authenticate customer requests
export const authenticateCustomer: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    if (decoded.type !== "customer") {
      return res.status(403).json({ error: "Invalid token type" });
    }

    // Attach customer ID to request
    req.customerId = decoded.id;
    req.customerEmail = decoded.email;

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Optional authentication - doesn't fail if no token
export const optionalCustomerAuth: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

      if (decoded.type === "customer") {
        req.customerId = decoded.id;
        req.customerEmail = decoded.email;
      }
    }
  } catch (error) {
    // Silently fail - auth is optional
  }
  next();
};
