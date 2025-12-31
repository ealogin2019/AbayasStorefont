import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { DashboardStats } from "@shared/plugins";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await fetch("/api/admin/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }

      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.error || "Failed to load stats");
      }
    } catch (err) {
      setError("An error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-destructive">{error}</div>;
  }

  if (!stats) {
    return <div className="text-center py-12">No data available</div>;
  }

  const StatCard = ({
    icon: Icon,
    label,
    value,
    trend,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    trend?: string;
  }) => (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {trend && (
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {trend}
            </p>
          )}
        </div>
        <div className="text-muted-foreground">{Icon}</div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your admin panel. Here's your store overview.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Package className="h-6 w-6" />}
          label="Total Products"
          value={stats.totalProducts}
        />
        <StatCard
          icon={<ShoppingCart className="h-6 w-6" />}
          label="Total Orders"
          value={stats.totalOrders}
        />
        <StatCard
          icon={<Users className="h-6 w-6" />}
          label="Total Customers"
          value={stats.totalCustomers}
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6" />}
          label="Total Revenue"
          value={`£${stats.totalRevenue.toFixed(2)}`}
        />
      </div>

      {/* Alerts */}
      {(stats.pendingOrders > 0 || stats.lowStockProducts.length > 0) && (
        <Card className="p-6 border-yellow-200 bg-yellow-50/50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900">Attention Needed</h3>
              <ul className="text-sm text-yellow-800 mt-2 space-y-1">
                {stats.pendingOrders > 0 && (
                  <li>• {stats.pendingOrders} pending order(s) need processing</li>
                )}
                {stats.lowStockProducts.length > 0 && (
                  <li>
                    • {stats.lowStockProducts.length} product(s) have low stock
                  </li>
                )}
              </ul>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/orders")}>
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.customerEmail}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">£{order.total.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {order.status}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No orders yet</p>
            )}
          </div>
        </Card>

        {/* Low Stock Products */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Low Stock Alert</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/products")}>
              Manage
            </Button>
          </div>
          <div className="space-y-3">
            {stats.lowStockProducts.length > 0 ? (
              stats.lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
                >
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-600">
                      {product.quantity} left
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">All products well stocked</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
