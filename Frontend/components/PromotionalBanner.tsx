import { Link } from "react-router-dom";

interface PromotionalBannerProps {
  title: string;
  subtitle?: string;
  image?: string;
  video?: string;
  cta: string;
  ctaLink: string;
  alignment?: "left" | "right" | "center";
  variant?: "dark" | "light";
}

export default function PromotionalBanner({
  title,
  subtitle,
  image,
  video,
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
      className="block relative w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px] overflow-hidden group cursor-pointer"
    >
      {video ? (
        <video
          src={video}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-500" />

      {/* Content */}
      <div
        className={`relative h-full flex flex-col justify-center ${alignmentClass} px-3 sm:px-4 md:px-6 lg:px-12 text-center md:text-left`}
      >
        <div className="max-w-2xl animate-fade-in-up">
          {subtitle && (
            <p
              className={`text-xs sm:text-sm tracking-wide ${textColorClass}/90 mb-1 sm:mb-2 md:mb-3 animate-fade-in`}
              style={{ animationDelay: "200ms" }}
            >
              {subtitle}
            </p>
          )}
          <h2
            className={`font-serif font-light text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl ${textColorClass} mb-3 sm:mb-4 md:mb-6 animate-fade-in`}
            style={{ animationDelay: "400ms" }}
          >
            {title}
          </h2>
          <button
            className={`inline-block text-xs sm:text-sm tracking-wide font-light px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 border ${
              variant === "dark"
                ? "border-white text-white hover:bg-white hover:text-black"
                : "border-foreground text-foreground hover:bg-foreground hover:text-background"
            } transition-all duration-300 animate-fade-in`}
            style={{ animationDelay: "600ms" }}
          >
            {cta}
          </button>
        </div>
      </div>
    </Link>
  );
}
