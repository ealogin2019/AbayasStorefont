import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProtectedAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/ui/card";
import { Button } from "@/ui/button";
import { Textarea } from "@/ui/textarea";
import { Skeleton } from "@/ui/skeleton";
import { Badge } from "@/ui/badge";
import { Separator } from "@/ui/separator";
import { ArrowLeft, Printer, Download, Package } from "lucide-react";
import OrderStatusBadge from "@/admin/OrderStatusBadge";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    image?: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  tax: number;
  shippingCost: number;
  subtotal: number;
  notes?: string;
  items: OrderItem[];
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function AdminOrderDetails() {
  useProtectedAdmin();
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await fetch(`/api/admin/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch order");
      }

      const data = await response.json();
      if (data.success) {
        setOrder(data.data);
        setNotes(data.data.notes || "");
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!order) return;

    try {
      setUpdating(true);
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      const response = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: order.status,
          notes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save notes");
      }

      const data = await response.json();
      if (data.success) {
        setOrder(data.data);
        toast({
          title: "Notes saved",
          description: "Order notes updated successfully",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save notes",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/orders")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Button>
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">Order not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/orders")}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-muted-foreground mt-2">
            Created {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status & Overview */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Order Status</h2>
                <OrderStatusBadge
                  status={order.status}
                  orderId={order.id}
                  onStatusChange={() => fetchOrder()}
                />
              </div>
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Order Total</p>
                <p className="text-2xl font-bold mt-1">
                  AED {order.total.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Items</p>
                <p className="text-2xl font-bold mt-1">{order.items.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-sm mt-1">
                  {new Date(order.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Items */}
          <Card>
            <div className="p-6 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Items</h2>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border/40 bg-secondary/50">
                  <tr>
                    <th className="p-4 text-left font-medium">Product</th>
                    <th className="p-4 text-right font-medium">Price</th>
                    <th className="p-4 text-right font-medium">Qty</th>
                    <th className="p-4 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-border/40 hover:bg-secondary/30"
                    >
                      <td className="p-4">
                        <div className="flex gap-3 items-center">
                          {item.product.image && (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="h-12 w-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              ID: {item.product.id.slice(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        AED {item.price.toFixed(2)}
                      </td>
                      <td className="p-4 text-right">{item.quantity}</td>
                      <td className="p-4 text-right font-medium">
                        AED {(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="p-6 border-t border-border/40 space-y-2 max-w-xs ml-auto">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>AED {order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>AED {order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>AED {order.shippingCost.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>AED {order.total.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Notes */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Notes</h2>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add order notes..."
              className="min-h-24"
            />
            <Button
              onClick={handleSaveNotes}
              disabled={updating}
              className="mt-4"
            >
              {updating ? "Saving..." : "Save Notes"}
            </Button>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Customer</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{order.customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium break-all text-sm">
                  {order.customer.email}
                </p>
              </div>
              {order.customer.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{order.customer.phone}</p>
                </div>
              )}
              <Button variant="outline" size="sm" className="w-full mt-2">
                Contact Customer
              </Button>
            </div>
          </Card>

          {/* Shipping */}
          {order.shippingAddress && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{order.shippingAddress.street}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.country}
                </p>
              </div>
            </Card>
          )}

          {/* Actions */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Actions</h2>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                Mark as Shipped
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Send Tracking
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                Request Return
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
