import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import ProductCard from "./product/ProductCard";
import type { Product } from "@shared/api";

interface ProductCarouselProps {
  title: string;
  description?: string;
  products: Product[];
  itemsPerView?: number;
}

export default function ProductCarousel({
  title,
  description,
  products,
  itemsPerView = 3,
}: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    skipSnaps: false,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!products.length) return null;

  return (
    <section className="py-12 md:py-16 lg:py-24">
      <div className="container px-4 md:px-6">
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl tracking-tight mb-1 md:mb-2">
              {title}
            </h2>
            {description && (
              <p className="text-muted-foreground text-xs md:text-sm">
                {description}
              </p>
            )}
          </div>
          {(canScrollPrev || canScrollNext) && (
            <div className="hidden md:flex gap-3">
              <button
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className="h-10 w-10 flex items-center justify-center border border-border/60 hover:bg-secondary/30 disabled:opacity-30 transition-colors"
                aria-label="Previous products"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={scrollNext}
                disabled={!canScrollNext}
                className="h-10 w-10 flex items-center justify-center border border-border/60 hover:bg-secondary/30 disabled:opacity-30 transition-colors"
                aria-label="Next products"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 md:gap-6 lg:gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-8px)] md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] xl:flex-[0_0_calc(25%-18px)]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile scroll indicator */}
        {products.length > 1 && (
          <div className="mt-6 md:hidden flex justify-center gap-1.5">
            {Array.from({ length: Math.ceil(products.length / 1) }).map(
              (_, i) => (
                <div
                  key={i}
                  className="h-1 w-1.5 rounded-full bg-muted-foreground/30"
                />
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}
