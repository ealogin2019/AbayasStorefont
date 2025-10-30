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
              Minimal abayas for everyday elegance
            </h1>
            <p className="mt-4 max-w-prose text-muted-foreground">
              Discover refined silhouettes in rich neutrals and luxe textures.
              Designed to be worn, loved, and lived in.
            </p>
            <div className="mt-8 flex gap-3">
              <a
                href="#featured"
                className="rounded-md bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
              >
                Explore featured
              </a>
              <a
                href="#bestsellers"
                className="rounded-md border px-6 py-3 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                Best sellers
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
              Featured
            </h2>
            <p className="text-sm text-muted-foreground">Hand-picked styles</p>
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
                Best sellers
              </h2>
              <p className="text-sm text-muted-foreground">
                Loved by our customers
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
    </>
  );
}
