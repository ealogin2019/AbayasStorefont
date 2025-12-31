import { useState, useEffect } from "react";

const announcements = [
  "Free worldwide shipping on all orders",
  "New arrivals now available",
  "Complimentary gift wrapping",
];

export default function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % announcements.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isVisible]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-[60] bg-black text-white border-b border-white/10 transition-all duration-500 overflow-hidden ${
      isScrolled ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
    }`}>
      <div className="container h-9 flex items-center justify-between px-4 md:px-6 lg:px-12 relative">
        <div className="flex-1 overflow-hidden relative">
          <p 
            key={current}
            className="text-[10px] tracking-[0.15em] font-light text-center animate-slide-in-fade line-clamp-1 uppercase"
          >
            {announcements[current]}
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 text-white/40 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110 flex-shrink-0 h-6 w-6 flex items-center justify-center"
          aria-label="Close announcement"
        >
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
