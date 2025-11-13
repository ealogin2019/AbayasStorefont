import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/product/ProductCard";
import { api } from "@/lib/api";

export default function Index() {
  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: api.listProducts,
  });
  const products = data?.products ?? [];

  return (
    <>
      <section className="relative overflow-hidden border-b bg-secondary/50">
        <div className="container grid gap-10 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center">
            <h1 className="font-display text-4xl leading-tight tracking-tight md:text-6xl">
              Arab Abayas: Modern Luxury, Timeless Elegance
            </h1>
            <p className="mt-4 max-w-prose text-muted-foreground">
              Discover our curated collection of elegant abayas, crafted for sophistication and comfort. Inspired by tradition, designed for today.
            </p>
            <div className="mt-8 flex gap-3">
              <a
                href="#featured"
                className="rounded-md bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
              >
                Explore Collection
              </a>
              <a
                href="#bestsellers"
                className="rounded-md border px-6 py-3 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                Shop Best Sellers
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border bg-card shadow-sm">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=1200"
                alt="Abaya hero"
                className="size-full object-cover"
              />
            </div>
            <div className="pointer-events-none absolute -left-6 -top-6 hidden h-24 w-24 rounded-full bg-accent/20 blur-2xl md:block" />
          </div>
        </div>
      </section>

      <section id="featured" className="container py-14 md:py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl tracking-tight md:text-3xl">
              Featured Collection
            </h2>
            <p className="text-sm text-muted-foreground">Editor’s picks for the season</p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section id="bestsellers" className="border-t bg-secondary/30">
        <div className="container py-14 md:py-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl tracking-tight md:text-3xl">
                Best Sellers
              </h2>
              <p className="text-sm text-muted-foreground">
                Our most-loved abayas, chosen by you
              </p>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(products.length ? products : []).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Editorial/Service Section */}
      <section className="border-t bg-background/60">
        <div className="container py-14 md:py-20 grid gap-10 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <svg className="mb-4 h-10 w-10 text-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5V6a2.25 2.25 0 0 0-2.25-2.25h-13.5A2.25 2.25 0 0 0 3 6v1.5m18 0v9A2.25 2.25 0 0 1 18.75 19.5h-13.5A2.25 2.25 0 0 1 3 16.5v-9m18 0H3m18 0-9 7.5L3 7.5" /></svg>
            <h3 className="font-display text-lg mb-2">Signature Gift Wrap</h3>
            <p className="text-sm text-muted-foreground">Every order arrives in our signature box, perfect for gifting.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <svg className="mb-4 h-10 w-10 text-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0h6" /></svg>
            <h3 className="font-display text-lg mb-2">Complimentary Shipping</h3>
            <p className="text-sm text-muted-foreground">Enjoy free worldwide delivery on all abayas, no minimum spend.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <svg className="mb-4 h-10 w-10 text-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            <h3 className="font-display text-lg mb-2">Personalisation</h3>
            <p className="text-sm text-muted-foreground">Add a bespoke touch with custom monogramming, hand-finished in our atelier.</p>
          </div>
        </div>
      </section>
    </>
  );
}
