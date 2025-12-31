# Image Storage Architecture - Visual Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     ABAYAS STOREFRONT                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │               CLIENT SIDE (React)                        │   │
│  │                                                          │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │    Admin Dashboard / Product Form               │   │   │
│  │  │                                                  │   │   │
│  │  │  ┌────────────────────────────────────────────┐ │   │   │
│  │  │  │  ImageUploader Component                  │ │   │   │
│  │  │  │  1. User selects image file               │ │   │   │
│  │  │  │  2. Creates FormData with file            │ │   │   │
│  │  │  │  3. Sends POST /api/admin/upload          │ │   │   │
│  │  │  │  4. Gets back: /uploads/products/...      │ │   │   │
│  │  │  │  5. Stores URL in form state              │ │   │   │
│  │  │  │  6. Shows image preview                   │ │   │   │
│  │  │  └────────────────────────────────────────────┘ │   │   │
│  │  │                                                  │   │   │
│  │  │  ProductForm saves URL with product to API      │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                      │                                   │   │
│  │                      ▼                                   │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │      Multipart/Form-Data Upload                 │   │   │
│  │  │  - file: <image binary>                         │   │   │
│  │  │  - type: "product"/"thumbnail"/"gallery"       │   │   │
│  │  │  - Authorization: Bearer {token}               │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           ▲                                     │
│                           │ POST /api/admin/upload              │
│                           │                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │             SERVER SIDE (Express.js)                    │   │
│  │                                                          │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │  Multer Middleware                              │   │   │
│  │  │  - Extracts file from multipart data            │   │   │
│  │  │  - Loads into memory buffer                     │   │   │
│  │  │  - Validates: size, MIME type                   │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                      ▼                                   │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │  Upload Handler (/api/admin/upload)             │   │   │
│  │  │  1. Check authentication (Bearer token)         │   │   │
│  │  │  2. Validate file type (JPEG,PNG,GIF,WebP)     │   │   │
│  │  │  3. Validate file size                          │   │   │
│  │  │  4. Generate unique filename:                   │   │   │
│  │  │     {timestamp}-{random}.{ext}                 │   │   │
│  │  │  5. Create directory: public/uploads/{type}/    │   │   │
│  │  │  6. Write file to disk                          │   │   │
│  │  │  7. Return JSON response with URL              │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                      ▼                                   │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │  File System (Node.js fs module)                │   │   │
│  │  │  Writes to: public/uploads/products/            │   │   │
│  │  │             public/uploads/thumbnails/          │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              DATABASE (SQLite/Prisma)                   │   │
│  │                                                          │   │
│  │  Product Table:                                         │   │
│  │  - id: "abc123"                                         │   │
│  │  - image: "/uploads/products/1731655234567-xyz.jpg"    │   │
│  │  - thumbnail: "/uploads/thumbnails/1731655234568-...  │   │
│  │  - gallery: ["/uploads/products/...", "/uploads/..."] │   │
│  │  - Other fields...                                      │   │
│  │                                                          │   │
│  │  URLs are stored as strings for flexible retrieval      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           STATIC FILE SERVING (Express)                │   │
│  │                                                          │   │
│  │  app.use(express.static('public'))                      │   │
│  │                                                          │   │
│  │  Browser requests:                                      │   │
│  │  GET /uploads/products/1731655234567-xyz.jpg           │   │
│  │       ▼                                                 │   │
│  │  Express returns file from:                            │   │
│  │  public/uploads/products/1731655234567-xyz.jpg         │   │
│  │       ▼                                                 │   │
│  │  Browser renders image in <img src="...">            │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Upload Flow Sequence Diagram

