# Products Management System - Visual Architecture

## Storage Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Product Management System                  │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐
│   FRONTEND       │         │   IMAGE STORAGE  │
│  (React Admin)   │────────→│  (Cloudinary or  │
│                  │         │   Local Uploads) │
└──────────────────┘         └──────────────────┘
        ↓
┌──────────────────┐         ┌──────────────────┐
│  EXPRESS API     │────────→│   DATABASE       │
│  (Backend)       │         │  (SQLite/Prisma)│
└──────────────────┘         └──────────────────┘
        ↓
┌──────────────────┐
│  PUBLIC STORE    │
│  (Shop Page)     │
└──────────────────┘
```

## Component Hierarchy

```
AdminDashboard (Protected)
├── AdminProducts (List Page) ✅
│   ├── ProductTable
│   ├── ProductFilters
│   ├── Pagination Controls
│   └── Search Bar
│
└── AdminProductForm (Create/Edit) 🆕
    ├── ProductForm
    │   ├── Text Inputs (name, description)
    │   ├── Number Inputs (price, quantity)
    │   ├── Select Dropdowns (currency, category)
    │   ├── Toggle (inStock)
    │   ├── Multi-select (colors, sizes, tags)
    │   └── Form Actions (Save, Cancel, Delete)
    │
    └── ImageUploader 🆕
        ├── Main Image Upload
        ├── Thumbnail Upload
        ├── Gallery Management
        ├── Image Preview
        └── Drag & Drop Support
```

## API Endpoint Map

```
┌────────────────────────────────────────────────────────────┐
│              ADMIN PRODUCTS API ROUTES                      │
│         (All require: Authorization Bearer Token)          │
└────────────────────────────────────────────────────────────┘

LIST & SEARCH
├─ GET /api/admin/products
│   └─ Query: page, limit, search, inStock, sortBy, sortOrder
│   └─ Response: { items[], total, page, pageSize, totalPages }
│
READ
├─ GET /api/admin/products/:id
│   └─ Response: { data: Product }
│
CREATE
├─ POST /api/admin/products
│   ├─ Role: admin, editor
│   └─ Body: { name, description, price, image, thumbnail, colors, sizes, ... }
│   └─ Response: { success, message, data: Product }
│
UPDATE
├─ PUT /api/admin/products/:id
│   ├─ Role: admin, editor
│   └─ Body: { ...partial fields }
│   └─ Response: { success, message, data: Product }
│
DELETE
├─ DELETE /api/admin/products/:id
│   ├─ Role: admin (only)
│   └─ Response: { success, message }
│
UPLOAD (Optional)
├─ POST /api/admin/upload
│   ├─ Content-Type: multipart/form-data
│   ├─ Body: { file, type: "main"|"thumbnail"|"gallery" }
│   └─ Response: { success, data: { url, filename, size } }
```

## Data Flow - Create Product

```
User fills form in AdminProductForm.tsx
         ↓
Form Submission
         ↓
Frontend Validation (Zod schema)
         ↓
Images Upload (Cloudinary or Local)
         ↓
API POST /api/admin/products
{
  name: "Black Abaya",
  description: "Premium quality abaya",
  price: 150,
  image: "https://cdn.../image.jpg",
  thumbnail: "https://cdn.../thumb.jpg",
  gallery: ["https://cdn.../img1.jpg", ...],
  colors: ["Black", "Navy"],
  sizes: ["S", "M", "L"],
  quantity: 50,
  inStock: true
}
         ↓
Backend Validation (Zod schema)
         ↓
Database Create (Prisma)
Product {
  id: "cm9x..." (generated)
  name: "Black Abaya"
  description: "..."
  price: 150
  currency: "AED"
  image: "https://..."
  thumbnail: "https://..."
  gallery: ["https://...", ...]
  colors: ["Black", "Navy"]
  sizes: ["S", "M", "L"]
  tags: []
  quantity: 50
  inStock: true
  createdAt: 2025-11-15T...
  updatedAt: 2025-11-15T...
}
         ↓
Plugin Hook: onProductCreate (AuditLog, etc.)
         ↓
Response: { success: true, data: Product }
         ↓
Frontend Toast: "Product created successfully"
         ↓
Navigate to /admin/products (list page)
         ↓
Fetch products list
         ↓
New product visible in table
```

## Data Flow - Update Product

```
User clicks Edit on product row
         ↓
Navigate to /admin/products/:id
         ↓
Fetch product details via GET /api/admin/products/:id
         ↓
Populate form with product data
         ↓
User modifies fields
         ↓
Form Submission
         ↓
Frontend Validation (Zod)
         ↓
API PUT /api/admin/products/:id
         ↓
Backend Validation
         ↓
Database Update (Prisma)
         ↓
Plugin Hook: onProductUpdate (track changes)
         ↓
Response: { success: true, data: UpdatedProduct }
         ↓
Frontend Updates UI
         ↓
Toast: "Product updated successfully"
```

## Database Schema (Relevant Fields)

```
Product Table
├─ id (cuid, primary key)
├─ name (string, unique)
├─ description (string)
├─ price (float)
├─ currency (string, default: "AED")
├─ image (string, URL to main image)
├─ thumbnail (string, URL to small preview)
├─ gallery (JSON, array of image URLs)
├─ colors (JSON, array of color options)
├─ sizes (JSON, array of size options)
├─ tags (JSON, array of search tags)
├─ quantity (int, stock count)
├─ inStock (boolean)
├─ createdAt (datetime, auto-set)
└─ updatedAt (datetime, auto-set)

