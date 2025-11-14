import { Link, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const nav = [
  {
    to: "/shop",
    label: "Shop All",
    submenu: [
      { label: "Abayas", to: "/shop" },
      { label: "New Arrivals", to: "/shop" },
      { label: "Best Sellers", to: "/shop" },
    ],
  },
  {
    to: "/about",
    label: "About",
  },
  {
    to: "/contact",
    label: "Contact",
  },
];

export default function Header() {
  const { count } = useCart();
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [showStoreSelector, setShowStoreSelector] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-10 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <div className="container px-6">
        {/* Top row: Logo, centered nav, right actions */}
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Mobile Menu Trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="lg:hidden flex items-center justify-center h-6 w-6 text-foreground hover:opacity-70 transition-opacity"
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
            <SheetContent side="left" className="w-80">
              <nav className="mt-8 space-y-6">
                {nav.map((item) => (
                  <div key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm uppercase tracking-widest font-semibold text-foreground hover:text-accent transition-colors block mb-3"
                    >
                      {item.label}
                    </Link>
                    {item.submenu && (
                      <div className="space-y-2 pl-4 border-l border-border/40">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.to}
                            to={subitem.to}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors block"
                          >
                            {subitem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-display text-lg tracking-tight hover:opacity-80 transition-opacity"
          >
            Arab Abayas
          </Link>

          {/* Centered Navigation - Desktop Only */}
          <nav className="hidden absolute left-1/2 -translate-x-1/2 gap-12 lg:flex">
            {nav.map((item, idx) => (
              <div
                key={item.to}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(idx)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "text-xs uppercase tracking-widest transition-colors hover:text-accent py-2",
                      isActive ? "text-foreground font-semibold" : "text-muted-foreground",
                    )
                  }
                  end
                >
                  {item.label}
                </NavLink>

                {/* Mega Dropdown Menu */}
                {item.submenu && (
                  <div className="absolute top-full left-0 w-48 bg-background border border-border/40 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 mt-0">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.to}
                        to={subitem.to}
                        className="block px-4 py-3 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-colors border-b border-border/20 last:border-b-0"
                      >
                        {subitem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 lg:gap-4 ml-auto">
            {/* Store Selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setShowStoreSelector(!showStoreSelector)}
                className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
                <span>GBP</span>
              </button>
              {showStoreSelector && (
                <div className="absolute right-0 mt-2 w-40 bg-background border border-border/40 shadow-lg z-50">
                  <button className="w-full text-left px-4 py-2 text-xs uppercase tracking-widest text-foreground hover:bg-secondary/30 transition-colors border-b border-border/20">
                    GBP (United Kingdom)
                  </button>
                  <button className="w-full text-left px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-colors">
                    USD (United States)
                  </button>
                  <button className="w-full text-left px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-colors">
                    EUR (Europe)
                  </button>
                </div>
              )}
            </div>

            {/* Search */}
            <SearchBar />

            {/* Wishlist */}
            <button className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors hidden sm:inline-flex items-center gap-1.5">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-1.085-.667-2.025-1.587-2.431a2.25 2.25 0 00-2.331-.873c-.464.15-.909.576-1.348.576-.46 0-.891-.423-1.348-.576a2.25 2.25 0 00-2.331.873c-.92.406-1.587 1.346-1.587 2.431M9 12c0-1.657.895-3.095 2.225-3.863m5.55 0c1.33.768 2.225 2.206 2.225 3.863m-12 0a8.25 8.25 0 1116.5 0m-1.5 0c0 .937-.118 1.846-.338 2.729M15 12a3 3 0 11-6 0m6 0a3 3 0 1-6 0m6 0h.008v.008h-.008V12z" />
              </svg>
            </button>

            {/* Account */}
            <button className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors hidden sm:inline-flex items-center gap-1.5">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative inline-flex items-center gap-2 rounded-sm border border-border/60 bg-background/50 px-3 py-2 text-xs uppercase tracking-widest text-foreground hover:bg-secondary/30 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4"
                />
                <circle cx="10" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
              {count > 0 && (
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
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
