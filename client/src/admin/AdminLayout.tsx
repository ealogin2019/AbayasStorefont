import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";
import { LogOut, Menu, X } from "lucide-react";

const adminNav = [
  { label: "Dashboard", path: "/admin" },
  { label: "Products", path: "/admin/products" },
  { label: "Orders", path: "/admin/orders" },
  { label: "Customers", path: "/admin/customers" },
  { label: "Inventory", path: "/admin/inventory" },
  { label: "Homepage", path: "/admin/homepage" },
  { label: "Users", path: "/admin/users" },
  { label: "Hero Videos", path: "/admin/hero-videos" },
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
    <div className="flex h-screen bg-gradient-to-br from-[#faf8f3] to-[#f5f1e8]">
      {/* Sidebar */}
      <aside
        className={cn(
          "transition-all duration-300 border-r border-amber-200/50 bg-gradient-to-b from-[#fff9f0] to-[#fef6ed] shadow-lg",
          sidebarOpen ? "w-64" : "w-20",
        )}
      >
        <div className="p-6 border-b border-amber-200/50 bg-gradient-to-r from-amber-50/50 to-orange-50/30">
          <Link
            to="/admin"
            className="font-display text-xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent"
          >
            {sidebarOpen && "Abaya Admin"}
            {!sidebarOpen && "A"}
          </Link>
        </div>

        <nav className="p-4 space-y-2">
          {adminNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "block px-4 py-2.5 rounded-lg transition-all duration-200 text-amber-900/80 hover:bg-gradient-to-r hover:from-amber-100/70 hover:to-orange-100/60 hover:text-amber-900 hover:shadow-sm font-medium",
                sidebarOpen ? "" : "text-center",
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
            className="w-full justify-start text-amber-900/70 hover:text-amber-900 hover:bg-amber-100/50 px-3 py-2 h-auto"
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
        <header className="border-b border-amber-200/50 bg-gradient-to-r from-[#fffbf5]/95 to-[#fff9f0]/95 backdrop-blur px-6 py-4 flex items-center justify-between shadow-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-amber-100/50 p-2 rounded-lg transition-colors text-amber-900/70 hover:text-amber-900"
          >
            {sidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <div className="text-sm font-medium bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
            Admin Panel
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-[#faf8f3] to-[#f5f1e8]">
          <div className="p-6 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
