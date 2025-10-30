import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-secondary/40">
      <div className="container grid gap-8 py-10 md:grid-cols-3">
        <div>
          <h3 className="font-display text-lg">Sable Abaya</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            Minimal, refined abayas designed for everyday elegance.
          </p>
        </div>
        <form
          className="flex max-w-md items-center gap-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            aria-label="Email address"
            placeholder="Email address"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <button className="h-10 rounded-md bg-primary px-4 text-sm text-primary-foreground hover:bg-primary/90">
            Subscribe
          </button>
        </form>
        <div className="flex justify-start gap-6 md:justify-end">
          <Link
            to="/about"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            About
          </Link>
          <Link
            to="/shop"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Shop
          </Link>
          <Link
            to="/contact"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Contact
          </Link>
        </div>
      </div>
      <div className="border-t py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Sable Abaya. All rights reserved.
      </div>
    </footer>
  );
}