```
Client                  Server              File System        Database
  │                       │                      │                │
  │─── Click Browse ────>  │                      │                │
  │<──── File Dialog ──────│                      │                │
  │                       │                      │                │
  │─ Select Image ────────│                      │                │
  │                       │                      │                │
  │─── POST /api/admin/upload ──────>           │                │
  │     (multipart/form-data)                   │                │
  │     - file: [binary]                        │                │
  │     - type: "product"                       │                │
  │     - Authorization: Bearer token           │                │
  │                       │                      │                │
  │                       ├─ Validate file ──>  │                │
  │                       │   (type, size)      │                │
  │                       │                      │                │
  │                       ├─ Generate filename  │                │
  │                       │   (timestamp-random)│                │
  │                       │                      │                │
  │                       ├─ Create dir ────────────────>        │
  │                       │   /uploads/products/                 │
  │                       │                      │                │
  │                       ├─ Write file ───────────────>        │
  │                       │                      │                │
  │                       │              File saved ✓            │
  │                       │                      │                │
  │<──────── JSON Response ────────────────────────────           │
  │  {success: true,                                             │
  │   data: {url: "/uploads/products/timestamp-random.jpg"}}    │
  │                       │                      │                │
  │─ Display preview ─────│                      │                │
  │                       │                      │                │
  │─ Store URL in form ───│                      │                │
  │                       │                      │                │
  │─ Fill product details │                      │                │
  │                       │                      │                │
  │─────── POST /api/admin/products ───────────>│                │
  │      (JSON with image URL)                  │                │
  │                       │                      │                ├── Insert Product
  │                       │                      │                │   with URL
  │                       │<────────────────────────────────────  │
  │<──────── Success Response ──────────────────                 │
  │                       │                      │                │
  │─ Navigate to Product  │                      │                │
  │                       │                      │                │
  │──── GET /products/id ──────────────────────>│                │
  │                       │                      │                ├── Query Product
  │                       │                      │                │
  │<──────── JSON Response ────────────────────────────────────<──│
  │  {id, name, image: "/uploads/products/..."}                 │
  │                       │                      │                │
  │── GET /uploads/products/timestamp-random.jpg ──>             │
  │                       │                      │                │
  │<──────── Image Data ───────────────────────────────────────  │
  │  (static file serving)                                       │
  │                       │                      │                │
  │─ Display image ───────│                      │                │
  │   in <img src> ───────│                      │                │
  │ ✓ Image shown ────────│                      │                │
  │                       │                      │                │
```

---

## Directory Tree After Uploads

```
project-root/
│
├── public/
│   ├── uploads/                           ← NEW
│   │   ├── products/
│   │   │   ├── 1731655234567-a1b2c3d4.jpg   (Main image)
│   │   │   ├── 1731655234568-b5c6d7e8.png   (Main image)
│   │   │   ├── 1731655234569-c7d8e9f0.gif   (Gallery image)
│   │   │   └── .gitkeep
│   │   │
│   │   └── thumbnails/
│   │       ├── 1731655234570-d9e0f1g2.jpg   (Thumbnail)
│   │       ├── 1731655234571-e1f2g3h4.png   (Thumbnail)
│   │       └── .gitkeep
│   │
│   ├── robots.txt
│   ├── favicon.ico
│   └── placeholder.svg
│
├── server/
│   ├── routes/
│   │   └── admin/
│   │       ├── upload.ts          ← NEW (Upload handlers)
│   │       ├── products.ts         ← MODIFIED
│   │       ├── auth.ts
│   │       └── ...
│   │
│   └── index.ts               ← MODIFIED (Add routes & static)
│
├── client/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── ImageUploader.tsx   ← MODIFIED
│   │   │   ├── ProductForm.tsx     ← MODIFIED
│   │   │   └── ...
│   │   └── ...
│   └── ...
│
├── prisma/
│   └── schema.prisma          (No changes needed)
│
└── ...
```

---

## Data Model Representation

```
┌─────────────────────────────────┐
│       DATABASE (SQLite)         │
├─────────────────────────────────┤
│  Table: Product                 │
├─────────────────────────────────┤
│ id       | "prod_123"           │
│ name     | "Black Abaya"        │
│ price    | 299.99              │
│ image    | "/uploads/products/  │ ─────────┐
│          | 1731655234567-       │          │
│          | a1b2c3d4.jpg"        │          │
│ thumbnail| "/uploads/thumbnails/│ ─────┐   │
│          | 1731655234570-       │      │   │
│          | d9e0f1g2.jpg"        │      │   │
│ gallery  | JSON ["/uploads/     │ ─────┼─────┐
│          |  products/1731...",   │      │   │
│          |  "/uploads/products/  │      │   │
│          |   1731655234569..."]  │      │   │
│ ...      | ...                  │      │   │
└─────────────────────────────────┘      │   │
                                         │   │
                ┌────────────────────────┘   │
                │                            │
                ▼                            ▼
      ┌──────────────────────┐    ┌──────────────────────┐
      │  /uploads/products/  │    │/uploads/thumbnails/  │
      │1731655234567-a1b.jpg │    │1731655234570-d9e.jpg │
      │(5MB image file)      │    │(2MB image file)      │
      └──────────────────────┘    └──────────────────────┘
                │
                ├─ 1731655234568-b5c6d7e8.png
                │  (Gallery image 1)
                │
                └─ 1731655234569-c7d8e9f0.gif
                   (Gallery image 2)
```

---

## Request/Response Example

### Upload Request

```http
POST /api/admin/upload HTTP/1.1
Host: localhost:5173
Authorization: Bearer eyJhbGc...
Content-Type: multipart/form-data; boundary=----

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="black-abaya.jpg"
Content-Type: image/jpeg

[Binary image data - 2.5 MB]
------WebKitFormBoundary
Content-Disposition: form-data; name="type"

product
------WebKitFormBoundary--
```

### Upload Response

```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "/uploads/products/1731655234567-a1b2c3d4.jpg",
    "filename": "1731655234567-a1b2c3d4.jpg",
    "type": "product",
    "mimetype": "image/jpeg",
    "size": 2621440
  }
}
```

