import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?q=${encodeURIComponent(query)}`);
      setQuery("");
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Search Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
        aria-label="Search"
        title="Search"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.305 5.305a7.5 7.5 0 0010.5 10.5z"
          />
        </svg>
      </button>

      {/* Search Panel */}
      {isOpen && (
        <div className="fixed inset-0 top-10 z-50 bg-background border-b border-border/40 p-4 md:p-6 block">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search abayas, collections, colors..."
                className="w-full text-lg border-b border-foreground/30 bg-background pb-3 focus:outline-none focus:border-foreground transition-colors"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-0 bottom-3 text-foreground hover:opacity-70 transition-opacity"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.305 5.305a7.5 7.5 0 0010.5 10.5z"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
