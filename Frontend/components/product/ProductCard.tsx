import { useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "@shared/api";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

export default function ProductCard({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes?.[0],
  );
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const { add } = useCart();

  const handleQuickAdd = () => {
    add(product, { size: selectedSize });
    toast.success("Added to bag");
    setShowSizeMenu(false);
  };

  // Mark as "New" if it's in the first 2 products (demo logic)
  const isNew =
    product.id === "sable-classic-black" || product.id === "noor-sand-kimono";

  // Check if the main image is a video
  const isVideo = (url: string) => url?.match(/\.(mp4|webm|mov)$/i);

  return (
    <div className="group relative">
      {/* Product Image/Video Container */}
      <Link
        to={`/product/${product.id}`}
        className="block relative aspect-[3/4] w-full overflow-hidden bg-white"
      >
        {isVideo(product.image) ? (
          <video
            src={product.image}
            className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            muted
            loop
            autoPlay
            playsInline
          />
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            loading="lazy"
          />
        )}

        {/* Simple "New" Badge */}
        {isNew && (
          <div className="absolute top-3 left-3 bg-black text-white px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] font-light">
            New
          </div>
        )}

        {/* Quick Shop - Simplified */}
        <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              if (product.sizes && product.sizes.length > 0) {
                setShowSizeMenu(true);
              } else {
                handleQuickAdd();
              }
            }}
            className="w-full bg-black text-white py-3 text-xs tracking-[0.15em] uppercase font-light hover:bg-black/90 transition-colors"
          >
            Quick Add
          </button>
        </div>

        {/* Wishlist Icon - Minimal */}
        <button className="absolute top-3 right-3 h-9 w-9 flex items-center justify-center bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hover:bg-white">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>
      </Link>

      {/* Product Info - Minimal */}
      <div className="mt-4">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-sm font-light text-black mb-1 hover:text-black/70 transition-colors">{product.name}</h3>
          <p className="text-sm font-light text-black/70">{product.price} {product.currency}</p>
        </Link>

        {/* Available colors indicator */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-1 mt-2">
            {product.colors.slice(0, 4).map((color: string, index: number) => (
              <div key={index} className="h-2 w-2 rounded-full border border-black/10" style={{ backgroundColor: color.toLowerCase() }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
