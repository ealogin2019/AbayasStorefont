/**
 * Admin Settings Routes
 * Manage key/value JSON settings used by the site and plugins
 */

import { RequestHandler } from "express";
import { z } from "zod";
import { prisma } from "../../db";

const createSettingSchema = z.object({
  key: z.string().min(1),
  value: z.any(),
  group: z.string().optional(),
  description: z.string().optional(),
});

const updateSettingSchema = z.object({
  value: z.any().optional(),
  group: z.string().optional(),
  description: z.string().optional(),
});

/**
 * List settings with optional group filter
 * GET /api/admin/settings?group=site&page=1&limit=50
 */
export const handleListSettings: RequestHandler = async (req, res) => {
  try {
    const page = parseInt((req.query.page as string) || "1");
    const limit = parseInt((req.query.limit as string) || "50");
    const group = req.query.group as string | undefined;
    const skip = (page - 1) * limit;

    const where = group ? { group } : {};

    const [items, total] = await Promise.all([
      prisma.setting.findMany({ where, skip, take: limit, orderBy: { key: "asc" } }),
      prisma.setting.count({ where }),
    ]);

    return res.json({ success: true, data: { items, total, page, pageSize: limit, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error("List settings error:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch settings" });
  }
};

/**
 * Get a single setting
 * GET /api/admin/settings/:id
 */
export const handleGetSetting: RequestHandler = async (req, res) => {
  try {
    const setting = await prisma.setting.findUnique({ where: { id: req.params.id } });
    if (!setting) return res.status(404).json({ success: false, error: "Setting not found" });
    return res.json({ success: true, data: setting });
  } catch (error) {
    console.error("Get setting error:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch setting" });
  }
};

/**
 * Create a setting
 * POST /api/admin/settings
 */
export const handleCreateSetting: RequestHandler = async (req, res) => {
  try {
    const payload = createSettingSchema.parse(req.body);

    // Prevent duplicate keys
    const existing = await prisma.setting.findUnique({ where: { key: payload.key } });
    if (existing) {
      return res.status(400).json({ success: false, error: "Setting key already exists" });
    }

    const created = await prisma.setting.create({
      data: {
        key: payload.key,
        value: payload.value,
        group: payload.group,
        description: payload.description,
      },
    });
    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors[0].message });
    }
    console.error("Create setting error:", error);
    return res.status(500).json({ success: false, error: "Failed to create setting" });
  }
};

/**
 * Update a setting
 * PUT /api/admin/settings/:id
 */
export const handleUpdateSetting: RequestHandler = async (req, res) => {
  try {
    const payload = updateSettingSchema.parse(req.body);

    const setting = await prisma.setting.findUnique({ where: { id: req.params.id } });
    if (!setting) return res.status(404).json({ success: false, error: "Setting not found" });

    const updated = await prisma.setting.update({
      where: { id: req.params.id },
      data: {
        ...(payload.value !== undefined ? { value: payload.value } : {}),
        ...(payload.group !== undefined ? { group: payload.group } : {}),
        ...(payload.description !== undefined ? { description: payload.description } : {}),
      },
    });
    return res.json({ success: true, data: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.errors[0].message });
    }
    console.error("Update setting error:", error);
    return res.status(500).json({ success: false, error: "Failed to update setting" });
  }
};

/**
 * Delete a setting
 * DELETE /api/admin/settings/:id
 */
export const handleDeleteSetting: RequestHandler = async (req, res) => {
  try {
    const setting = await prisma.setting.findUnique({ where: { id: req.params.id } });
    if (!setting) return res.status(404).json({ success: false, error: "Setting not found" });

    await prisma.setting.delete({ where: { id: req.params.id } });
    return res.json({ success: true, message: "Setting deleted" });
  } catch (error) {
    console.error("Delete setting error:", error);
    return res.status(500).json({ success: false, error: "Failed to delete setting" });
  }
};

/**
 * Small summary stats endpoint (counts)
 * GET /api/admin/settings/stats/summary
 */
export const handleSettingsStats: RequestHandler = async (_req, res) => {
  try {
    const total = await prisma.setting.count();
    // Group counts - using raw to keep simple and portable across adapters
    const groups = await prisma.$queryRaw`SELECT "group", count(1) as count FROM Setting GROUP BY "group"`;
    return res.json({ success: true, data: { total, groups } });
  } catch (error) {
    console.error("Settings stats error:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch settings stats" });
  }
};

export default {};
