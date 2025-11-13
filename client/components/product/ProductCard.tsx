import { Link } from "react-router-dom";
import { Product } from "@shared/api";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group block overflow-hidden transition"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary/50 border border-border/40">
        <img
          src={product.image}
          alt={product.name}
          className="size-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
      </div>
      <div className="pt-5 pb-3">
        <h3 className="font-display text-sm leading-snug tracking-tight mb-2 line-clamp-2 group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
          {product.description}
        </p>
        <div className="flex items-end justify-between">
          <span className="text-sm font-semibold tracking-tight">
            {product.currency} {product.price.toFixed(2)}
          </span>
          <button className="h-8 w-8 flex items-center justify-center rounded-sm border border-border/60 bg-background hover:bg-foreground hover:text-background transition-colors opacity-0 group-hover:opacity-100">
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
    </Link>
  );
}
