import React, { useEffect, useState } from "react";
import { useProtectedAdmin } from "@/hooks/useAdmin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, AlertTriangle, XCircle, TrendingUp } from "lucide-react";

type Product = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  currency: string;
};

type InventoryStats = {
  totalProducts: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  totalInventoryValue: number;
};

export default function AdminInventory() {
  useProtectedAdmin();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [outOfStockProducts, setOutOfStockProducts] = useState<Product[]>([]);
  
  // Adjustment modal state
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustQuantity, setAdjustQuantity] = useState<string>("0");
  const [adjustReason, setAdjustReason] = useState("");
  const [adjusting, setAdjusting] = useState(false);

  const token = localStorage.getItem("adminToken");

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, lowStockRes, outOfStockRes] = await Promise.all([
        fetch("/api/admin/inventory/stats", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
        fetch("/api/admin/inventory/low-stock", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
        fetch("/api/admin/inventory/out-of-stock", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
      ]);

      const statsData = await statsRes.json();
      const lowStockData = await lowStockRes.json();
      const outOfStockData = await outOfStockRes.json();

      setStats(statsData.data);
      setLowStockProducts(lowStockData.data);
      setOutOfStockProducts(outOfStockData.data);
    } catch (error) {
      console.error("Load inventory error:", error);
      toast({
        title: "Error",
        description: "Failed to load inventory data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAdjustModal = (product: Product) => {
    setSelectedProduct(product);
    setAdjustQuantity("0");
    setAdjustReason("");
    setAdjustModalOpen(true);
  };

  const handleAdjustStock = async () => {
    if (!selectedProduct) return;

    const quantity = parseInt(adjustQuantity);
    if (isNaN(quantity)) {
      toast({
        title: "Error",
        description: "Please enter a valid quantity",
        variant: "destructive",
      });
      return;
    }

    setAdjusting(true);
    try {
      const res = await fetch("/api/admin/inventory/adjust", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          productId: selectedProduct.id,
          quantity,
          reason: adjustReason || "Manual adjustment",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to adjust stock");
      }

      toast({
        title: "Success",
        description: `Stock adjusted for ${selectedProduct.name}`,
      });

      setAdjustModalOpen(false);
      await loadData();
    } catch (error) {
      console.error("Adjust stock error:", error);
      toast({
        title: "Error",
        description: "Failed to adjust stock",
        variant: "destructive",
      });
    } finally {
      setAdjusting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading inventory...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <p className="text-gray-600 mt-1">Monitor and manage your product stock levels</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">All products in catalog</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.inStock || 0}</div>
            <p className="text-xs text-muted-foreground">Products with good stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats?.lowStock || 0}</div>
            <p className="text-xs text-muted-foreground">Needs reorder soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.outOfStock || 0}</div>
            <p className="text-xs text-muted-foreground">Urgent restock needed</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="low-stock" className="space-y-4">
        <TabsList>
          <TabsTrigger value="low-stock" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Low Stock ({lowStockProducts.length})
          </TabsTrigger>
          <TabsTrigger value="out-of-stock" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Out of Stock ({outOfStockProducts.length})
          </TabsTrigger>
        </TabsList>

        {/* Low Stock Tab */}
        <TabsContent value="low-stock">
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Products</CardTitle>
              <CardDescription>
                Products with 10 or fewer units in stock
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No low stock products</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead className="text-right">Current Stock</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            {product.quantity} units
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {product.currency} {product.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {product.currency} {(product.price * product.quantity).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openAdjustModal(product)}
                          >
                            Adjust Stock
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Out of Stock Tab */}
        <TabsContent value="out-of-stock">
          <Card>
            <CardHeader>
              <CardTitle>Out of Stock Products</CardTitle>
              <CardDescription>
                Products with zero stock - urgent restock needed
              </CardDescription>
            </CardHeader>
            <CardContent>
              {outOfStockProducts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <XCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No out of stock products</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {outOfStockProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Out of Stock
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {product.currency} {product.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openAdjustModal(product)}
                          >
                            Restock
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Adjust Stock Modal */}
      <Dialog open={adjustModalOpen} onOpenChange={setAdjustModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
            <DialogDescription>
              Adjust inventory for {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Current Stock</Label>
              <div className="text-2xl font-bold">{selectedProduct?.quantity || 0} units</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Adjustment Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={adjustQuantity}
                onChange={(e) => setAdjustQuantity(e.target.value)}
                placeholder="Enter positive or negative number"
              />
              <p className="text-sm text-gray-500">
                Use positive numbers to add stock, negative to reduce
              </p>
            </div>

            <div className="space-y-2">
              <Label>New Stock Level</Label>
              <div className="text-xl font-semibold text-blue-600">
                {(selectedProduct?.quantity || 0) + parseInt(adjustQuantity || "0")} units
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Textarea
                id="reason"
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder="e.g., Received new shipment, Damaged goods"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAdjustModalOpen(false)}
              disabled={adjusting}
            >
              Cancel
            </Button>
            <Button onClick={handleAdjustStock} disabled={adjusting}>
              {adjusting ? "Adjusting..." : "Adjust Stock"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
