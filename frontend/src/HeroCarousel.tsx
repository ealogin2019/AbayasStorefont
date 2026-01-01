import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const heroes = [
  {
    id: 1,
    title: "Arab Abayas",
    subtitle: "Modern Luxury, Timeless Elegance",
    cta: "Explore Collection",
    ctaLink: "#featured",
    type: "video",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: 2,
    title: "New Season",
    subtitle: "Discover Our Latest Designs",
    cta: "Shop Now",
    ctaLink: "/shop",
    type: "image",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=1200",
  },
  {
    id: 3,
    title: "Exclusive Collection",
    subtitle: "Luxury Crafted for You",
    cta: "View Collection",
    ctaLink: "/shop",
    type: "image",
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
    <div className="relative overflow-hidden bg-black z-0">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {heroes.map((hero) => (
            <div
              key={hero.id}
              className="relative min-w-0 flex-[0_0_100%] overflow-hidden"
            >
              {hero.type === "video" ? (
                <video
                  src={hero.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <img
                  src={hero.image}
                  alt={hero.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              <div className="relative flex h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] flex-col items-center justify-center px-2 sm:px-4 py-8 sm:py-12 text-center">
                <div className="absolute inset-0 bg-black/25" />
                <div className="relative z-10 max-w-3xl px-2 sm:px-4 md:px-6 animate-fade-in-up">
                  <p className="tracking-[0.2em] text-xs md:text-sm text-white/95 mb-4 md:mb-6 animate-fade-in font-light uppercase" style={{ animationDelay: "200ms" }}>
                    {hero.subtitle}
                  </p>
                  <h1 className="font-serif font-light text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-tight text-white mb-6 md:mb-10 animate-fade-in" style={{ animationDelay: "400ms" }}>
                    {hero.title}
                  </h1>
                  <Link
                    to={hero.ctaLink}
                    className="inline-block text-xs tracking-[0.15em] font-light border border-white/70 bg-white/5 backdrop-blur-sm text-white px-8 md:px-12 py-4 hover:bg-white hover:text-black transition-all duration-500 animate-fade-in uppercase"
                    style={{ animationDelay: "600ms" }}
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
            className={cn(
              "h-1.5 transition-all duration-300 rounded-full",
              index === selectedIndex
                ? "w-8 bg-white"
                : "w-1.5 bg-white/40 hover:bg-white/60"
            )}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 left-4 right-4 md:left-8 md:right-8 -translate-y-1/2 z-20 pointer-events-none flex justify-between">
        <button
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className="pointer-events-auto h-12 w-12 flex items-center justify-center text-white/50 hover:text-white transition-all duration-300 disabled:opacity-30 hover:scale-110"
          aria-label="Previous slide"
        >
          <svg
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={scrollNext}
          disabled={!canScrollNext}
          className="pointer-events-auto h-12 w-12 flex items-center justify-center text-white/50 hover:text-white transition-all duration-300 disabled:opacity-30 hover:scale-110"
          aria-label="Next slide"
        >
          <svg
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
