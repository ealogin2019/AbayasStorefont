import { useState, useEffect } from "react";

const announcements = [
  "Complimentary shipping on all orders worldwide",
  "Signature gift wrap included with every purchase",
  "Shop our new collection - Modern luxury abayas",
];

export default function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % announcements.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="bg-secondary/50 border-b border-border/40">
      <div className="container h-auto md:h-10 flex items-center justify-between px-4 md:px-6 py-2 md:py-0">
        <p className="text-[10px] md:text-xs uppercase tracking-widest text-foreground/80 flex-1 text-center">
          {announcements[current]}
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close announcement"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
