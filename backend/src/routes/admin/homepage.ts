/**
 * Admin Homepage Content Management Routes
 * Manage homepage images and content
 */

import { RequestHandler } from "express";
import { z } from "zod";
import { prisma } from "../../db";
import { createAuditLog } from "./audit-logs";

/**
 * Homepage content validation schema
 */
const homepageContentSchema = z.object({
  section: z.enum(["hero", "gallery", "banner"]),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  image: z.string().min(1, "Image is required").refine(
    (val) => val.startsWith("/uploads/") || val.startsWith("http"),
    "Image must be a valid URL or local upload path"
  ),
  link: z.string().optional(),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

const homepageContentUpdateSchema = homepageContentSchema.partial();

/**
 * List homepage content by section
 * GET /api/admin/homepage?section=hero
 */
export const handleListHomepageContent: RequestHandler = async (req, res) => {
  try {
    const section = req.query.section as string | undefined;
    const where = section ? { section, isActive: true } : { isActive: true };

    const items = await prisma.homepageContent.findMany({
      where,
      orderBy: { order: "asc" },
    });

    return res.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error("List homepage content error:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch homepage content" });
  }
};

/**
 * Create homepage content
 * POST /api/admin/homepage
 */
export const handleCreateHomepageContent: RequestHandler = async (req, res) => {
  try {
    const data = homepageContentSchema.parse(req.body);

    const content = await prisma.homepageContent.create({
      data: data as any,
    });

    // Audit log
    await createAuditLog(
      (req as any).adminId,
      "create",
      "homepage_content",
      content.id,
      data
    );

    return res.status(201).json({
      success: true,
      data: content,
      message: "Homepage content created successfully"
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: error.errors
      });
    }
    console.error("Create homepage content error:", error);
    return res.status(500).json({ success: false, error: "Failed to create homepage content" });
  }
};

/**
 * Update homepage content
 * PUT /api/admin/homepage/:id
 */
export const handleUpdateHomepageContent: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const data = homepageContentUpdateSchema.parse(req.body);

    const existing = await prisma.homepageContent.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: "Homepage content not found" });
    }

    const content = await prisma.homepageContent.update({
      where: { id },
      data: data as any,
    });

    // Audit log
    await createAuditLog(
      (req as any).adminId,
      "update",
      "homepage_content",
      content.id,
      data
    );

    return res.json({
      success: true,
      data: content,
      message: "Homepage content updated successfully"
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: error.errors
      });
    }
    console.error("Update homepage content error:", error);
    return res.status(500).json({ success: false, error: "Failed to update homepage content" });
  }
};

/**
 * Delete homepage content
 * DELETE /api/admin/homepage/:id
 */
export const handleDeleteHomepageContent: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;

    const existing = await prisma.homepageContent.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: "Homepage content not found" });
    }

    await prisma.homepageContent.delete({
      where: { id },
    });

    // Audit log
    await createAuditLog(
      (req as any).adminId,
      "delete",
      "homepage_content",
      id,
      { deleted: true }
    );

    return res.json({
      success: true,
      message: "Homepage content deleted successfully"
    });
  } catch (error) {
    console.error("Delete homepage content error:", error);
    return res.status(500).json({ success: false, error: "Failed to delete homepage content" });
  }
};

/**
 * Get homepage content for public display
 * GET /api/homepage
 */
export const handleGetPublicHomepageContent: RequestHandler = async (req, res) => {
  try {
    const content = await prisma.homepageContent.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    // Group by section
    const grouped = content.reduce((acc, item) => {
      if (!acc[item.section]) {
        acc[item.section] = [];
      }
      acc[item.section].push(item);
      return acc;
    }, {} as Record<string, typeof content>);

    return res.json({
      success: true,
      data: grouped
    });
  } catch (error) {
    console.error("Get public homepage content error:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch homepage content" });
  }
};