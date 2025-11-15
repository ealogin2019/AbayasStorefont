import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";

const adminNav = [
  { label: "Dashboard", path: "/admin" },
  { label: "Products", path: "/admin/products" },
  { label: "Orders", path: "/admin/orders" },
  { label: "Customers", path: "/admin/customers" },
  { label: "Settings", path: "/admin/settings" },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "transition-all duration-300 border-r border-border/40",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-6 border-b border-border/40">
          <Link
            to="/admin"
            className="font-display text-xl font-bold text-foreground"
          >
            {sidebarOpen && "Admin"}
            {!sidebarOpen && "A"}
          </Link>
        </div>

        <nav className="p-4 space-y-2">
          {adminNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "block px-4 py-2 rounded-lg transition-colors hover:bg-secondary",
                sidebarOpen ? "" : "text-center"
              )}
            >
              {sidebarOpen ? item.label : item.label[0]}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-0 right-0 px-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={handleLogout}
          >
            {sidebarOpen && (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </>
            )}
            {!sidebarOpen && <LogOut className="h-4 w-4" />}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="border-b border-border/40 bg-background/95 backdrop-blur px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-secondary/30 p-2 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <div className="text-sm text-muted-foreground">Admin Panel</div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
