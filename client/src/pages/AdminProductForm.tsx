import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProtectedAdmin } from "@/hooks/useAdmin";
import { Card } from "@/ui/card";
import { Button } from "@/ui/button";
import ProductForm from "@/admin/ProductForm";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  thumbnail: string;
  gallery?: string[];
  colors: string[];
  sizes: string[];
  tags?: string[];
  quantity: number;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminProductForm() {
  useProtectedAdmin();

  const navigate = useNavigate();
  const { id } = useParams();
  
  const [product, setProduct] = useState<Product | null>(null);
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
      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await fetch(`/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }

      const data = await response.json();
      if (data.success) {
        setProduct(data.data);
      } else {
        setError(data.error || "Failed to load product");
      }
    } catch (err) {
      setError("An error occurred while loading product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {id ? "Edit Product" : "Create New Product"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {id ? "Update product details and images" : "Add a new product to your store"}
        </p>
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
