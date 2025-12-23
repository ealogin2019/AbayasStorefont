import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Product from "./pages/Product";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import AnnouncementBar from "./components/AnnouncementBar";
import CookieConsent from "./components/CookieConsent";
import { CartProvider } from "@/hooks/useCart";
import { CustomerAuthProvider } from "@/hooks/useCustomerAuth";

// Customer pages
import CustomerLogin from "./pages/CustomerLogin";
import CustomerSignup from "./pages/CustomerSignup";
import CustomerProfile from "./pages/CustomerProfile";
import OrderTracking from "./pages/OrderTracking";

// Admin imports
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminProductForm from "./pages/AdminProductForm";
import AdminLayout from "./components/admin/AdminLayout";
import AdminOrders from "./pages/AdminOrders";
import AdminOrderCreate from "./pages/AdminOrderCreate";
import AdminOrderDetails from "./pages/AdminOrderDetails";
import AdminCustomers from "./pages/AdminCustomers";
import AdminSettings from "./pages/AdminSettings";
import AdminInventory from "./pages/AdminInventory";
import AdminUsers from "./pages/AdminUsers";
import AdminHeroVideos from "./pages/AdminHeroVideos";

const queryClient = new QueryClient();

function Layout() {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] bg-white text-foreground">
      <AnnouncementBar />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CustomerAuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <CookieConsent />
          <BrowserRouter>
            <Routes>
              {/* Public Store Routes */}
              <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Customer Auth Routes */}
              <Route path="/login" element={<CustomerLogin />} />
              <Route path="/signup" element={<CustomerSignup />} />
              <Route path="/profile" element={<CustomerProfile />} />
              <Route path="/orders/:id" element={<OrderTracking />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminLayout />}>
              <Route path="" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<AdminProductForm />} />
              <Route path="products/:id" element={<AdminProductForm />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/new" element={<AdminOrderCreate />} />
              <Route path="orders/:id" element={<AdminOrderDetails />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="hero-videos" element={<AdminHeroVideos />} />
              {/* More admin pages will be added here */}
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
    </CustomerAuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
