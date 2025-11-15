# Products Management System - Quick Reference

## Quick Start

### Current Status Summary
```
✅ Database ready (Product model exists)
✅ Backend API endpoints ready (create, read, update, delete)
✅ Admin authentication ready
✅ List page started (AdminProducts.tsx exists)
🆕 Need: Create/edit form page
🆕 Need: Image upload component
```

### Recommended Implementation Order

1. **Week 1**: Build Admin Product Form
   - Create AdminProductForm.tsx
   - Create ProductForm component
   - Add form validation (Zod)
   - Update routing in App.tsx

2. **Week 2**: Add Image Upload
   - Create ImageUploader component
   - Choose storage strategy (Cloudinary or Local)
   - Test image uploads

3. **Week 3**: Polish & Features
   - Add advanced filters
   - Add bulk operations
   - Performance optimization
   - Comprehensive testing

---

## Key Files & Locations

### Frontend
```
client/pages/
├── AdminProducts.tsx ✅ (list page - exists)
├── AdminProductForm.tsx 🆕 (create/edit - CREATE THIS)
└── AdminDashboard.tsx ✅ (dashboard - exists)

client/components/
├── admin/
│   ├── ProductForm.tsx 🆕 (form - CREATE THIS)
│   ├── ImageUploader.tsx 🆕 (images - CREATE THIS)
│   └── layout/
│       └── AdminLayout.tsx ✅ (layout wrapper)
└── ui/ ✅ (pre-built UI components - use these)

client/App.tsx (UPDATE - add routes)
client/hooks/useAdmin.ts ✅ (auth hook - already exists)
```

### Backend
```
server/index.ts ✅ (main server - routes registered)
server/routes/
├── admin/
│   ├── products.ts ✅ (CRUD endpoints - ready)
│   ├── auth.ts ✅ (auth endpoints)
│   ├── orders.ts ✅ (orders)
│   ├── customers.ts ✅ (customers)
│   └── dashboard.ts ✅ (stats)
└── cart.ts, checkout.ts, etc. ✅

server/auth/
├── middleware.ts ✅ (auth middleware)
└── utils.ts ✅ (jwt, bcrypt)

server/db.ts ✅ (Prisma setup)
```

### Shared
```
shared/api.ts (UPDATE - add types)
shared/plugins.ts ✅ (plugin types)
```

### Database
```
prisma/schema.prisma ✅ (Product model exists)
prisma/migrations/ ✅ (migrations exist)
generated/prisma/ ✅ (types generated)
```

---

## Component Templates

### 1. AdminProductForm.tsx
```typescript
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProtectedAdmin } from "@/hooks/useAdmin";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProductForm from "@/components/admin/ProductForm";

export default function AdminProductForm() {
  useProtectedAdmin(); // Ensure user is logged in
  
  const navigate = useNavigate();
  const { id } = useParams(); // undefined for new, id for edit
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch product");
      const data = await response.json();
      setProduct(data.data);
    } catch (err) {
      setError("Error loading product");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {id ? "Edit Product" : "Create New Product"}
        </h1>
      </div>

      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive/30">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      <ProductForm
        product={product}
        onSuccess={() => navigate("/admin/products")}
        onCancel={() => navigate("/admin/products")}
      />
    </div>
  );
}
```

### 2. ProductForm.tsx (Component)
```typescript
import { useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "./ImageUploader";

// Validation schema (same as backend)
const productSchema = z.object({
  name: z.string().min(1, "Name required"),
  description: z.string().min(1, "Description required"),
  price: z.number().positive("Price must be positive"),
  currency: z.string().default("AED"),
  image: z.string().url("Invalid image URL"),
  thumbnail: z.string().url("Invalid thumbnail URL"),
  gallery: z.array(z.string().url()).optional(),
  colors: z.array(z.string()),
  sizes: z.array(z.string()),
  tags: z.array(z.string()).optional(),
  quantity: z.number().int().default(0),
  inStock: z.boolean().default(true),
});

interface ProductFormProps {
  product?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ProductForm({
  product,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(product || {
    name: "",
    description: "",
    price: 0,
    currency: "AED",
    image: "",
    thumbnail: "",
    gallery: [],
    colors: [],
    sizes: [],
    tags: [],
    quantity: 0,
    inStock: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    try {
      productSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          newErrors[err.path.join(".")] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const method = product?.id ? "PUT" : "POST";
      const url = product?.id
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        setErrors({ submit: data.error || "Failed to save product" });
        return;
      }

      // Show success and navigate
      onSuccess?.();
    } catch (error) {
      setErrors({ submit: "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Product Name *</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Black Abaya"
            disabled={loading}
          />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description *</label>
          <Textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Product description..."
            rows={4}
            disabled={loading}
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description}</p>
          )}
        </div>

        {/* Price & Currency */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Price *</label>
            <Input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) })
              }
              placeholder="0.00"
              disabled={loading}
            />
            {errors.price && (
              <p className="text-sm text-red-600 mt-1">{errors.price}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Currency</label>
            <select
              value={formData.currency}
              onChange={(e) =>
                setFormData({ ...formData, currency: e.target.value })
              }
              disabled={loading}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="AED">AED</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>

        {/* Images */}
        <ImageUploader
          image={formData.image}
          thumbnail={formData.thumbnail}
          gallery={formData.gallery || []}
          onImageChange={(image) => setFormData({ ...formData, image })}
          onThumbnailChange={(thumbnail) => setFormData({ ...formData, thumbnail })}
          onGalleryChange={(gallery) => setFormData({ ...formData, gallery })}
        />

        {/* Colors, Sizes, Tags */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Colors *</label>
            {/* Multi-select or tags input */}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Sizes *</label>
            {/* Multi-select or tags input */}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            {/* Multi-select or tags input */}
          </div>
        </div>

        {/* Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <Input
              type="number"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: parseInt(e.target.value) })
              }
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">In Stock</label>
            <input
              type="checkbox"
              checked={formData.inStock}
              onChange={(e) =>
                setFormData({ ...formData, inStock: e.target.checked })
              }
              disabled={loading}
            />
          </div>
        </div>

        {/* Error message */}
        {errors.submit && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
```

