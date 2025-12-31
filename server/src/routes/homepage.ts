/**
 * Public Homepage Content Routes
 * Get homepage content for display
 */

import { Router } from "express";
import { handleGetPublicHomepageContent } from "./admin/homepage";

const router = Router();

// Get homepage content for public display
router.get("/", handleGetPublicHomepageContent);

export default router;