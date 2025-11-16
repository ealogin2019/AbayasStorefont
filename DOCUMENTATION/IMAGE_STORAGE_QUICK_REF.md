# Local Image Storage - Quick Reference

## Summary

The project now has a complete **local image storage system** for products. Images are uploaded to the server and stored in `/public/uploads/` directories.

## What Changed

### 1. ✅ New Directories
```
public/uploads/
├── products/          # Main product images
├── thumbnails/        # Product thumbnails
└── .gitkeep          # Keeps dirs in git
```

### 2. ✅ New Server Endpoint
- **POST** `/api/admin/upload` - Upload image files (multipart/form-data)
- **DELETE** `/api/admin/upload/:filename` - Delete uploaded images
- Both require authentication (Bearer token)

### 3. ✅ Updated Client Components
- **ImageUploader.tsx** - Now uploads files to server instead of creating blob URLs
- **ProductForm.tsx** - Updated validation to accept `/uploads/` paths

### 4. ✅ Updated Server Components
- **server/index.ts** - Added multer middleware and static file serving
- **server/routes/admin/upload.ts** - New file with upload handlers
- **server/routes/admin/products.ts** - Updated validation schema

## Image Flow (New Architecture)

```
User selects image
       ↓
ImageUploader sends to /api/admin/upload
       ↓
Server saves to public/uploads/{type}/
       ↓
Server returns /uploads/products/timestamp-random.jpg
       ↓
Client displays in preview + stores URL
       ↓
Product saved with image URL to database
       ↓
Browser accesses via http://localhost:5173/uploads/products/...
```

## Key Features

✅ **File Validation**
- Only JPEG, PNG, GIF, WebP allowed
- Max 5MB for products, 2MB for thumbnails
- Prevents directory traversal attacks

✅ **Unique Filenames**
- Format: `{timestamp}-{randomString}.{ext}`
- Example: `1731655234567-a1b2c3d4.jpg`

✅ **Organization by Type**
- Products → `/uploads/products/`
- Thumbnails → `/uploads/thumbnails/`
- Gallery → `/uploads/products/`

✅ **Persistent Storage**
- Images stay on disk after server restart
- URLs stored in database
- Can be accessed via static file serving

✅ **Security**
- Authentication required (Bearer token)
- Role-based access (admin/editor)
- Input validation and sanitization

## How to Use

### Upload an Image (Client)
1. Go to Admin → Products → Create/Edit
2. Click "Browse" button
3. Select image file
4. Image uploads and shows preview
5. Click "Create/Update Product"

### Upload Programmatically (Dev)
```typescript
const formData = new FormData();
formData.append("file", fileInput.files[0]);
formData.append("type", "product"); // or "thumbnail", "gallery"

const response = await fetch("/api/admin/upload", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});

const { data } = await response.json();
console.log(data.url); // "/uploads/products/1731655234567-abc123.jpg"
```

### Delete an Image (Dev)
```typescript
await fetch(`/api/admin/upload/1731655234567-abc123.jpg?type=product`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

## File Storage Locations

| Type | Path | Max Size |
|------|------|----------|
| Products | `/public/uploads/products/` | 5MB |
| Thumbnails | `/public/uploads/thumbnails/` | 2MB |
| Gallery | `/public/uploads/products/` | 5MB |

## Database Schema

The Product model stores image URLs as strings:
```prisma
model Product {
  image: String        // "/uploads/products/1731655234567-abc123.jpg"
  thumbnail: String    // "/uploads/thumbnails/1731655234567-def456.jpg"
  gallery: Json        // ["/uploads/products/...", "/uploads/products/..."]
}
```

## Testing

### Manual Test Steps
1. Start dev server: `npm run dev`
2. Log in to admin dashboard
3. Create a new product with image upload
4. Verify image displays in preview
5. Save product
6. Check `public/uploads/products/` folder for the file
7. Navigate to product page - image should display

### Expected File Structure After Upload
```
public/uploads/
├── products/
│   ├── 1731655234567-a1b2c3d4.jpg
│   ├── 1731656789012-b5c6d7e8.png
│   └── .gitkeep
├── thumbnails/
│   ├── 1731655234568-f9g0h1i2.jpg
│   └── .gitkeep
└── .gitkeep
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Images not showing | Check `public/uploads/` exists, verify file path in DB |
| Upload fails | Check file size & type, verify auth token |
| 404 on image URL | Ensure server is running, check file exists on disk |
| Permission error | Verify `public/uploads/` is writable |

## Next Steps (Optional)

- [ ] Add image compression on upload
- [ ] Auto-generate thumbnails from product images
- [ ] Migrate to cloud storage (S3, Cloudinary)
- [ ] Add image usage analytics
- [ ] Implement image optimization

---
**Implementation Date:** November 15, 2025
**Type:** Local File Storage Architecture
