import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { Skeleton } from "@/ui/skeleton";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  MapPin,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  product: {
    id: string;
    name: string;
    image: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

const STATUS_TIMELINE = [
  {
    status: "pending",
    label: "Order Placed",
    icon: Package,
    description: "Your order has been received",
  },
  {
    status: "processing",
    label: "Processing",
    icon: Clock,
    description: "We're preparing your items",
  },
  {
    status: "shipped",
    label: "Shipped",
    icon: Truck,
    description: "Your order is on its way",
  },
  {
    status: "delivered",
    label: "Delivered",
    icon: CheckCircle,
    description: "Order has been delivered",
  },
];

const STATUS_COLORS = {
  pending: "bg-gray-500",
  processing: "bg-blue-500",
  shipped: "bg-purple-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
};

export default function OrderTracking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { customer } = useCustomerAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!customer) {
        navigate("/login");
        return;
      }

      try {
        const token = localStorage.getItem("customerToken");
        const response = await fetch(`/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Order not found");
        }

        const data = await response.json();
        setOrder(data.order);
      } catch (err: any) {
        setError(err.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, customer, navigate]);

  if (loading) {
    return (
      <div className="container py-12 px-4">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container py-12 px-4">
        <Card className="max-w-md mx-auto text-center p-8">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => navigate("/")}>Back to Shop</Button>
        </Card>
      </div>
    );
  }

  const currentStatusIndex = STATUS_TIMELINE.findIndex(
    (s) => s.status === order.status,
  );
  const isCancelled = order.status === "cancelled";

  return (
    <div className="container py-8 md:py-12 px-4 md:px-6 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="mb-6">
        <h1 className="font-display text-2xl md:text-3xl tracking-tight mb-2">
          Order #{order.orderNumber}
        </h1>
        <p className="text-sm text-muted-foreground">
          Placed on{" "}
          {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
        </p>
      </div>

      {/* Order Status Timeline */}
      {!isCancelled && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Order Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200">
                <div
                  className={`h-full ${STATUS_COLORS[order.status]} transition-all duration-500`}
                  style={{
                    width: `${(currentStatusIndex / (STATUS_TIMELINE.length - 1)) * 100}%`,
                  }}
                />
              </div>

              {/* Timeline Steps */}
              <div className="relative grid grid-cols-4 gap-4">
                {STATUS_TIMELINE.map((step, index) => {
                  const isActive = index <= currentStatusIndex;
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.status}
                      className="flex flex-col items-center"
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                          isActive
                            ? `${STATUS_COLORS[order.status]} text-white`
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <p
                        className={`text-xs md:text-sm font-medium text-center ${
                          isActive ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-xs text-muted-foreground text-center mt-1 hidden md:block">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cancelled Status */}
      {isCancelled && (
        <Card className="mb-6 border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              Order Cancelled
            </CardTitle>
            <CardDescription>
              This order was cancelled on{" "}
              {format(new Date(order.updatedAt), "MMMM d, yyyy")}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Tracking Information */}
      {order.trackingNumber && !isCancelled && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Tracking Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Tracking Number
              </p>
              <p className="text-lg font-mono font-semibold">
                {order.trackingNumber}
              </p>
            </div>

            {order.trackingUrl && (
              <Button asChild variant="outline" className="w-full">
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Track Shipment
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            )}

            {order.estimatedDelivery && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Estimated Delivery
                </p>
                <p className="text-lg font-semibold">
                  {format(
                    new Date(order.estimatedDelivery),
                    "EEEE, MMMM d, yyyy",
                  )}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Order Items */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.product.name}</h4>
                  <div className="text-sm text-muted-foreground mt-1 space-x-2">
                    {item.color && <span>Color: {item.color}</span>}
                    {item.size && <span>Size: {item.size}</span>}
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">AED {item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
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
          <div className="flex justify-between text-lg font-semibold pt-2 border-t">
            <span>Total</span>
            <span>AED {order.total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
