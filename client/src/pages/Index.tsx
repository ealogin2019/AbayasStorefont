import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import ProductCard from "@/product/ProductCard";
import { Product } from "@shared/api";

interface HomepageContent {
  id: string;
  section: "hero" | "gallery" | "banner";
  title?: string;
  subtitle?: string;
  image: string;
  link?: string;
  order: number;
  isActive: boolean;
}

export default function Index() {
  // Fetch homepage content
  const { data: homepageData } = useQuery({
    queryKey: ["homepage"],
    queryFn: async () => {
      const response = await fetch("/api/homepage");
      if (!response.ok) throw new Error("Failed to fetch homepage content");
      return response.json();
    },
  });

  // Fetch featured products for add-to-cart functionality
  const { data: productsData } = useQuery({
    queryKey: ["products", { limit: 4 }],
    queryFn: async () => {
      const response = await fetch("/api/products?limit=4");
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  const homepageContent = homepageData?.data || {};
  const products = productsData?.products || [];

  // Get content by section
  const heroContent = homepageContent.hero?.[0];
  const galleryContent = homepageContent.gallery || [];
  const bannerContent = homepageContent.banner || [];

  return (
    <main className="bg-white text-black min-h-screen">
      {/* Hero Section - Full Width Image */}
      <section className="relative w-full h-screen">
        <img
          src={heroContent?.image || "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=1920"}
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-end justify-center pb-20">
          <div className="text-center">
            <h1 className="text-white text-sm tracking-[0.2em] uppercase font-light mb-4">
              {heroContent?.title || "DISCOVER THE RED CAPSULE"}
            </h1>
            <div className="h-px w-32 bg-white mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Product Gallery - 4 Images Grid with Add to Cart */}
      <section className="w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
          {products.slice(0, 4).map((product: Product) => (
            <div key={product.id} className="relative group">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Split Banner - Two Side by Side Images */}
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {bannerContent.slice(0, 2).map((content: HomepageContent, index: number) => (
            <Link key={content.id || index} to={content.link || "/shop"} className="relative aspect-[4/3] md:aspect-[16/10] overflow-hidden group">
              <img
                src={content.image}
                alt={content.title || "Banner"}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-white text-sm tracking-[0.2em] uppercase font-light mb-3">
                    {content.title || (index === 0 ? "DISCOVER NOW" : "WINTER 25 COLLECTION")}
                  </h2>
                  <div className="h-px w-24 bg-white mx-auto"></div>
                </div>
              </div>
            </Link>
          ))}
          {/* Fallback banners if no content */}
          {bannerContent.length === 0 && (
            <>
              <Link to="/shop" className="relative aspect-[4/3] md:aspect-[16/10] overflow-hidden group">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=1000"
                  alt="Discover Now"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-white text-sm tracking-[0.2em] uppercase font-light mb-3">
                      DISCOVER NOW
                    </h2>
                    <div className="h-px w-24 bg-white mx-auto"></div>
                  </div>
                </div>
              </Link>
              <Link to="/shop" className="relative aspect-[4/3] md:aspect-[16/10] overflow-hidden group">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=1000"
                  alt="Winter 25 Collection"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-white text-sm tracking-[0.2em] uppercase font-light mb-3">
                      WINTER 25 COLLECTION
                    </h2>
                    <div className="h-px w-24 bg-white mx-auto"></div>
                  </div>
                </div>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Category Grid - Three Categories */}
      <section className="w-full bg-[#F5F5F5] py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-6 md:px-12 max-w-7xl mx-auto">
          {[
            { title: "LONG JACKETS", image: "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=600" },
            { title: "DRESSES", image: "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=600" },
            { title: "TROUSERS", image: "https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=600" },
          ].map((category) => (
            <Link key={category.title} to="/shop" className="relative aspect-[3/4] overflow-hidden group">
              <img 
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-sm tracking-[0.2em] uppercase font-light">
                  {category.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* As Seen On Section */}
      <section className="w-full bg-white py-16 md:py-20">
        <div className="text-center max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-2xl md:text-3xl font-light mb-4">
            AS SEEN ON
          </h2>
          <p className="text-sm tracking-[0.15em] uppercase font-light text-black/60">
            TAG @ARABAYAHS TO BE FEATURED
          </p>
        </div>
      </section>

      {/* Instagram Feed Grid */}
      <section className="w-full pb-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative aspect-square overflow-hidden group cursor-pointer">
              <img 
                src={`https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=500`}
                alt={`Instagram ${i}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
