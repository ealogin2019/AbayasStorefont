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
    <div className="grid gap-6 md:gap-8 md:grid-cols-2">
      {items.map((item, idx) => (
        <Link
          key={idx}
          to={item.ctaLink}
          className="relative h-80 md:h-96 overflow-hidden group cursor-pointer"
        >
          <img
            src={item.image}
            alt={item.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors" />

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
            <h3 className="font-display text-3xl md:text-4xl tracking-tight text-white mb-6">
              {item.title}
            </h3>
            <button className="uppercase tracking-widest text-sm font-semibold px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-black transition-colors">
              {item.cta}
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
}
