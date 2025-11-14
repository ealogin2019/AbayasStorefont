import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "react-router-dom";

const heroes = [
  {
    id: 1,
    title: "Arab Abayas",
    subtitle: "Modern Luxury, Timeless Elegance",
    cta: "Explore Collection",
    ctaLink: "#featured",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=1200",
  },
  {
    id: 2,
    title: "New Season",
    subtitle: "Discover Our Latest Designs",
    cta: "Shop Now",
    ctaLink: "/shop",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=1200",
  },
  {
    id: 3,
    title: "Exclusive Collection",
    subtitle: "Luxury Crafted for You",
    cta: "View Collection",
    ctaLink: "/shop",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=1200",
  },
];

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
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

  return (
    <div className="relative overflow-hidden bg-background">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {heroes.map((hero) => (
            <div
              key={hero.id}
              className="relative min-w-0 flex-[0_0_100%] overflow-hidden"
            >
              <img
                src={hero.image}
                alt={hero.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="relative flex h-[350px] flex-col items-center justify-center px-4 py-12 text-center sm:h-[450px] md:h-[600px] lg:h-[700px]">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 max-w-2xl px-2">
                  <p className="uppercase tracking-widest text-xs sm:text-sm text-white/80 mb-2 sm:mb-4">
                    {hero.subtitle}
                  </p>
                  <h1 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-7xl leading-tight tracking-tight text-white mb-4 sm:mb-8">
                    {hero.title}
                  </h1>
                  <Link
                    to={hero.ctaLink}
                    className="inline-block uppercase tracking-widest text-xs sm:text-sm font-semibold bg-white text-foreground px-4 sm:px-8 py-2 sm:py-4 hover:bg-white/90 transition-colors"
                  >
                    {hero.cta}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {heroes.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-2 transition-all rounded-full ${
              index === selectedIndex
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 z-20 pointer-events-none flex justify-between">
        <button
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className="pointer-events-auto h-10 w-10 flex items-center justify-center text-white/60 hover:text-white transition-colors disabled:opacity-50"
          aria-label="Previous slide"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={scrollNext}
          disabled={!canScrollNext}
          className="pointer-events-auto h-10 w-10 flex items-center justify-center text-white/60 hover:text-white transition-colors disabled:opacity-50"
          aria-label="Next slide"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
