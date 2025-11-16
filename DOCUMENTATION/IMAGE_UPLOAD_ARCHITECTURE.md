# Local Image Storage Architecture

## Overview

The Abayas Storefront now uses a **local file storage system** for managing product images. When an admin uploads images for products, they are saved to the server's filesystem and served as static files.

## Directory Structure

```
project-root/
├── public/
│   └── uploads/
│       ├── products/          # Main product images
│       ├── thumbnails/        # Product thumbnail images
│       └── .gitkeep           # Keeps directories in git
├── server/
│   └── routes/
│       └── admin/
│           └── upload.ts      # Upload handling logic
└── client/
    └── components/
        └── admin/
            ├── ImageUploader.tsx  # Image upload UI
            └── ProductForm.tsx    # Product form with validation
```

## How It Works

### 1. Image Upload Flow

```
Client (ImageUploader.tsx)
  ↓
User selects image file
  ↓
Multipart FormData sent to /api/admin/upload
  ↓
Server (Express + Multer)
  ↓
File saved to public/uploads/{type}/
  ↓
Server returns relative URL (/uploads/products/...)
  ↓
Client stores URL in form state
  ↓
Product saved to database with image URL
```

### 2. API Endpoints

#### Upload Image
```
POST /api/admin/upload
Headers:
  - Authorization: Bearer {token}
  - Content-Type: multipart/form-data

Body:
  - file: <image file>
  - type: "product" | "thumbnail" | "gallery"

Response:
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "/uploads/products/1731655234567-abc123.jpg",
    "filename": "1731655234567-abc123.jpg",
    "type": "product",
    "mimetype": "image/jpeg",
    "size": 125000
  }
}
```

#### Delete Image
```
DELETE /api/admin/upload/:filename?type=product
Headers:
  - Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Image deleted successfully"
}
```

### 3. Client-Side Upload

**File:** `client/components/admin/ImageUploader.tsx`

- User selects image via file input
- Component sends multipart FormData to `/api/admin/upload`
- Server returns persistent URL (e.g., `/uploads/products/timestamp-random.jpg`)
- URL is stored in form state and displayed in preview
- When product is saved, the image URL is sent to product API

### 4. Server-Side Handling

**File:** `server/routes/admin/upload.ts`

Key features:
- **File validation**: Only allows JPEG, PNG, GIF, WebP
- **Size limits**: 
  - Products/Gallery: 5MB max
  - Thumbnails: 2MB max
- **Unique filenames**: `{timestamp}-{random}.{ext}`
- **Directory organization**: Separates by type (product, thumbnail, gallery)
- **Security**: Prevents directory traversal attacks

### 5. Static File Serving

**File:** `server/index.ts`

Express serves all files from `public/` folder:
```typescript
app.use(express.static(path.join(__dirname, "..", "public")));
```

This allows direct browser access to images:
```
http://localhost:5173/uploads/products/1731655234567-abc123.jpg
```

## Form Validation

**File:** `client/components/admin/ProductForm.tsx`

Updated to accept local file URLs:
```typescript
image: z.string().min(1, "Main image is required").refine(
  (val) => val.startsWith("/uploads/") || val.startsWith("http"),
  "Invalid image URL"
),
```

Allows both:
- Local uploads: `/uploads/products/...`
- External URLs: `https://...` (for migration/legacy images)

## File Storage on Disk

When an image is uploaded:

1. **Naming**: `{timestamp}-{randomString}.{extension}`
   - Example: `1731655234567-a1b2c3d4.jpg`

2. **Location**: 
   - Product images: `public/uploads/products/`
   - Thumbnails: `public/uploads/thumbnails/`
   - Gallery images: `public/uploads/products/` (same as main)

3. **Persistence**: Files remain on disk even after server restart

4. **Database**: Only the relative URL is stored in the Product model
   ```prisma
   model Product {
     image: String      // e.g., "/uploads/products/1731655234567-abc123.jpg"
     thumbnail: String  // e.g., "/uploads/thumbnails/1731655234567-def456.jpg"
     gallery: Json      // e.g., ["/uploads/products/...", "/uploads/products/..."]
   }
   ```

## Security Considerations

✅ **Implemented:**
- File type validation (MIME type checking)
- File size limits
- Filename sanitization (timestamp + random)
- Directory traversal protection
- Authentication required (Bearer token)
- Role-based access (admin/editor)

⚠️ **Additional Recommendations:**
- Add virus scanning for production
- Implement rate limiting on upload endpoint
- Add file extension validation
- Consider CDN for better performance
- Add upload progress tracking
- Implement image optimization/compression

## Development Notes

### Testing the Upload
1. Navigate to Admin Dashboard
2. Create or edit a product
3. Click "Browse" to select image
4. Image uploads and displays preview
5. Save product

### Debugging
- Check `public/uploads/` directory to verify files exist
- Check browser Network tab for upload response
- Check server logs for errors
- Verify authentication token in localStorage

### Deleting Uploaded Images
When a product is deleted, associated images remain on disk. To clean up:
```typescript
// Manual cleanup if needed
const uploadDir = "public/uploads";
// Implement cleanup logic when deleting products
```

## Future Enhancements

1. **Image Optimization**
   - Compress images on upload
   - Generate thumbnails automatically
   - Convert to WebP format

2. **Cloud Storage Migration**
   - Upload to AWS S3, Cloudinary, etc.
   - Keep local storage as fallback

3. **Image Management**
   - File size statistics
   - Bulk delete old images
   - Image usage tracking

4. **Performance**
   - CDN integration
   - Image caching headers
   - Lazy loading

## Troubleshooting

### Images not displaying
- Check browser console for failed requests
- Verify file exists in `public/uploads/`
- Check URL format in database
- Ensure server is serving static files

### Upload failing
- Check file size (must be under 5MB)
- Check file type (JPEG, PNG, GIF, WebP only)
- Verify authentication token is valid
- Check disk space

### Permission errors
- Ensure `public/uploads/` directory is writable
- Check Node.js process permissions
- Verify file ownership (if using Linux/Mac)

---
**Last Updated:** November 15, 2025
