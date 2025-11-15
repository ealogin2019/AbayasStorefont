import { useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import ImageUploader from "./ImageUploader";

// Validation schema (matches backend)
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  currency: z.string().default("AED"),
  image: z.string().url("Main image URL must be valid"),
  thumbnail: z.string().url("Thumbnail URL must be valid"),
  gallery: z.array(z.string().url()).optional(),
  colors: z.array(z.string()),
  sizes: z.array(z.string()),
  tags: z.array(z.string()).optional(),
  quantity: z.number().int().default(0),
  inStock: z.boolean().default(true),
});

type ProductFormData = z.infer<typeof productSchema>;

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
  const [formData, setFormData] = useState<ProductFormData>(
    product || {
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
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  const validateForm = (): boolean => {
    try {
      productSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleAddColor = () => {
    if (colorInput.trim()) {
      setFormData({
        ...formData,
        colors: [...formData.colors, colorInput.trim()],
      });
      setColorInput("");
    }
  };

  const handleRemoveColor = (index: number) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter((_, i) => i !== index),
    });
  };

  const handleAddSize = () => {
    if (sizeInput.trim()) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, sizeInput.trim()],
      });
      setSizeInput("");
    }
  };

  const handleRemoveSize = (index: number) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter((_, i) => i !== index),
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin/login");
        return;
      }

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

      // Success
      onSuccess?.();
    } catch (error) {
      console.error("Form submission error:", error);
      setErrors({ submit: "An error occurred while saving" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!product?.id) return;
    if (!confirm("Are you sure you want to delete this product?")) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        onSuccess?.();
      } else {
        setErrors({ submit: "Failed to delete product" });
      }
    } catch (error) {
      console.error("Delete error:", error);
      setErrors({ submit: "An error occurred while deleting" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="e.g., Black Premium Abaya"
            disabled={loading}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describe your product..."
            rows={4}
            disabled={loading}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description}</p>
          )}
        </div>

        {/* Price & Currency */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="0.00"
              disabled={loading}
            />
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={formData.currency}
              onValueChange={(value) =>
                setFormData({ ...formData, currency: value })
              }
              disabled={loading}
            >
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AED">AED (د.إ)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Images */}
        <ImageUploader
          image={formData.image}
          thumbnail={formData.thumbnail}
          gallery={formData.gallery || []}
          onImageChange={(image) => setFormData({ ...formData, image })}
          onThumbnailChange={(thumbnail) =>
            setFormData({ ...formData, thumbnail })
          }
          onGalleryChange={(gallery) =>
            setFormData({ ...formData, gallery })
          }
          disabled={loading}
        />

        {errors.image && (
          <p className="text-sm text-destructive">{errors.image}</p>
        )}
        {errors.thumbnail && (
          <p className="text-sm text-destructive">{errors.thumbnail}</p>
        )}

        {/* Colors */}
        <div className="space-y-2">
          <Label>Available Colors *</Label>
          <div className="flex gap-2 mb-3">
            <Input
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              placeholder="e.g., Black"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddColor();
                }
              }}
              disabled={loading}
            />
            <Button
              type="button"
              onClick={handleAddColor}
              variant="outline"
              disabled={loading}
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.colors.map((color, index) => (
              <div
                key={index}
                className="bg-secondary px-3 py-1 rounded-full flex items-center gap-2"
              >
                <span className="text-sm">{color}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveColor(index)}
                  className="text-destructive hover:text-destructive/80"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {errors.colors && (
            <p className="text-sm text-destructive">{errors.colors}</p>
          )}
          {formData.colors.length === 0 && (
            <p className="text-sm text-amber-600">
              Add at least one color option
            </p>
          )}
        </div>

        {/* Sizes */}
        <div className="space-y-2">
          <Label>Available Sizes *</Label>
          <div className="flex gap-2 mb-3">
            <Input
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              placeholder="e.g., S, M, L, XL"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSize();
                }
              }}
              disabled={loading}
            />
            <Button
              type="button"
              onClick={handleAddSize}
              variant="outline"
              disabled={loading}
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.sizes.map((size, index) => (
              <div
                key={index}
                className="bg-secondary px-3 py-1 rounded-full flex items-center gap-2"
              >
                <span className="text-sm">{size}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSize(index)}
                  className="text-destructive hover:text-destructive/80"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {errors.sizes && (
            <p className="text-sm text-destructive">{errors.sizes}</p>
          )}
          {formData.sizes.length === 0 && (
            <p className="text-sm text-amber-600">
              Add at least one size option
            </p>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label>Tags (for search)</Label>
          <div className="flex gap-2 mb-3">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="e.g., summer, sale"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              disabled={loading}
            />
            <Button
              type="button"
              onClick={handleAddTag}
              variant="outline"
              disabled={loading}
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(formData.tags || []).map((tag, index) => (
              <div
                key={index}
                className="bg-secondary px-3 py-1 rounded-full flex items-center gap-2"
              >
                <span className="text-sm">{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  className="text-destructive hover:text-destructive/80"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Stock Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quantity: parseInt(e.target.value) || 0,
                })
              }
              placeholder="0"
              disabled={loading}
            />
          </div>

          <div className="space-y-2 flex flex-col justify-end">
            <div className="flex items-center gap-2">
              <Checkbox
                id="inStock"
                checked={formData.inStock}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    inStock: checked === true,
                  })
                }
                disabled={loading}
              />
              <Label htmlFor="inStock" className="cursor-pointer">
                In Stock
              </Label>
            </div>
          </div>
        </div>

        {/* Error message */}
        {errors.submit && (
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-md">
            <p className="text-sm text-destructive">{errors.submit}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-between pt-6 border-t">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            {product?.id && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Product
              </Button>
            )}
          </div>
          <Button type="submit" disabled={loading} size="lg">
            {loading ? "Saving..." : product?.id ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
