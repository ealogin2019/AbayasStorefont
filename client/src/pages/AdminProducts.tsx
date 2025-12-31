import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProtectedAdmin } from "@/hooks/useAdmin";
import { Card } from "@/ui/card";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { Plus, Edit2, Trash2, Search } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  quantity: number;
  inStock: boolean;
  createdAt: string;
}

interface PaginatedResponse {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function AdminProducts() {
  useProtectedAdmin();

  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginatedResponse | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      const query = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
      });

      const response = await fetch(`/api/admin/products?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }

      const data = await response.json();
      if (data.success) {
        setProducts(data.data.items);
        setPagination(data.data);
      } else {
        setError(data.error || "Failed to load products");
      }
    } catch (err) {
      setError("An error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchProducts();
      } else {
        setError("Failed to delete product");
      }
    } catch (err) {
      setError("An error occurred");
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-2">
            Manage your product inventory
          </p>
        </div>
        <Button onClick={() => navigate("/admin/products/new")} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive/30">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      {/* Search Bar */}
      <Card className="p-4">
        <div className="flex gap-2">
          <Search className="h-5 w-5 text-muted-foreground mt-2.5" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </Card>

      {/* Products Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      {product.currency} {product.price.toFixed(2)}
                    </TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.inStock
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            navigate(`/admin/products/${product.id}`)
                          }
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="border-t border-border/40 p-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total}{" "}
              total)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === pagination.totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
