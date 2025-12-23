import { Link } from "react-router-dom";

export default function Index() {
  return (
    <main className="bg-white text-black min-h-screen">
      {/* Hero Section - Full Width Image */}
      <section className="relative w-full h-screen">
        <img 
          src="https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=1920" 
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-end justify-center pb-20">
          <div className="text-center">
            <h1 className="text-white text-sm tracking-[0.2em] uppercase font-light mb-4">
              DISCOVER THE RED CAPSULE
            </h1>
            <div className="h-px w-32 bg-white mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Product Gallery - 4 Images Grid */}
      <section className="w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
          {[1, 2, 3, 4].map((i) => (
            <Link key={i} to="/shop" className="relative aspect-[3/4] overflow-hidden group">
              <img 
                src={`https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F9382199df584402087537bef94280808?format=webp&width=600`}
                alt={`Product ${i}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Split Banner - Two Side by Side Images */}
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
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
