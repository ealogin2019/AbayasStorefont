import { Link, NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { User, LogOut } from "lucide-react";

const nav = [
  {
    to: "/shop",
    label: "New In",
    dropdown: [
      { to: "/shop?collection=latest", label: "Just Arrived" },
      { to: "/shop?collection=trending", label: "Trending Now" },
      { to: "/shop?collection=bestsellers", label: "Best Sellers" },
    ],
  },
  {
    to: "/shop?category=abayas",
    label: "Abayas",
    dropdown: [
      { to: "/shop?category=abayas&style=classic", label: "Classic Collection" },
      { to: "/shop?category=abayas&style=modern", label: "Modern Styles" },
      { to: "/shop?category=abayas&style=embellished", label: "Embellished" },
      { to: "/shop?category=abayas&style=casual", label: "Casual Wear" },
    ],
  },
  {
    to: "/shop?category=kaftans",
    label: "Kaftans",
    dropdown: [
      { to: "/shop?category=kaftans&style=silk", label: "Silk Kaftans" },
      { to: "/shop?category=kaftans&style=cotton", label: "Cotton Kaftans" },
      { to: "/shop?category=kaftans&style=evening", label: "Evening Wear" },
    ],
  },
  {
    to: "/shop?category=scarves",
    label: "Scarves",
    dropdown: [
      { to: "/shop?category=scarves&material=silk", label: "Silk Scarves" },
      { to: "/shop?category=scarves&material=chiffon", label: "Chiffon Scarves" },
      { to: "/shop?category=scarves&style=printed", label: "Printed Designs" },
    ],
  },
  {
    to: "/shop?category=accessories",
    label: "Accessories",
    dropdown: [
      { to: "/shop?category=accessories&type=bags", label: "Bags & Clutches" },
      { to: "/shop?category=accessories&type=jewelry", label: "Jewelry" },
      { to: "/shop?category=accessories&type=belts", label: "Belts" },
    ],
  },
  {
    to: "/about",
    label: "Our Story",
  },
  {
    to: "/contact",
    label: "Contact",
  },
];

export default function Header() {
  const { count } = useCart();
  const { isAuthenticated, customer, logout } = useCustomerAuth();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showStoreSelector, setShowStoreSelector] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOverHero, setIsOverHero] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  // Only apply transparency on index page
  const isIndexPage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroHeight = window.innerHeight * 0.7; // Hero section height

      setIsScrolled(scrollPosition > 10);
      setIsOverHero(scrollPosition < heroHeight);
    };

    handleScroll(); // Check initial state
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed left-0 right-0 z-[100] w-full transition-all duration-500 ease-out",
      isScrolled ? "top-0" : "top-9",
      openDropdown
        ? "bg-white/98 backdrop-blur-xl border-b border-black/5 shadow-sm"
        : isIndexPage && isOverHero
          ? "bg-transparent"
          : "bg-white/98 backdrop-blur-xl border-b border-black/5 shadow-sm"
    )}>
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Top row: Logo, centered nav, right actions */}
        <div className="flex h-16 sm:h-18 md:h-20 lg:h-20 items-center justify-between gap-3 sm:gap-4 md:gap-6">
          {/* Mobile Menu Trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="lg:hidden flex items-center justify-center h-6 w-6 text-foreground hover:opacity-60 transition-opacity duration-300"
                aria-label="Open menu"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-white/95 backdrop-blur-xl border-r border-black/5">
              <nav className="mt-12 space-y-8">
                {nav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm tracking-[0.15em] text-black hover:text-luxury-charcoal transition-all duration-300 block font-light uppercase"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link
            to="/"
            className={cn(
              "font-serif text-lg sm:text-xl md:text-2xl tracking-luxury-tight transition-all duration-500 flex-shrink-0 font-light hover:opacity-80",
              isIndexPage && isOverHero
                ? "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                : "text-black"
            )}
          >
            Arab Abayas
          </Link>

          {/* Centered Navigation - Desktop Only */}
          <nav
            className="hidden absolute left-1/2 -translate-x-1/2 gap-8 lg:gap-10 xl:gap-12 lg:flex"
            onMouseEnter={() => isOverHero && setOpenDropdown('hover')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            {nav.map((item, idx) => (
              <div
                key={item.to}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(item.dropdown ? item.label : 'hover')}
              >
                <NavLink
                  to={item.to}
                  className={cn(
                    "nav-link py-3 relative inline-block font-light transition-colors duration-300",
                    isIndexPage && isOverHero
                      ? "text-white hover:text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
                      : "text-black hover:text-black"
                  )}
                  style={{ transitionDelay: `${idx * 75}ms` }}
                  end
                >
                  {item.label}
                </NavLink>

                  {/* Enhanced Dropdown Menu */}
                  {item.dropdown && openDropdown === item.label && (
                    <div className="absolute top-full left-0 pt-8 animate-slide-in-right" style={{ transform: 'translateX(calc(-50% + 50px))' }}>
                      <div className="relative group/menu">
                        {/* Premium container with refined borders */}
                        <div className="relative bg-white/95 backdrop-blur-xl w-[220px] shadow-2xl border border-black/5">
                          {/* Elegant top border accent */}
                          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-black/20 to-transparent" />

                          {/* Content area */}
                          <div className="px-8 py-8">
                            <div className="space-y-1">
                              {item.dropdown.map((subItem, subIdx) => (
                                <Link
                                  key={subItem.to}
                                  to={subItem.to}
                                className="dropdown-item block text-black/80 hover:text-black transition-all duration-300 opacity-0 relative group/item"
                                  style={{
                                    animationDelay: `${subIdx * 75}ms`,
                                    animation: 'fadeInUp 0.6s ease-out forwards',
                                    animationFillMode: 'forwards'
                                  }}
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  <span className="relative inline-block">
                                    {subItem.label}
                                    {/* Sophisticated slide-in underline */}
                                    <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-black transition-all duration-500 ease-out group-hover/item:w-full" />
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* Refined bottom border */}
                          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-black/10 to-transparent" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ),
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-6 lg:gap-8 ml-auto">
            {/* Search */}
            <div className={cn(
              "transition-all duration-500",
              isIndexPage && isOverHero
                ? "text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
                : "text-black"
            )}>
              <SearchBar />
            </div>

            {/* Account - Desktop Only */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className={cn(
                  "transition-all duration-300 inline-flex items-center gap-2",
                  isIndexPage && isOverHero
                    ? "text-white hover:text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
                    : "text-black hover:text-black/90"
                )}
              >
                <User className="h-5 w-5 transition-transform duration-300 hover:scale-105" />
                {isAuthenticated && customer?.firstName && (
                  <span className="hidden lg:inline text-xs tracking-[0.1em] capitalize font-light">{customer.firstName}</span>
                )}
              </button>
              {showAccountMenu && (
                <div className="absolute right-0 mt-8 z-50 animate-fade-in-up">
                  <div className="relative">
                    {/* Premium container */}
                    <div className="relative bg-white/95 backdrop-blur-xl shadow-2xl border border-black/5 min-w-[220px]">
                      {/* Top border accent */}
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-black/20 to-transparent" />

                      <div className="px-8 py-6">
                        {isAuthenticated ? (
                          <div className="space-y-1">
                            <Link
                              to="/profile"
                              onClick={() => setShowAccountMenu(false)}
                              className="dropdown-item flex items-center gap-4 py-3 text-black/80 hover:text-black group/item"
                            >
                              <User className="h-4 w-4 opacity-60 group-hover/item:opacity-100 transition-opacity duration-300" />
                              <span className="relative">
                                My Account
                                <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-black transition-all duration-500 ease-out group-hover/item:w-full" />
                              </span>
                            </Link>
                            <button
                              onClick={() => {
                                logout();
                                setShowAccountMenu(false);
                              }}
                              className="dropdown-item w-full flex items-center gap-4 py-3 text-black/80 hover:text-black group/item"
                            >
                              <LogOut className="h-4 w-4 opacity-60 group-hover/item:opacity-100 transition-opacity duration-300" />
                              <span className="relative">
                                Sign Out
                                <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-black transition-all duration-500 ease-out group-hover/item:w-full" />
                              </span>
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <Link
                              to="/login"
                              onClick={() => setShowAccountMenu(false)}
                              className="dropdown-item block py-3 text-black/80 hover:text-black group/item"
                            >
                              <span className="relative inline-block">
                                Sign In
                                <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-black transition-all duration-500 ease-out group-hover/item:w-full" />
                              </span>
                            </Link>
                            <Link
                              to="/signup"
                              onClick={() => setShowAccountMenu(false)}
                              className="dropdown-item block py-3 text-black/80 hover:text-black group/item"
                            >
                              <span className="relative inline-block">
                                Create Account
                                <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-black transition-all duration-500 ease-out group-hover/item:w-full" />
                              </span>
                            </Link>
                          </div>
                        )}
                      </div>

                      {/* Bottom border */}
                      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-black/10 to-transparent" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className={cn(
                "relative inline-flex items-center gap-2 transition-all duration-500 group",
                isIndexPage && isOverHero
                  ? "text-white hover:text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
                  : "text-black hover:text-black/90"
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 transition-transform duration-300 group-hover:scale-105"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4"
                />
                <circle cx="10" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
              {count > 0 && (
                <span className={cn(
                  "absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium transition-all duration-500 animate-bounce-subtle",
                  isIndexPage && isOverHero && !openDropdown ? "bg-white text-black drop-shadow-lg" : "bg-black text-white"
                )}>
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
