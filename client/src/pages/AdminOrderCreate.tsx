import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProtectedAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/ui/card";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { Badge } from "@/ui/badge";
import { Skeleton } from "@/ui/skeleton";
import { Textarea } from "@/ui/textarea";
import { ArrowLeft, Plus, Trash2, Search } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
}

interface Customer {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
}

interface OrderItem {
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

export default function AdminOrderCreate() {
  useProtectedAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Helper function to get customer display name
  const getCustomerName = (customer: Customer) => {
    if (customer.name) return customer.name;
    const firstName = customer.firstName || "";
    const lastName = customer.lastName || "";
    return `${firstName} ${lastName}`.trim() || customer.email;
  };

  // Form states
  const [customerId, setCustomerId] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [notes, setNotes] = useState("");

  // UI states
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchProduct, setSearchProduct] = useState("");

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      const response = await fetch("/api/admin/customers?limit=100", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCustomers(data.data.items || []);
        }
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      const response = await fetch("/api/admin/products?limit=100", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProducts(data.data.items || []);
        }
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const addItem = () => {
    if (!selectedProductId) {
      toast({
        title: "Error",
        description: "Please select a product",
        variant: "destructive",
      });
      return;
    }

    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    const existingItem = orderItems.find((item) => item.productId === selectedProductId);
    if (existingItem) {
      // Increase quantity
      setOrderItems(
        orderItems.map((item) =>
          item.productId === selectedProductId
            ? { ...item, quantity: item.quantity + selectedQuantity }
            : item
        )
      );
    } else {
      // Add new item
      setOrderItems([
        ...orderItems,
        {
          productId: selectedProductId,
          product,
          quantity: selectedQuantity,
          price: product.price,
        },
      ]);
    }

    setSelectedProductId("");
    setSelectedQuantity(1);
  };

  const removeItem = (productId: string) => {
    setOrderItems(orderItems.filter((item) => item.productId !== productId));
  };

  const calculateTotals = () => {
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.05; // 5% tax
    const shipping = 50; // Fixed shipping
    const total = subtotal + tax + shipping;
    return { subtotal, tax, shipping, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerId) {
      toast({
        title: "Error",
        description: "Please select a customer",
        variant: "destructive",
      });
      return;
    }

    if (orderItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item to the order",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      const { subtotal, tax, shipping, total } = calculateTotals();

      // This would need a create order API endpoint
      const response = await fetch("/api/admin/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerId,
          items: orderItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal,
          tax,
          shippingCost: shipping,
          total,
          notes,
          status: "pending",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const data = await response.json();
      toast({
        title: "Success",
        description: `Order created successfully`,
      });

      navigate(`/admin/orders/${data.data.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create order";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const { subtotal, tax, shipping, total } = calculateTotals();
  const selectedCustomer = customers.find((c) => c.id === customerId);
  const filteredCustomers = customers.filter((c) => {
    const customerName = getCustomerName(c);
    return (
      customerName.toLowerCase().includes(searchCustomer.toLowerCase()) ||
      c.email.toLowerCase().includes(searchCustomer.toLowerCase())
    );
  });
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/orders")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Create Order</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Select Customer</h2>
            <div className="space-y-4">
              {selectedCustomer ? (
                <div className="p-4 bg-secondary rounded-lg flex items-start justify-between">
                  <div>
                    <p className="font-medium">{getCustomerName(selectedCustomer)}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedCustomer.email}
                    </p>
                    {selectedCustomer.phone && (
                      <p className="text-sm text-muted-foreground">
                        {selectedCustomer.phone}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCustomerId("");
                      setSearchCustomer("");
                    }}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search customer by name or email..."
                      value={searchCustomer}
                      onChange={(e) => setSearchCustomer(e.target.value)}
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto border rounded-lg">
                    {loadingCustomers ? (
                      <div className="p-4">
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ) : filteredCustomers.length > 0 ? (
                      <ul className="divide-y">
                        {filteredCustomers.map((customer) => (
                          <li key={customer.id}>
                            <button
                              type="button"
                              onClick={() => {
                                setCustomerId(customer.id);
                                setSearchCustomer("");
                              }}
                              className="w-full text-left p-3 hover:bg-secondary transition-colors"
                            >
                              <p className="font-medium">{getCustomerName(customer)}</p>
                              <p className="text-sm text-muted-foreground">
                                {customer.email}
                              </p>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">
                        No customers found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Add Products */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Add Products</h2>
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Product</Label>
                {loadingProducts ? (
                  <div className="p-3 border border-border/40 rounded-md bg-secondary/30">
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="p-3 border border-border/40 rounded-md bg-secondary/30 text-muted-foreground">
                    No products available
                  </div>
                ) : (
                  <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product..." />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - AED {product.price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {!loadingProducts && filteredProducts.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-2">No products available</p>
                )}
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <Label className="mb-2 block">Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>
                <Button
                  type="button"
                  onClick={addItem}
                  className="self-end"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </div>
          </Card>

          {/* Order Items */}
          {orderItems.length > 0 && (
            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell className="font-medium">
                          {item.product?.name}
                        </TableCell>
                        <TableCell className="text-right">
                          AED {item.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right font-medium">
                          AED {(item.price * item.quantity).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.productId)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}

          {/* Notes */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Order Notes</h2>
            <Textarea
              placeholder="Add internal notes or comments about this order..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-24"
            />
          </Card>
        </div>

        {/* Sidebar - Order Summary */}
        <div>
          <Card className="p-6 sticky top-6">
            <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

            {orderItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No items added yet
              </p>
            ) : (
              <>
                <div className="space-y-3 mb-4 pb-4 border-b border-border/40">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items</span>
                    <span>{orderItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>AED {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (5%)</span>
                    <span>AED {tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>AED {shipping.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between font-semibold text-lg mb-6 pb-6 border-b border-border/40">
                  <span>Total</span>
                  <span>AED {total.toFixed(2)}</span>
                </div>

                <div className="space-y-2">
                  <Button
                    type="submit"
                    disabled={submitting || !customerId}
                    className="w-full"
                  >
                    {submitting ? "Creating..." : "Create Order"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/admin/orders")}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </form>
    </div>
  );
}
