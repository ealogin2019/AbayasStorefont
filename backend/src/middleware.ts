/**
 * Admin Authentication Middleware
 * Protects admin routes and verifies JWT tokens
 */

import { Request, Response, NextFunction } from "express";
import { extractToken, verifyToken } from "./utils";
import { AdminTokenPayload } from "@shared/plugins";

/**
 * Middleware to verify admin authentication
 */
export function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Missing authentication token",
    });
  }

  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token",
    });
  }

  req.admin = payload;
  next();
}

/**
 * Middleware to check admin role
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        error: "Not authenticated",
      });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        error: "Insufficient permissions",
      });
    }

    next();
  };
}

/**
 * Check if user is admin only (super user)
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.admin || req.admin.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Admin access required",
    });
  }

  next();
}
