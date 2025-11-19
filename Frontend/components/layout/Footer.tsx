import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-foreground text-background">
      <div className="container py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-4 mb-16">
          {/* Brand Column */}
          <div>
            <h3 className="font-display text-lg mb-4">Arab Abayas</h3>
            <p className="text-sm text-background/80 leading-relaxed max-w-sm">
              Elegant, modern abayas crafted for sophistication and comfort. Inspired by tradition, designed for today.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="#" className="h-8 w-8 flex items-center justify-center border border-background/30 hover:border-background/60 transition-colors" aria-label="Facebook">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20v-7.21H5.5V9.25h2.79V7.16c0-2.77 1.694-4.28 4.194-4.28 1.203 0 2.24.09 2.543.13v2.947h-1.746c-1.356 0-1.62.645-1.62 1.59v2.084h3.24l-4.21 3.54V20H8.29z" /></svg>
              </a>
              <a href="#" className="h-8 w-8 flex items-center justify-center border border-background/30 hover:border-background/60 transition-colors" aria-label="Instagram">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.69.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.015-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm4.846-10.405c0 .795-.645 1.44-1.44 1.44-.795 0-1.44-.645-1.44-1.44 0-.794.645-1.439 1.44-1.439.795 0 1.44.645 1.44 1.439z" /></svg>
              </a>
              <a href="#" className="h-8 w-8 flex items-center justify-center border border-background/30 hover:border-background/60 transition-colors" aria-label="Pinterest">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 19c-3.859 0-7-3.141-7-7s3.141-7 7-7 7 3.141 7 7-3.141 7-7 7zm3.5-10.5c-.966 0-1.75.784-1.75 1.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75-.784-1.75-1.75-1.75z" /></svg>
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="uppercase tracking-widest text-xs font-semibold mb-6">Shop</h4>
            <ul className="space-y-3">
              <li><Link to="/shop" className="text-sm text-background/80 hover:text-background transition-colors">All Products</Link></li>
              <li><Link to="/shop" className="text-sm text-background/80 hover:text-background transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop" className="text-sm text-background/80 hover:text-background transition-colors">Best Sellers</Link></li>
              <li><Link to="/shop" className="text-sm text-background/80 hover:text-background transition-colors">Collections</Link></li>
            </ul>
          </div>

          {/* About Column */}
          <div>
            <h4 className="uppercase tracking-widest text-xs font-semibold mb-6">About</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm text-background/80 hover:text-background transition-colors">Our Story</Link></li>
              <li><a href="#" className="text-sm text-background/80 hover:text-background transition-colors">Craftsmanship</a></li>
              <li><a href="#" className="text-sm text-background/80 hover:text-background transition-colors">Size Guide</a></li>
              <li><a href="#" className="text-sm text-background/80 hover:text-background transition-colors">Care Guide</a></li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="uppercase tracking-widest text-xs font-semibold mb-6">Support</h4>
            <ul className="space-y-3">
              <li><Link to="/contact" className="text-sm text-background/80 hover:text-background transition-colors">Contact Us</Link></li>
              <li><a href="#" className="text-sm text-background/80 hover:text-background transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-sm text-background/80 hover:text-background transition-colors">Returns</a></li>
              <li><a href="#" className="text-sm text-background/80 hover:text-background transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8">
          <div className="grid gap-6 md:gap-8 md:grid-cols-2 items-center">
            <p className="text-xs text-background/60">
              © {new Date().getFullYear()} Arab Abayas. All rights reserved.
            </p>
            <div className="flex gap-6 md:justify-end">
              <a href="#" className="text-xs text-background/60 hover:text-background/80 transition-colors">Privacy Policy</a>
              <a href="#" className="text-xs text-background/60 hover:text-background/80 transition-colors">Terms of Service</a>
              <a href="#" className="text-xs text-background/60 hover:text-background/80 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
