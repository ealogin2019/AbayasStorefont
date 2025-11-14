import { useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "@shared/api";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

export default function ProductCard({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product.sizes?.[0]);
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const { add } = useCart();

  const handleQuickAdd = () => {
    add(product, { size: selectedSize });
    toast.success("Added to bag");
    setShowSizeMenu(false);
  };

  // Mark as "New" if it's in the first 2 products (demo logic)
  const isNew = product.id === "sable-classic-black" || product.id === "noor-sand-kimono";

  return (
    <div className="group relative overflow-hidden">
      {/* Product Image Container */}
      <Link
        to={`/product/${product.id}`}
        className="block relative aspect-[3/4] w-full overflow-hidden bg-secondary/50 border border-border/40"
      >
        <img
          src={product.image}
          alt={product.name}
          className="size-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* "New" Badge */}
        {isNew && (
          <div className="absolute top-4 left-4 bg-foreground text-background px-3 py-1 text-xs uppercase tracking-widest font-semibold">
            New
          </div>
        )}

        {/* Overlay with Size Options */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-background/95 backdrop-blur p-6 rounded-sm text-center transform scale-95 group-hover:scale-100 transition-transform">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Select Size</p>
            <div className="flex gap-2 mb-4 flex-wrap justify-center">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSize(size);
                  }}
                  className={`h-10 w-10 rounded-sm border transition-all ${
                    selectedSize === size
                      ? "bg-foreground text-background border-foreground"
                      : "border-border/60 text-foreground hover:border-foreground"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleQuickAdd();
              }}
              className="w-full bg-foreground text-background px-4 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-foreground/90 transition-colors"
            >
              Add to Bag
            </button>
          </div>
        </div>

        {/* Wishlist Icon */}
        <button className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center bg-background/80 backdrop-blur border border-border/40 hover:bg-background transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 8.25c0-1.085-.667-2.025-1.587-2.431a2.25 2.25 0 00-2.331-.873c-.464.15-.909.576-1.348.576-.46 0-.891-.423-1.348-.576a2.25 2.25 0 00-2.331.873c-.92.406-1.587 1.346-1.587 2.431M9 12c0-1.657.895-3.095 2.225-3.863m5.55 0c1.33.768 2.225 2.206 2.225 3.863m-12 0a8.25 8.25 0 1116.5 0m-1.5 0c0 .937-.118 1.846-.338 2.729M15 12a3 3 0 11-6 0m6 0a3 3 0 1-6 0m6 0h.008v.008h-.008V12z"
            />
          </svg>
        </button>
      </Link>

      {/* Product Info */}
      <Link to={`/product/${product.id}`} className="block pt-3 pb-2">
        <h3 className="font-display text-xs sm:text-sm leading-snug tracking-tight mb-1 sm:mb-2 line-clamp-2 group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2 sm:mb-4 hidden sm:block">
          {product.description}
        </p>
      </Link>

      {/* Price and Quick Add Footer */}
      <div className="flex items-end justify-between gap-2">
        <span className="text-xs sm:text-sm font-semibold tracking-tight uppercase">
          {product.currency} {product.price.toFixed(2)}
        </span>
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowSizeMenu(!showSizeMenu);
          }}
          className="h-8 w-8 flex items-center justify-center rounded-sm border border-border/60 bg-background hover:bg-foreground hover:text-background transition-colors opacity-0 group-hover:opacity-100 transform transition-all"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
