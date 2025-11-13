import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCarousel from "@/components/ProductCarousel";
import { api } from "@/lib/api";

export default function Index() {
  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: api.listProducts,
  });
  const products = data?.products ?? [];

  return (
    <>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Featured Collection Carousel */}
      {products.length > 0 && (
        <ProductCarousel
          title="Featured Collection"
          description="Our curated selection of premium pieces"
          products={products.slice(0, 6)}
          itemsPerView={3}
        />
      )}

      {/* Editorial Section 1 */}
      <section className="border-t border-border/40 bg-secondary/20">
        <div className="container py-16 md:py-24 grid gap-8 md:grid-cols-2">
          <div className="flex flex-col justify-center">
            <p className="uppercase tracking-widest text-xs text-muted-foreground mb-4">
              Timeless Collection
            </p>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-6">
              Signature Abayas
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-8 max-w-md">
              Discover our signature collection of abayas, meticulously crafted from the finest materials. Each piece combines traditional elegance with contemporary design, perfect for any occasion.
            </p>
            <Link
              to="/shop"
              className="inline-block w-fit uppercase tracking-widest text-sm font-semibold border border-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-colors"
            >
              Shop Collection
            </Link>
          </div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-secondary border border-border/40">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=800"
              alt="Signature Abayas"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Best Sellers Carousel */}
      {products.length > 0 && (
        <ProductCarousel
          title="Best Sellers"
          description="Our most-loved designs"
          products={products}
          itemsPerView={4}
        />
      )}

      {/* Editorial Section 2 */}
      <section className="py-16 md:py-24 border-t border-border/40">
        <div className="container grid gap-8 md:grid-cols-2">
          <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-secondary border border-border/40 order-2 md:order-1">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=800"
              alt="Premium Quality"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center order-1 md:order-2">
            <p className="uppercase tracking-widest text-xs text-muted-foreground mb-4">
              Our Craftsmanship
            </p>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-6">
              Premium Quality, Luxe Comfort
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-8 max-w-md">
              Every abaya is carefully crafted with attention to detail. We use only the finest fabrics and employ traditional techniques combined with modern design sensibilities.
            </p>
            <Link
              to="/about"
              className="inline-block w-fit uppercase tracking-widest text-sm font-semibold border border-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-foreground text-background py-16 md:py-24">
        <div className="container">
          <h2 className="font-display text-3xl md:text-4xl tracking-tight text-center mb-16">
            Premium Services
          </h2>
          <div className="grid gap-12 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 h-12 w-12 flex items-center justify-center border border-background/30 rounded-sm">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M21 7.5V6a2.25 2.25 0 0 0-2.25-2.25h-13.5A2.25 2.25 0 0 0 3 6v1.5m18 0v9A2.25 2.25 0 0 1 18.75 19.5h-13.5A2.25 2.25 0 0 1 3 16.5v-9m18 0H3m18 0-9 7.5L3 7.5"
                  />
                </svg>
              </div>
              <h3 className="font-display text-xl mb-3">Complimentary Shipping</h3>
              <p className="text-sm text-background/80 max-w-xs">
                Enjoy free worldwide delivery on all orders, ensuring your pieces arrive safely and securely.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-6 h-12 w-12 flex items-center justify-center border border-background/30 rounded-sm">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h3 className="font-display text-xl mb-3">Personalisation</h3>
              <p className="text-sm text-background/80 max-w-xs">
                Add a bespoke touch with custom monogramming or embroidery, hand-finished to perfection.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-6 h-12 w-12 flex items-center justify-center border border-background/30 rounded-sm">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 8c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 2c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 7c-3.314 0-6 1.686-6 4v3h12v-3c0-2.314-2.686-4-6-4z"
                  />
                </svg>
              </div>
              <h3 className="font-display text-xl mb-3">Expert Care</h3>
              <p className="text-sm text-background/80 max-w-xs">
                Our concierge team is available to assist with sizing, styling, and care recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="border-t border-border/40 bg-secondary/30 py-16 md:py-24">
        <div className="container max-w-2xl text-center">
          <p className="uppercase tracking-widest text-xs text-muted-foreground mb-4">
            Stay Connected
          </p>
          <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-6">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-foreground/80 mb-8 max-w-lg mx-auto">
            Be the first to know about new collections, exclusive offers, and styling tips from our team.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-background border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent rounded-sm"
            />
            <button
              type="submit"
              className="uppercase tracking-widest text-sm font-semibold bg-foreground text-background px-6 py-3 hover:bg-foreground/90 transition-colors rounded-sm"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
