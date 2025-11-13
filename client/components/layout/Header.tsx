import { Link, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";

const nav = [
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const { count } = useCart();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <div className="container flex h-20 items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-display text-lg tracking-tight hover:opacity-80 transition-opacity">
          Arab Abayas
        </Link>

        {/* Centered Navigation */}
        <nav className="hidden absolute left-1/2 -translate-x-1/2 gap-12 lg:flex">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "text-xs uppercase tracking-widest transition-colors hover:text-accent",
                  isActive ? "text-foreground font-semibold" : "text-muted-foreground",
                )
              }
              end
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors hidden sm:inline-flex">
            Account
          </button>
          <Link
            to="/cart"
            className="relative inline-flex items-center gap-2 rounded-sm border border-border/60 bg-background/50 px-3 py-2 text-sm uppercase tracking-widest text-foreground hover:bg-secondary/30 transition-colors"
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
    </header>
  );
}
