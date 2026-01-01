import { useParams, Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Product as ProductType } from "@shared/api";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const { add } = useCart();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => api.getProduct(id as string),
    enabled: !!id,
  });

  const product: ProductType | undefined = data?.product;
  const [mainImage, setMainImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

  // Update states when product loads
  useEffect(() => {
    if (product?.image) {
      setMainImage(product.image);
    }
    // Default selection from variants if available
    if (product?.variants && product.variants.length > 0) {
      const first = product.variants[0];
      setSelectedSize(first.size);
      setSelectedColor(first.color);
    } else if (product?.sizes?.[0]) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  if (isLoading) return <div className="container py-16">Loading…</div>;
  if (isError || !product)
    return (
      <div className="container py-16">
        <p className="mb-4">Product not found.</p>
        <Link to="/" className="underline">
          Back to home
        </Link>
      </div>
    );

  const isVideo = (url: string) => url?.match(/\.(mp4|webm|mov)$/i);

  return (
    <div className="pt-20 sm:pt-24 md:pt-28">
      {/* ---------------------------------------------------- */}
      {/* 2. DYNAMIC SEO TAGS                                  */}
      {/* ---------------------------------------------------- */}
      {product && (
        <Helmet>
          <title>{product.name} | Abaya Store</title>
          <meta name="description" content={product.description?.substring(0, 160)} />
          <meta property="og:title" content={product.name} />
          <meta property="og:description" content={product.description?.substring(0, 160)} />
          <meta property="og:image" content={(product.gallery && product.gallery[0]) || product.thumbnail || product.image} />
          <meta property="og:type" content="product" />
        </Helmet>
      )}
    <div className="container px-3 sm:px-4 md:px-6 grid gap-6 sm:gap-8 md:gap-10 py-6 sm:py-8 md:py-12 grid-cols-1 md:grid-cols-2">
      <div>
        <div className="overflow-hidden rounded-xl border bg-card">
          {isVideo(mainImage) ? (
            <video
              src={mainImage}
              className="w-full object-cover max-h-[600px]"
              controls
              autoPlay
              muted
              loop
            />
          ) : (
            <img
              src={mainImage}
              alt={product.name}
              className="w-full object-cover max-h-[600px]"
            />
          )}
        </div>
        <div className="mt-3 sm:mt-4 flex gap-2 sm:gap-3 overflow-x-auto">
          {(product.gallery ?? [product.thumbnail]).map((g, idx) => (
            <button
              key={`${g}-${idx}`}
              onClick={() => setMainImage(g)}
              className="overflow-hidden rounded-md border bg-background p-0.5 flex-shrink-0 h-12 sm:h-16 w-12 sm:w-16"
            >
              {isVideo(g) ? (
                <video
                  src={g}
                  className="h-16 w-16 object-cover"
                  muted
                />
              ) : (
                <img
                  src={g}
                  alt={product.name}
                  className="h-16 w-16 object-cover"
                />
              )}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h1 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tight">
          {product.name}
        </h1>
        <div className="mt-3 text-lg sm:text-xl font-semibold">
          {product.currency} {(product.variants && selectedSize && selectedColor && product.variants.find(v=>v.size===selectedSize && v.color===selectedColor)?.price)
            ? (product.variants.find(v=>v.size===selectedSize && v.color===selectedColor)!.price).toFixed(2)
            : product.price.toFixed(2)}
        </div>
        <p className="mt-4 text-xs sm:text-sm text-muted-foreground">
          {product.description}
        </p>
        <div className="mt-2 text-xs text-muted-foreground italic">
          Crafted for elegance. Free shipping & signature gift wrap on all orders.
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {(product.variants ? Array.from(new Set(product.variants.map(v => v.size))) : product.sizes || []).map((s) => (
            <button
              key={s}
              onClick={() => {
                setSelectedSize(s);
                // reset color when size changes
                const options = product.variants?.filter(v => v.size === s);
                if (options && options.length > 0) setSelectedColor(options[0].color);
              }}
              className={cn(
                "inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-xs sm:text-sm",
                selectedSize === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-background",
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {(product.variants ? Array.from(new Set((product.variants || []).filter(v => v.size === selectedSize).map(v => v.color))) : product.colors || []).map((c) => (
            <button
              key={c}
              onClick={() => setSelectedColor(c)}
              className={cn(
                "inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-xs sm:text-sm",
                selectedColor === c
                  ? "bg-primary text-primary-foreground"
                  : "bg-background",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            className="h-10 sm:h-11 rounded-md bg-primary px-6 text-xs sm:text-sm text-primary-foreground shadow-lg hover:bg-primary/90 flex-1 sm:flex-none"
            onClick={() => {
              const variant = product.variants ? product.variants.find(v => v.size === selectedSize && v.color === selectedColor) : undefined;
              add(product, { variantId: variant?.id, size: selectedSize, color: selectedColor });
              toast.success("Added to cart");
            }}
            disabled={Boolean(product.variants && !(selectedSize && selectedColor))}
          >
            Add to Bag
          </button>
          <Link
            to="/shop"
            className="h-10 sm:h-11 rounded-md border px-6 text-xs sm:text-sm hover:bg-accent hover:text-accent-foreground flex items-center justify-center flex-1 sm:flex-none"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
}
