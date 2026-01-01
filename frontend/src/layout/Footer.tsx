import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-black/8 bg-white text-black">
      <div className="container px-6 md:px-8 lg:px-12 py-16 md:py-20 lg:py-24">
        {/* Newsletter Section */}
        <div className="mb-16 md:mb-20 border-b border-black/8 pb-16 md:pb-20">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-serif text-2xl md:text-3xl font-light mb-4">Join Our Newsletter</h3>
            <p className="text-sm font-light text-black/70 mb-8">
              Subscribe to receive exclusive updates, early access to new collections, and special offers.
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 px-4 py-3 border border-black/20 text-sm font-light focus:outline-none focus:border-black transition-colors"
              />
              <button className="px-8 py-3 bg-black text-white text-xs tracking-[0.15em] uppercase font-light hover:bg-black/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-12 md:gap-16 md:grid-cols-2 lg:grid-cols-4 mb-16">
          {/* Brand Column */}
          <div>
            <h3 className="font-serif text-lg font-light mb-6">Arab Abayas</h3>
            <p className="text-sm font-light text-black/70 leading-relaxed max-w-sm">
              Elegant, modern abayas crafted for sophistication and comfort. Inspired by tradition, designed for today.
            </p>
            <div className="mt-8 flex gap-4">
              <a href="#" className="h-9 w-9 flex items-center justify-center border border-black/20 hover:border-black transition-all duration-300" aria-label="Facebook">
                <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20v-7.21H5.5V9.25h2.79V7.16c0-2.77 1.694-4.28 4.194-4.28 1.203 0 2.24.09 2.543.13v2.947h-1.746c-1.356 0-1.62.645-1.62 1.59v2.084h3.24l-4.21 3.54V20H8.29z" /></svg>
              </a>
              <a href="#" className="h-9 w-9 flex items-center justify-center border border-black/20 hover:border-black transition-all duration-300" aria-label="Instagram">
                <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.69.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.015-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm4.846-10.405c0 .795-.645 1.44-1.44 1.44-.795 0-1.44-.645-1.44-1.44 0-.794.645-1.439 1.44-1.439.795 0 1.44.645 1.44 1.439z" /></svg>
              </a>
              <a href="#" className="h-9 w-9 flex items-center justify-center border border-black/20 hover:border-black transition-all duration-300" aria-label="Pinterest">
                <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 19c-3.859 0-7-3.141-7-7s3.141-7 7-7 7 3.141 7 7-3.141 7-7 7zm3.5-10.5c-.966 0-1.75.784-1.75 1.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75-.784-1.75-1.75-1.75z" /></svg>
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="uppercase tracking-[0.15em] text-xs font-light mb-8">Shop</h4>
            <ul className="space-y-4">
              <li><Link to="/shop" className="text-sm font-light text-black/70 hover:text-black transition-colors">All Products</Link></li>
              <li><Link to="/shop" className="text-sm font-light text-black/70 hover:text-black transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop" className="text-sm font-light text-black/70 hover:text-black transition-colors">Best Sellers</Link></li>
              <li><Link to="/shop" className="text-sm font-light text-black/70 hover:text-black transition-colors">Collections</Link></li>
            </ul>
          </div>

          {/* About Column */}
          <div>
            <h4 className="uppercase tracking-[0.15em] text-xs font-light mb-8">About</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-sm font-light text-black/70 hover:text-black transition-colors">Our Story</Link></li>
              <li><a href="#" className="text-sm font-light text-black/70 hover:text-black transition-colors">Craftsmanship</a></li>
              <li><a href="#" className="text-sm font-light text-black/70 hover:text-black transition-colors">Size Guide</a></li>
              <li><a href="#" className="text-sm font-light text-black/70 hover:text-black transition-colors">Care Guide</a></li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="uppercase tracking-[0.15em] text-xs font-light mb-8">Support</h4>
            <ul className="space-y-4">
              <li><Link to="/contact" className="text-sm font-light text-black/70 hover:text-black transition-colors">Contact Us</Link></li>
              <li><a href="#" className="text-sm font-light text-black/70 hover:text-black transition-colors">Shipping & Delivery</a></li>
              <li><a href="#" className="text-sm font-light text-black/70 hover:text-black transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="text-sm font-light text-black/70 hover:text-black transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-black/8 pt-8 md:pt-10">
          <div className="flex flex-col md:flex-row gap-6 md:gap-0 justify-between items-center">
            <p className="text-xs font-light text-black/50">
              © {new Date().getFullYear()} Arab Abayas. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6 items-center">
              <a href="#" className="text-xs font-light text-black/50 hover:text-black transition-colors">Privacy Policy</a>
              <a href="#" className="text-xs font-light text-black/50 hover:text-black transition-colors">Terms of Service</a>
              <a href="#" className="text-xs font-light text-black/50 hover:text-black transition-colors">Accessibility</a>
            </div>
            <div className="flex gap-2">
              <img src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/0169695890db3db16bfe.svg" alt="Visa" className="h-6 opacity-60" />
              <img src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/37fc65d3d2b61a8773c5.svg" alt="Mastercard" className="h-6 opacity-60" />
              <img src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/f11b90c2972f4932c16a.svg" alt="American Express" className="h-6 opacity-60" />
              <img src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/7326d8c10e8d6e8eb684.svg" alt="PayPal" className="h-6 opacity-60" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
