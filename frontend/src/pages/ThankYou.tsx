import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Separator } from "@/ui/separator";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  product: {
    name: string;
    image?: string;
  };
  variant?: {
    size?: string;
    color?: string;
  };
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  tax: number;
  email?: string;
  shippingAddress?: ShippingAddress | string;
  items: OrderItem[];
  createdAt: string;
}

export default function ThankYou() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const orderNumber = params.get("orderNumber");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderNumber) {
        setError("No order number provided");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/customer/orders/number/${orderNumber}`
        );

        if (!response.ok) {
          setError("Order not found");
          setLoading(false);
          return;
        }

        const result = await response.json();
        if (result.success && result.data) {
          const orderData = result.data;
          // Parse shippingAddress if it's stored as JSON string
          if (typeof orderData.shippingAddress === "string") {
            try {
              orderData.shippingAddress = JSON.parse(
                orderData.shippingAddress
              );
            } catch (e) {
              console.error("Failed to parse shipping address:", e);
            }
          }
          setOrder(orderData);
        } else {
          setError("Failed to fetch order details");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <h1 className="text-2xl font-semibold mb-2">Oops!</h1>
          <p className="text-red-600 mb-6">{error}</p>
          <Link
            to="/shop"
            className="inline-block bg-[#8B4513] text-white px-6 py-2 rounded hover:bg-[#723A0F]"
          >
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const shippingAddress =
    typeof order.shippingAddress === "string"
      ? JSON.parse(order.shippingAddress)
      : order.shippingAddress;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6 text-center">
          <div className="text-5xl mb-4">✓</div>
          <h1 className="text-3xl font-serif font-bold text-[#8B4513] mb-2">
            Thank You!
          </h1>
          <p className="text-gray-600 mb-4">
            Your order has been placed successfully.
          </p>
          <p className="text-lg font-semibold">
            Order Number:{" "}
            <span className="text-[#8B4513]">{order.orderNumber}</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            We'll send you a confirmation email shortly.
          </p>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
            {shippingAddress ? (
              <address className="not-italic text-gray-700 space-y-1">
                <p className="font-medium">
                  {shippingAddress.firstName} {shippingAddress.lastName}
                </p>
                <p>{shippingAddress.address}</p>
                <p>
                  {shippingAddress.city}, {shippingAddress.postalCode}
                </p>
                <p>{shippingAddress.country}</p>
              </address>
            ) : (
              <p className="text-gray-500">Address not available</p>
            )}
          </div>

          {/* Order Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Order Status</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium capitalize text-[#8B4513]">
                  {order.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                {item.product.image && (
                  <div className="flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded border border-gray-200"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {item.product.name}
                  </h3>
                  <div className="text-sm text-gray-600 mt-1">
                    {item.variant?.size && <p>Size: {item.variant.size}</p>}
                    {item.variant?.color && <p>Color: {item.variant.color}</p>}
                    <p>Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    AED {(item.price * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    AED {item.price.toFixed(2)} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">AED {order.subtotal.toFixed(2)}</span>
            </div>
            {order.shippingCost > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  AED {order.shippingCost.toFixed(2)}
                </span>
              </div>
            )}
            {order.tax > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">AED {order.tax.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-[#8B4513]">
                AED {order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-[#8B4513] text-white rounded hover:bg-[#723A0F] text-center font-medium"
          >
            Continue Shopping
          </Link>
          <Link
            to="/orders"
            className="inline-block px-6 py-3 border-2 border-[#8B4513] text-[#8B4513] rounded hover:bg-[#8B4513] hover:text-white text-center font-medium"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