### Product Create Request

```json
{
  "name": "Black Premium Abaya",
  "description": "High quality black abaya...",
  "price": 299.99,
  "currency": "AED",
  "image": "/uploads/products/1731655234567-a1b2c3d4.jpg",
  "thumbnail": "/uploads/thumbnails/1731655234570-d9e0f1g2.jpg",
  "gallery": [
    "/uploads/products/1731655234568-b5c6d7e8.png",
    "/uploads/products/1731655234569-c7d8e9f0.gif"
  ],
  "colors": ["Black", "Navy"],
  "sizes": ["S", "M", "L", "XL"],
  "quantity": 50,
  "inStock": true
}
```

---

## Security Model

```
┌─────────────────────────────────────────────────────┐
│           UPLOAD SECURITY LAYERS                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Layer 1: AUTHENTICATION                           │
│ ┌─────────────────────────────────────────────┐   │
│ │ Check: Bearer token in Authorization header │   │
│ │ Check: Token is valid JWT                   │   │
│ │ Result: Identify user                       │   │
│ └─────────────────────────────────────────────┘   │
│              ▼                                     │
│                                                     │
│ Layer 2: AUTHORIZATION                           │
│ ┌─────────────────────────────────────────────┐   │
│ │ Check: User role (admin or editor)          │   │
│ │ Result: Only authorized users can upload    │   │
│ └─────────────────────────────────────────────┘   │
│              ▼                                     │
│                                                     │
│ Layer 3: FILE VALIDATION                        │
│ ┌─────────────────────────────────────────────┐   │
│ │ Check: MIME type (image/jpeg, image/png...) │   │
│ │ Check: File extension                       │   │
│ │ Check: File size (5MB max)                  │   │
│ │ Result: Only valid images accepted          │   │
│ └─────────────────────────────────────────────┘   │
│              ▼                                     │
│                                                     │
│ Layer 4: SANITIZATION                           │
│ ┌─────────────────────────────────────────────┐   │
│ │ Generate: Unique filename                   │   │
│ │ Prevent: Directory traversal (../)         │   │
│ │ Validate: No path separators in filename    │   │
│ │ Result: Safe filename on disk               │   │
│ └─────────────────────────────────────────────┘   │
│              ▼                                     │
│                                                     │
│ Layer 5: STORAGE PROTECTION                    │
│ ┌─────────────────────────────────────────────┐   │
│ │ Store in: Separate public directory         │   │
│ │ Permission: Read-only for public            │   │
│ │ Access: Via static middleware only          │   │
│ │ Result: Controlled file access              │   │
│ └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Performance Considerations

```
OPTIMIZATION OPPORTUNITIES

1. IMAGE COMPRESSION
   ┌──────────────────────────┐
   │ Original: 5 MB           │ ─ Compress ──> │ 500 KB │
   │ PNG with transparency    │                │ 90% smaller
   └──────────────────────────┘

2. THUMBNAIL GENERATION
   ┌──────────────────────────┐
   │ Main: 3000x3000 px       │ ─ Resize ───> │ 300x300 px │
   │ 5 MB JPEG                │                │ 50 KB thumbnail
   └──────────────────────────┘

3. FORMAT CONVERSION
   ┌──────────────────────────┐
   │ Original: PNG            │ ─ Convert ──> │ WebP Format │
   │ 2 MB                     │                │ 600 KB (70% reduction)
   └──────────────────────────┘

4. LAZY LOADING
   Browser doesn't load images until visible
   ┌─────────────────────┐
   │ Product loaded      │ ─ Scroll down ──> │ Images loaded │
   │ Images not loaded   │                    │ On demand     │
   └─────────────────────┘

5. CDN/CACHING
   ┌──────────────────────────┐
   │ Local disk (slow)        │ ─ CDN ─────> │ Edge (fast) │
   │ /public/uploads/         │ Cache        │ Multiple regions
   └──────────────────────────┘
```

---

## Implementation Status

```
┌────────────────────────────────────────────────────────────┐
│             IMPLEMENTATION PROGRESS                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ ✅ Directory Structure     [████████████████████████] 100% │
│ ✅ Server Upload Handler   [████████████████████████] 100% │
│ ✅ Client Upload Component [████████████████████████] 100% │
│ ✅ Database Integration    [████████████████████████] 100% │
│ ✅ Static File Serving     [████████████████████████] 100% │
│ ✅ Security Implementation [████████████████████████] 100% │
│ ✅ Error Handling         [████████████████████████] 100% │
│ ✅ Documentation          [████████████████████████] 100% │
│                                                            │
│ TOTAL COMPLETION: 100% ✅                                 │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

**Created:** November 15, 2025  
**Last Updated:** November 15, 2025  
**Status:** ✅ COMPLETE
