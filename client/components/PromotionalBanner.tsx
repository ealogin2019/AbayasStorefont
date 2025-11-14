import { Link } from "react-router-dom";

interface PromotionalBannerProps {
  title: string;
  subtitle?: string;
  image: string;
  cta: string;
  ctaLink: string;
  alignment?: "left" | "right" | "center";
  variant?: "dark" | "light";
}

export default function PromotionalBanner({
  title,
  subtitle,
  image,
  cta,
  ctaLink,
  alignment = "center",
  variant = "dark",
}: PromotionalBannerProps) {
  const alignmentClass = {
    left: "items-start",
    right: "items-end",
    center: "items-center",
  }[alignment];

  const textColorClass = variant === "dark" ? "text-white" : "text-foreground";

  return (
    <Link
      to={ctaLink}
      className="block relative w-full h-64 md:h-96 lg:h-[500px] overflow-hidden group cursor-pointer"
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

      {/* Content */}
      <div className={`relative h-full flex flex-col justify-center ${alignmentClass} px-4 md:px-6 lg:px-12 text-center md:text-left`}>
        <div className="max-w-2xl">
          {subtitle && (
            <p className={`text-xs uppercase tracking-widest ${textColorClass}/80 mb-2 md:mb-3`}>
              {subtitle}
            </p>
          )}
          <h2 className={`font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tight ${textColorClass} mb-4 md:mb-6`}>
            {title}
          </h2>
          <button className={`inline-block uppercase tracking-widest text-sm font-semibold px-8 py-4 border-2 ${
            variant === "dark"
              ? "border-white text-white hover:bg-white hover:text-black"
              : "border-foreground text-foreground hover:bg-foreground hover:text-background"
          } transition-colors`}>
            {cta}
          </button>
        </div>
      </div>
    </Link>
  );
}
