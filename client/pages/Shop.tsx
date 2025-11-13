import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/product/ProductCard";
import { api } from "@/lib/api";

export default function Shop() {
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: api.listProducts,
  });
  const products = data?.products ?? [];
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.tags.join(" ").toLowerCase().includes(term),
    );
  }, [q, products]);

  return (
    <div className="container py-12">
      <div className="mb-6 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl md:text-4xl tracking-tight">Arab Abayas Collection</h1>
          <p className="text-sm text-muted-foreground max-w-md">
            Explore our curated range of modern abayas, crafted for elegance and comfort. Enjoy complimentary shipping and signature gift wrap on every order.
          </p>
        </div>
        <div className="w-full max-w-sm">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search abayas, colors, or details..."
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none"
          />
        </div>
      </div>

      <div>
        {isLoading ? (
          <div>Loading…</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
