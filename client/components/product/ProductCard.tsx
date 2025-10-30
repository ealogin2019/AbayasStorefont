import { Link } from "react-router-dom";
import { Product } from "@shared/api";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group block overflow-hidden rounded-xl border bg-card shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="size-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium tracking-tight">{product.name}</h3>
          <span className="font-semibold">
            {product.currency} {product.price.toFixed(2)}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>
      </div>
    </Link>
  );
}
