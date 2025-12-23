import { Link } from "react-router-dom";

interface PromoBannerItem {
  title: string;
  image: string;
  cta: string;
  ctaLink: string;
}

interface DoublePromoBannerProps {
  items: [PromoBannerItem, PromoBannerItem];
}

export default function DoublePromoBanner({ items }: DoublePromoBannerProps) {
  return (
    <div className="grid gap-3 sm:gap-4 md:gap-6 lg:gap-8 grid-cols-1 md:grid-cols-2">
      {items.map((item, idx) => (
        <Link
          key={idx}
          to={item.ctaLink}
          className="relative h-48 sm:h-56 md:h-72 lg:h-96 overflow-hidden group cursor-pointer"
        >
          <img
            src={item.image}
            alt={item.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors" />

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center text-center px-3 sm:px-4 md:px-6">
            <h3 className="font-display text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl tracking-tight text-white mb-3 sm:mb-4 md:mb-6">
              {item.title}
            </h3>
            <button className="uppercase tracking-widest text-xs sm:text-sm font-semibold px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 border-2 border-white text-white hover:bg-white hover:text-black transition-colors">
              {item.cta}
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
}
