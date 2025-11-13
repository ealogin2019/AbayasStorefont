import { Link, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-display text-xl tracking-tight">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-accent align-middle" />
          Arab Abayas
        </Link>
        <nav className="hidden gap-6 md:flex">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "text-sm text-muted-foreground transition-colors hover:text-foreground",
                  isActive && "text-foreground",
                )
              }
              end
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/shop"
            className="hidden rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 md:inline-flex"
          >
            Shop now
          </Link>

          <Link
            to="/cart"
            className="relative inline-flex items-center rounded-md border bg-background px-3 py-2 text-sm hover:bg-accent/5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
              <span className="absolute -right-2 -top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
