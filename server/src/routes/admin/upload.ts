/**
 * Admin Image Upload Routes
 * Handles file uploads for products
 */

import { Request, Response } from "express";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

interface UploadRequest extends Request {
  file?: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
  };
  body: {
    type?: string;
    [key: string]: any;
  };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../../..", "public", "uploads");

/**
 * Upload a single image file
 * POST /api/admin/upload
 * 
 * Expected multipart form data:
 * - file: image file
 * - type: "product" | "thumbnail" | "gallery"
 */
export const handleUploadImage = async (
  req: UploadRequest,
  res: Response
) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file provided",
      });
    }

    // Get type from query parameter
    let fileType = (req.query.type as string) || "product";
    
    // Validate file type
    if (!["product", "thumbnail", "gallery"].includes(fileType)) {
      return res.status(400).json({
        success: false,
        error: "Invalid media type. Must be: product, thumbnail, or gallery",
      });
    }

    // Validate file is an image or video
    const allowedImageMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const allowedVideoMimes = ["video/mp4", "video/webm", "video/quicktime"];
    const allowedMimes = [...allowedImageMimes, ...allowedVideoMimes];
    
    const isVideo = allowedVideoMimes.includes(req.file.mimetype);
    const isImage = allowedImageMimes.includes(req.file.mimetype);
    
    if (!isImage && !isVideo) {
      return res.status(400).json({
        success: false,
        error: "Invalid file type. Only images (JPEG, PNG, GIF, WebP) and videos (MP4, WebM, MOV) are allowed",
      });
    }

    // Validate file size (10MB max for videos, 5MB for images, 2MB for thumbnails)
    let maxSize: number;
    if (isVideo) {
      maxSize = 10 * 1024 * 1024; // 10MB for videos
    } else if (fileType === "thumbnail") {
      maxSize = 2 * 1024 * 1024; // 2MB for thumbnail images
    } else {
      maxSize = 5 * 1024 * 1024; // 5MB for other images
    }
    
    if (req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        error: `File size exceeds maximum of ${maxSize / 1024 / 1024}MB`,
      });
    }

    // Create directory if it doesn't exist
    const typeDir = path.join(uploadsDir, fileType);
    try {
      await fs.mkdir(typeDir, { recursive: true });
    } catch (error) {
      console.error("Error creating directory:", error);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const ext = path.extname(req.file.originalname);
    const filename = `${timestamp}-${random}${ext}`;

    // Save file to disk
    const filepath = path.join(typeDir, filename);
    await fs.writeFile(filepath, req.file.buffer);

    // Return relative URL for accessing the media
    const mediaUrl = `/uploads/${fileType}/${filename}`;

    return res.json({
      success: true,
      message: `${isVideo ? 'Video' : 'Image'} uploaded successfully`,
      data: {
        url: mediaUrl,
        filename,
        type: fileType,
        mimetype: req.file.mimetype,
        size: req.file.size,
        isVideo,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to upload image",
    });
  }
};

/**
 * Delete an uploaded image file
 * DELETE /api/admin/upload/:filename
 */
export const handleDeleteImage = async (req: Request, res: Response) => {
  try {
    const filename = req.params.filename;

    // Prevent directory traversal attacks
    if (filename.includes("..") || filename.includes("/")) {
      return res.status(400).json({
        success: false,
        error: "Invalid filename",
      });
    }

    const fileType = (req.query.type as string) || "product";

    // Validate file type
    if (!["product", "thumbnail", "gallery"].includes(fileType)) {
      return res.status(400).json({
        success: false,
        error: "Invalid image type",
      });
    }

    // Find and delete the file
    const filepath = path.join(uploadsDir, fileType, filename);

    // Verify the file exists and is in the correct directory
    const realPath = await fs.realpath(filepath).catch(() => null);
    if (!realPath || !realPath.startsWith(await fs.realpath(uploadsDir))) {
      return res.status(404).json({
        success: false,
        error: "File not found",
      });
    }

    await fs.unlink(filepath);

    return res.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to delete image",
    });
  }
};
