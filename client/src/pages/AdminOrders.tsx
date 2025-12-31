import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useProtectedAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/ui/card";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
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
import { Skeleton } from "@/ui/skeleton";
import { Plus, Search, Download, CheckCircle2 } from "lucide-react";
import OrderStatusBadge from "@/admin/OrderStatusBadge";

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
    };
  }>;
}

interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

interface PaginatedResponse {
  items: Order[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const ORDER_STATUSES = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AdminOrders() {
  useProtectedAdmin();

  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState<PaginatedResponse | null>(null);

  // Filter states
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [dateFrom, setDateFrom] = useState(searchParams.get("dateFrom") || "");
  const [dateTo, setDateTo] = useState(searchParams.get("dateTo") || "");

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (page > 1) params.set("page", page.toString());
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    setSearchParams(params);
  }, [search, status, page, dateFrom, dateTo, setSearchParams]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      const query = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(status && status !== "all" && { status }),
        ...(search && { search }),
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo }),
      });

      const response = await fetch(`/api/admin/orders?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }

      const data = await response.json();
      if (data.success) {
        setOrders(data.data.items);
        setPagination(data.data);
        setError("");
      } else {
        setError(data.error || "Failed to load orders");
      }
    } catch (err) {
      setError("An error occurred while fetching orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, status, search, dateFrom, dateTo, navigate]);

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      const response = await fetch("/api/admin/orders/stats/summary", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [page, status, search, dateFrom, dateTo]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleExport = async () => {
    try {
      const csv = [
        ["Order ID", "Customer", "Email", "Total", "Status", "Date"],
        ...orders.map((order) => [
          order.id,
          order.customer.name,
          order.customer.email,
          order.total.toString(),
          order.status,
          new Date(order.createdAt).toLocaleDateString(),
        ]),
      ]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export successful",
        description: `Exported ${orders.length} orders`,
      });
    } catch (err) {
      toast({
        title: "Export failed",
        description: "Could not export orders",
        variant: "destructive",
      });
      console.error(err);
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("");
    setPage(1);
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track customer orders
          </p>
        </div>
        <Button onClick={() => navigate("/admin/orders/new")} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Create Order
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Orders
              </p>
              {stats ? (
                <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
              ) : (
                <Skeleton className="h-10 w-20 mt-2" />
              )}
            </div>
            <CheckCircle2 className="h-8 w-8 text-blue-500 opacity-20" />
          </div>
        </Card>

        {/* Total Revenue */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </p>
              {stats ? (
                <p className="text-3xl font-bold mt-2">
                  AED {stats.totalRevenue.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              ) : (
                <Skeleton className="h-10 w-32 mt-2" />
              )}
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500 opacity-20" />
          </div>
        </Card>

        {/* Average Order Value */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Avg Order Value
              </p>
              {stats ? (
                <p className="text-3xl font-bold mt-2">
                  AED {stats.averageOrderValue.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              ) : (
                <Skeleton className="h-10 w-24 mt-2" />
              )}
            </div>
            <CheckCircle2 className="h-8 w-8 text-purple-500 opacity-20" />
          </div>
        </Card>

        {/* Pending Orders */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Pending Orders
              </p>
              {stats ? (
                <p className="text-3xl font-bold mt-2 text-yellow-600">
                  {stats.pendingOrders}
                </p>
              ) : (
                <Skeleton className="h-10 w-16 mt-2" />
              )}
            </div>
            <CheckCircle2 className="h-8 w-8 text-yellow-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive/30">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Filters</h3>
          {(search || status || dateFrom || dateTo) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="text-muted-foreground"
            >
              Reset
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="flex items-center gap-2 col-span-1 md:col-span-2 lg:col-span-1">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID or customer..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="flex-1"
            />
          </div>

          {/* Status Filter */}
          <Select value={status} onValueChange={(value) => {
            setStatus(value);
            setPage(1);
          }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              {ORDER_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date From */}
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setPage(1);
            }}
            placeholder="From date"
          />

          {/* Date To */}
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setPage(1);
            }}
            placeholder="To date"
          />

          {/* Export */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={orders.length === 0}
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </Card>

      {/* Orders Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-4 w-16 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-muted-foreground">
                      No orders found. Try adjusting your filters.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      {order.id.slice(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.customer.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </TableCell>
                    <TableCell className="font-medium">
                      AED {order.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge
                        status={order.status}
                        orderId={order.id}
                        onStatusChange={() => fetchOrders()}
                      />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                      >
                        View
                      </Button>
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
