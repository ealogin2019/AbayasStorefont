import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useProtectedAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Users, TrendingUp, DollarSign, Mail, Phone, MapPin, Package } from "lucide-react";

interface Customer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  createdAt: string;
  _count?: {
    orders: number;
  };
}

interface CustomerStats {
  totalCustomers: number;
  newCustomersThisMonth: number;
  averageOrdersPerCustomer: number;
  averageLifetimeValue: number;
}

interface CustomerDetails extends Customer {
  orders?: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
}

export default function AdminCustomers() {
  useProtectedAdmin();

  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState<any>(null);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));

  // Customer detail modal
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetails | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (page > 1) params.set("page", page.toString());
    setSearchParams(params);
  }, [search, page, setSearchParams]);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      const query = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...(search && { search }),
      });

      const response = await fetch(`/api/admin/customers?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }

      const data = await response.json();
      if (data.success) {
        setCustomers(data.data.items);
        setPagination(data.data);
        setError("");
      } else {
        setError(data.error || "Failed to load customers");
      }
    } catch (err) {
      setError("An error occurred while fetching customers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, navigate]);

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      const response = await fetch("/api/admin/customers/stats/summary", {
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

  const fetchCustomerDetails = async (customerId: string) => {
    setLoadingDetails(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      const response = await fetch(`/api/admin/customers/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSelectedCustomer(data.data);
          setShowDetails(true);
        }
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load customer details",
        variant: "destructive",
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your customer base
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Customers
              </p>
              {stats ? (
                <p className="text-3xl font-bold mt-2">{stats.totalCustomers}</p>
              ) : (
                <Skeleton className="h-10 w-20 mt-2" />
              )}
            </div>
            <Users className="h-8 w-8 text-blue-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                New This Month
              </p>
              {stats ? (
                <p className="text-3xl font-bold mt-2 text-green-600">
                  +{stats.newCustomersThisMonth}
                </p>
              ) : (
                <Skeleton className="h-10 w-16 mt-2" />
              )}
            </div>
            <TrendingUp className="h-8 w-8 text-green-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Avg Orders/Customer
              </p>
              {stats ? (
                <p className="text-3xl font-bold mt-2">
                  {stats.averageOrdersPerCustomer.toFixed(1)}
                </p>
              ) : (
                <Skeleton className="h-10 w-16 mt-2" />
              )}
            </div>
            <Package className="h-8 w-8 text-purple-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Avg Lifetime Value
              </p>
              {stats ? (
                <p className="text-3xl font-bold mt-2">
                  AED {stats.averageLifetimeValue.toFixed(0)}
                </p>
              ) : (
                <Skeleton className="h-10 w-24 mt-2" />
              )}
            </div>
            <DollarSign className="h-8 w-8 text-yellow-500 opacity-20" />
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
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-md"
          />
        </div>
      </Card>

      {/* Customers Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-muted-foreground">
                      No customers found. Try adjusting your search.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="font-medium">
                        {customer.firstName || customer.lastName
                          ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim()
                          : "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{customer.email}</TableCell>
                    <TableCell className="text-sm">
                      {customer.phone || "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {customer.city && customer.country
                        ? `${customer.city}, ${customer.country}`
                        : customer.country || "—"}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                        {customer._count?.orders || 0}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => fetchCustomerDetails(customer.id)}
                        disabled={loadingDetails}
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

      {/* Customer Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              View customer information and order history
            </DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-6 mt-4">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Name
                  </p>
                  <p className="mt-1">
                    {selectedCustomer.firstName || selectedCustomer.lastName
                      ? `${selectedCustomer.firstName || ""} ${selectedCustomer.lastName || ""}`.trim()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </p>
                  <p className="mt-1 text-sm">{selectedCustomer.email}</p>
                </div>
                {selectedCustomer.phone && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </p>
                    <p className="mt-1">{selectedCustomer.phone}</p>
                  </div>
                )}
                {(selectedCustomer.address || selectedCustomer.city) && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location
                    </p>
                    <p className="mt-1 text-sm">
                      {selectedCustomer.address && <span>{selectedCustomer.address}<br /></span>}
                      {selectedCustomer.city}, {selectedCustomer.country} {selectedCustomer.zipCode}
                    </p>
                  </div>
                )}
              </div>

              {/* Order History */}
              {selectedCustomer.orders && selectedCustomer.orders.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Order History</h3>
                  <div className="space-y-2">
                    {selectedCustomer.orders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary/50 cursor-pointer"
                        onClick={() => {
                          setShowDetails(false);
                          navigate(`/admin/orders/${order.id}`);
                        }}
                      >
                        <div>
                          <p className="font-medium">Order #{order.orderNumber}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">AED {order.total.toFixed(2)}</p>
                          <p className="text-xs capitalize">{order.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