### 3. ImageUploader.tsx (Component)
```typescript
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";

interface ImageUploaderProps {
  image: string;
  thumbnail: string;
  gallery: string[];
  onImageChange: (url: string) => void;
  onThumbnailChange: (url: string) => void;
  onGalleryChange: (urls: string[]) => void;
}

export default function ImageUploader({
  image,
  thumbnail,
  gallery,
  onImageChange,
  onThumbnailChange,
  onGalleryChange,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList | null, type: "main" | "thumb" | "gallery") => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      // Option A: Use Cloudinary widget (simpler)
      // const result = await cloudinary.openUploadWidget(...);

      // Option B: Upload to backend
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("type", type);

      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      const url = data.data.url;

      if (type === "main") onImageChange(url);
      else if (type === "thumb") onThumbnailChange(url);
      else if (type === "gallery") onGalleryChange([...gallery, url]);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div>
        <label className="block text-sm font-medium mb-2">Main Image *</label>
        {image && (
          <img src={image} alt="main" className="w-32 h-32 object-cover rounded mb-2" />
        )}
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => handleUpload(e.target.files, "main")}
          disabled={uploading}
        />
      </div>

      {/* Thumbnail */}
      <div>
        <label className="block text-sm font-medium mb-2">Thumbnail *</label>
        {thumbnail && (
          <img src={thumbnail} alt="thumb" className="w-20 h-20 object-cover rounded mb-2" />
        )}
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => handleUpload(e.target.files, "thumb")}
          disabled={uploading}
        />
      </div>

      {/* Gallery */}
      <div>
        <label className="block text-sm font-medium mb-2">Gallery Images</label>
        <div className="flex gap-2 mb-2 flex-wrap">
          {gallery.map((url, idx) => (
            <div key={idx} className="relative">
              <img src={url} alt={`gallery-${idx}`} className="w-20 h-20 object-cover rounded" />
              <button
                type="button"
                onClick={() => onGalleryChange(gallery.filter((_, i) => i !== idx))}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleUpload(e.target.files, "gallery")}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
```

---

## Routes to Add in App.tsx

```typescript
// Add these routes to App.tsx

<Route path="/admin">
  <Route element={<AdminLayout />}>
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="products" element={<AdminProducts />} />
    <Route path="products/new" element={<AdminProductForm />} />
    <Route path="products/:id" element={<AdminProductForm />} />
    {/* Add other admin routes here */}
  </Route>
  <Route path="login" element={<AdminLogin />} />
</Route>
```

---

## Environment Variables Needed

```env
# .env (already configured)
DATABASE_URL=file:./dev.db
PING_MESSAGE=pong
JWT_SECRET=your-secret-key
NODE_ENV=development

# Optional (for image uploads)
# CLOUDINARY_NAME=your-cloud-name
# CLOUDINARY_KEY=your-api-key
# CLOUDINARY_SECRET=your-api-secret
```

---

## Testing Checklist

### Create Product
- [ ] Form loads without errors
- [ ] Can fill all fields
- [ ] Validation works
- [ ] Can upload images
- [ ] Product saves to database
- [ ] Appears in product list
- [ ] Product visible in public store

### Update Product
- [ ] Product form loads with existing data
- [ ] Can update any field
- [ ] Can replace images
- [ ] Changes save to database
- [ ] Updates reflect in list

### Delete Product
- [ ] Delete button shows confirmation
- [ ] Product removed from list
- [ ] Product removed from database
- [ ] Product no longer in public store

### Images
- [ ] Images upload successfully
- [ ] Images display in previews
- [ ] Main image shows in product card
- [ ] Thumbnail shows in list
- [ ] Gallery images load correctly
- [ ] Can remove images

### Permissions
- [ ] Admin can create/edit/delete
- [ ] Editor can create/edit (no delete)
- [ ] Unauthenticated users denied
- [ ] Correct error messages shown

---

## Important Notes

1. **Zod Validation**: Used on both frontend and backend for consistency
2. **Authorization**: All admin endpoints require Bearer token
3. **Roles**: 
   - `admin` = full access (create, edit, delete)
   - `editor` = create & edit (no delete)
4. **Images**: Can use Cloudinary (scalable) or local uploads (simple)
5. **Database**: SQLite with Prisma ORM (no migrations needed)

---

## Troubleshooting

### API returns 401
- Check localStorage has `adminToken`
- Check token not expired
- Re-login if needed

### Images not uploading
- Check file size
- Check MIME type
- Check upload endpoint is created
- Check permissions on /public/uploads/

### Validation errors
- Check Zod schema matches frontend/backend
- Check all required fields are filled
- Check image URLs are valid

### Product not appearing in store
- Check `inStock` is true
- Check quantity > 0
- Refresh product list page
- Check database for created product
