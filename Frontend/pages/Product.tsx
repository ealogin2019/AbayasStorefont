import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Product as ProductType } from "@shared/api";
import { toast } from "sonner";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => api.getProduct(id as string),
    enabled: !!id,
  });

  if (isLoading) return <div className="container py-16">Loading…</div>;
  if (isError || !data?.product)
    return (
      <div className="container py-16">
        <p className="mb-4">Product not found.</p>
        <Link to="/" className="underline">
          Back to home
        </Link>
      </div>
    );

  const product: ProductType = data.product;
  const [mainImage, setMainImage] = useState<string>(product.image);
  const { add } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes?.[0],
  );

  return (
    <div className="container grid gap-10 py-12 md:grid-cols-2">
      <div>
        <div className="overflow-hidden rounded-xl border bg-card">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full object-cover max-h-[600px]"
          />
        </div>
        <div className="mt-4 flex gap-3">
          {(product.gallery ?? [product.thumbnail]).map((g) => (
            <button
              key={g}
              onClick={() => setMainImage(g)}
              className="overflow-hidden rounded-md border bg-background p-0.5"
            >
              <img
                src={g}
                alt={product.name}
                className="h-16 w-16 object-cover"
              />
            </button>
          ))}
        </div>
      </div>
      <div>
        <h1 className="font-display text-3xl tracking-tight md:text-4xl">
          {product.name}
        </h1>
        <div className="mt-3 text-xl font-semibold">
          {product.currency} {product.price.toFixed(2)}
        </div>
        <p className="mt-4 text-muted-foreground">
          {product.description}
        </p>
        <div className="mt-2 text-xs text-muted-foreground italic">
          Crafted for elegance. Free shipping & signature gift wrap on all orders.
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSize(s)}
              className={cn(
                "inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm",
                selectedSize === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-background",
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="mt-8 flex gap-3">
          <button
            className="h-11 rounded-md bg-primary px-6 text-primary-foreground shadow-lg hover:bg-primary/90"
            onClick={() => {
              add(product, { size: selectedSize });
              toast.success("Added to cart");
            }}
          >
            Add to Bag
          </button>
          <Link
            to="/shop"
            className="h-11 rounded-md border px-6 text-sm hover:bg-accent hover:text-accent-foreground"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