CartItem Table (related)
├─ productId (foreign key)
├─ quantity
├─ size
└─ color

OrderItem Table (related)
├─ productId (foreign key)
├─ quantity
├─ price (snapshot at purchase)
├─ size
└─ color
```

## Authorization & Security

```
┌─────────────────────────────────────────┐
│    Admin Authentication Flow             │
└─────────────────────────────────────────┘

Login Form
   ↓
POST /api/admin/auth/login
   ↓
Verify credentials (bcrypt)
   ↓
Generate JWT token (signed with secret)
   ↓
Store in localStorage (frontend)
   ↓
Add to request headers: Authorization: Bearer <token>

Protected Routes:
   ↓
Middleware: authenticateAdmin
   ├─ Verify token signature
   ├─ Extract admin ID and role
   └─ Attach to request object
   ↓
Middleware: requireRole("admin" | "editor" | ...)
   ├─ Check admin role
   └─ Allow or deny access
   ↓
Route Handler (handleCreateProduct, etc.)

Roles:
├─ admin: Create, Read, Update, Delete (full access)
├─ editor: Create, Read, Update (no delete)
└─ manager: Read-only access
```

## Image Storage Options

```
┌──────────────────────────────────────────────────┐
│           IMAGE STORAGE STRATEGY                  │
└──────────────────────────────────────────────────┘

OPTION A: Cloudinary (Recommended)
├─ Pros:
│  ├─ Automatic image optimization
│  ├─ Global CDN for fast delivery
│  ├─ Easy transformations (resize, quality)
│  ├─ Built-in image compression
│  └─ Free tier: 25MB/month
├─ Cons:
│  ├─ Requires API setup
│  └─ External dependency
├─ URL Format:
│  └─ https://res.cloudinary.com/your-cloud/image/upload/...
└─ Setup:
   ├─ Create account at cloudinary.com
   ├─ Get API key & cloud name
   ├─ Add to .env: CLOUDINARY_KEY, CLOUDINARY_SECRET
   └─ Use Cloudinary upload widget on frontend

OPTION B: Local File Storage
├─ Pros:
│  ├─ Simple setup (no external services)
│  ├─ All data stays on server
│  └─ Good for development/testing
├─ Cons:
│  ├─ Need to handle image optimization
│  ├─ Not scalable for large volumes
│  └─ Requires disk space
├─ Directory: /public/uploads/
│  ├─ /main/ (single main product image)
│  ├─ /thumbnails/ (small preview images)
│  └─ /gallery/ (multiple product images)
└─ Endpoint:
   └─ POST /api/admin/upload (multipart/form-data)

OPTION C: AWS S3
├─ Pros:
│  ├─ Highly scalable
│  ├─ Enterprise-grade reliability
│  └─ CloudFront CDN integration
├─ Cons:
│  ├─ More complex setup
│  └─ Requires AWS account
└─ Best for: Production with high traffic
```

## Frontend Form Structure

```
AdminProductForm.tsx
├─ State Management
│  ├─ Form data (useForm or useState)
│  ├─ Loading state
│  ├─ Error state
│  └─ Image previews
│
├─ Form Fields
│  ├─ name (text, required, min 1 char)
│  ├─ description (textarea, required, min 1 char)
│  ├─ price (number, required, positive)
│  ├─ currency (select, default: AED)
│  ├─ image (file input, required, URL)
│  ├─ thumbnail (file input, required, URL)
│  ├─ gallery (file input, multiple, optional)
│  ├─ colors (multi-select, e.g., ["Black", "Navy"])
│  ├─ sizes (multi-select, e.g., ["S", "M", "L", "XL"])
│  ├─ tags (multi-select, e.g., ["summer", "sale"])
│  ├─ quantity (number, default: 0)
│  └─ inStock (toggle, default: true)
│
├─ Validation
│  ├─ Zod schema (frontend)
│  ├─ Real-time error messages
│  └─ Submit button disabled until valid
│
└─ Actions
   ├─ Save (POST /api/admin/products or PUT /api/admin/products/:id)
   ├─ Cancel (navigate back)
   └─ Delete (DELETE /api/admin/products/:id, with confirmation)
```

## Status & Readiness

```
✅ READY (No changes needed)
  ├─ Database (Prisma schema complete)
  ├─ Backend API routes (all endpoints exist)
  ├─ Authentication middleware
  ├─ Role-based access control
  ├─ AdminProducts.tsx (list page)
  └─ Public product APIs

🔄 IN PROGRESS
  ├─ API validation improvements
  └─ Enhanced error handling

🆕 TODO (Need to create)
  ├─ AdminProductForm.tsx (create/edit page)
  ├─ ProductForm component
  ├─ ImageUploader component
  ├─ Image upload endpoint (optional)
  ├─ Advanced filters
  ├─ Bulk operations
  └─ Comprehensive testing

⚠️ DECISION NEEDED
  ├─ Image storage strategy (Cloudinary vs Local)
  ├─ Form library (React Hook Form vs Manual)
  └─ Upload UI (Native vs Drag & Drop vs Widget)
```

## Database Migrations

```
Current Schema Version: 2 (as of 2025-11-15)
├─ 20251114172851_init (base schema)
└─ 20251115075524_add_admin_and_plugins (admin users, plugins)

No new migrations needed!
Product model already exists with all required fields.

To apply any future migrations:
bash$ pnpm exec prisma migrate dev --name <migration-name>
bash$ pnpm exec prisma generate (update generated types)
```
