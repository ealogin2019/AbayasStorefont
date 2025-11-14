import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCarousel from "@/components/ProductCarousel";
import PromotionalBanner from "@/components/PromotionalBanner";
import DoublePromoBanner from "@/components/DoublePromoBanner";
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
        <section className="py-12 md:py-20 lg:py-32 border-t border-border/40">
          <ProductCarousel
            title="Featured Collection"
            description="Our curated selection of premium pieces"
            products={products.slice(0, 6)}
            itemsPerView={3}
          />
        </section>
      )}

      {/* Promotional Banner */}
      <PromotionalBanner
        title="Summer Collection 2025"
        subtitle="New Arrivals"
        image="https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=1200"
        cta="Shop Now"
        ctaLink="/shop"
        alignment="center"
        variant="dark"
      />

      {/* Double Promotional Banners */}
      <section className="py-8">
        <div className="container">
          <DoublePromoBanner
            items={[
              {
                title: "New In Abayas",
                image: "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Faaa7802432b14c2bb78ec506a8aab37b?format=webp&width=1200",
                cta: "Explore",
                ctaLink: "/shop",
              },
              {
                title: "Premium Fabrics",
                image: "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Fe98ea904eac24d2a837f6a410800c6d1?format=webp&width=1200",
                cta: "Discover",
                ctaLink: "/shop",
              },
            ]}
          />
        </div>
      </section>

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
        <section className="py-20 md:py-32 border-t border-border/40">
          <ProductCarousel
            title="Best Sellers"
            description="Our most-loved designs"
            products={products}
            itemsPerView={4}
          />
        </section>
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

      {/* Premium Services Section */}
      <section className="py-16 md:py-24 border-t border-border/40">
        <div className="container">
          <div className="text-center mb-16">
            <p className="uppercase tracking-widest text-xs text-muted-foreground mb-4">
              Arab Abayas Concierge
            </p>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-4">
              Premium Services
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every order includes our signature services to ensure an exceptional experience.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Service Card 1: Gift Wrap */}
            <div className="flex flex-col">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-secondary/30 border border-border/40 mb-6">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F81ce6da7ab2f4a539be7643f189385d0?format=webp&width=600"
                  alt="Gift Wrap Service"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="font-display text-xl tracking-tight mb-3">Signature Gift Wrap</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1">
                Every order arrives beautifully wrapped in our signature boxes, perfect for gifting or personal indulgence.
              </p>
              <Link to="/shop" className="text-xs uppercase tracking-widest font-semibold text-accent hover:text-accent/80 transition-colors">
                Learn More →
              </Link>
            </div>

            {/* Service Card 2: Express Shipping */}
            <div className="flex flex-col">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-secondary/30 border border-border/40 mb-6">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Fc2f5ee03e6da48eb9353b11f7bc7da48?format=webp&width=600"
                  alt="Express Shipping"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="font-display text-xl tracking-tight mb-3">Complimentary Shipping</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1">
                Enjoy free worldwide delivery on all orders. We partner with premium couriers to ensure timely arrival.
              </p>
              <Link to="/shop" className="text-xs uppercase tracking-widest font-semibold text-accent hover:text-accent/80 transition-colors">
                Learn More →
              </Link>
            </div>

            {/* Service Card 3: Personalisation */}
            <div className="flex flex-col">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-secondary/30 border border-border/40 mb-6">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2Faaa7802432b14c2bb78ec506a8aab37b?format=webp&width=600"
                  alt="Personalisation"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="font-display text-xl tracking-tight mb-3">Personalisation</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1">
                Add a bespoke touch with custom monogramming and hand-embroidery, finished in our atelier.
              </p>
              <Link to="/shop" className="text-xs uppercase tracking-widest font-semibold text-accent hover:text-accent/80 transition-colors">
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="border-t border-border/40 bg-secondary/30 py-20 md:py-32">
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
