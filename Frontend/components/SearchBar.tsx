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
        className="hover:scale-110 transition-all duration-500 inline-flex items-center gap-1.5"
        aria-label="Search"
        title="Search"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.305 5.305a7.5 7.5 0 0010.5 10.5z"
          />
        </svg>
      </button>

      {/* Search Panel */}
      {isOpen && (
        <>
          {/* Elegant Backdrop with Gradient */}
          <div 
            className="fixed inset-0 z-[70] bg-gradient-to-b from-black/40 via-black/30 to-black/20 backdrop-blur-md animate-fadeIn"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Refined Search Drawer */}
          <div className="fixed inset-x-0 top-0 z-[80] animate-slideInFade">
            {/* Luxurious Background with Subtle Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-stone-50/95 to-white/90 backdrop-blur-xl" />
            
            {/* Subtle Top Border Accent */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-stone-300/50 to-transparent" />
            
            {/* Content Container */}
            <div className="relative max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-12 py-6 sm:py-8 md:py-12">
              <div className="flex items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                {/* Search Icon Prefix */}
                <div className="hidden md:flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 text-stone-400 animate-fadeInUp flex-shrink-0" style={{ animationDelay: '100ms' }}>
                  <svg
                    className="h-5 sm:h-6 w-5 sm:w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.2}
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.305 5.305a7.5 7.5 0 0010.5 10.5z"
                    />
                  </svg>
                </div>

                {/* Search Form */}
                <form
                  onSubmit={handleSearch}
                  className="flex-1 max-w-3xl animate-fadeInUp"
                  style={{ animationDelay: '200ms' }}
                >
                  <div className="relative group">
                    {/* Elegant Input Field */}
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search abayas..."
                      className="w-full text-base sm:text-lg md:text-xl font-light tracking-wide border-b border-stone-200 bg-transparent pb-2 sm:pb-3 md:pb-4 focus:outline-none focus:border-black transition-all duration-700 placeholder:text-stone-400 placeholder:tracking-wider text-black text-sm sm:text-base"
                      autoFocus
                      style={{ fontFamily: 'Georgia, serif' }}
                    />
                    
                    {/* Animated Underline */}
                    <div className="absolute bottom-0 left-0 w-0 h-px bg-black transition-all duration-700 group-focus-within:w-full" />
                    
                    {/* Submit Button with Refined Hover */}
                    <button
                      type="submit"
                      className="absolute right-0 bottom-2 sm:bottom-3 md:bottom-4 text-stone-600 hover:text-black hover:scale-110 transition-all duration-500 group"
                      aria-label="Submit search"
                    >
                      <svg
                        className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.2}
                          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.305 5.305a7.5 7.5 0 0010.5 10.5z"
                        />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Elegant Helper Text */}
                  <p className="mt-2 sm:mt-3 text-xs tracking-widest text-stone-400 uppercase opacity-0 group-focus-within:opacity-100 transition-opacity duration-700">
                    Press Enter to Search
                  </p>
                </form>
                
                {/* Sophisticated Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-7 sm:w-8 md:w-10 h-7 sm:h-8 md:h-10 text-stone-500 hover:text-black hover:rotate-90 transition-all duration-700 animate-fadeInUp flex-shrink-0"
                  style={{ animationDelay: '300ms' }}
                  aria-label="Close search"
                >
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              
              {/* Refined Bottom Border */}
              <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-stone-200/60 to-transparent shadow-sm" />
            </div>
          </div>
        </>
      )}
    </>
  );
}
