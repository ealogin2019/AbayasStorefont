export default function About() {
  return (
    <div className="pt-20 sm:pt-24 md:pt-28">
      <div className="container px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16">
      <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl">About Arab Abayas</h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground">
            Arab Abayas reimagines tradition with a modern sensibility. Our abayas are designed for women who value elegance, comfort, and timeless style. Each piece is a celebration of heritage, crafted with meticulous attention to detail and luxurious fabrics.
          </p>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground">
            Inspired by the beauty of the Middle East, we blend classic silhouettes with contemporary touches. Our mission is to offer versatile abayas that transition seamlessly from day to night, always with a touch of sophistication.
          </p>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground">
            Every abaya is handpicked from renowned designers across the Arab world, ensuring authenticity and superior quality. We work directly with artisans who have perfected their craft over generations.
          </p>
        </div>
        <div className="rounded-xl border overflow-hidden bg-card">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F81ce6da7ab2f4a539be7643f189385d0?format=webp&width=1200"
            alt="Arab Abayas story"
            className="w-full object-cover"
          />
        </div>
      </div>

      <section className="mt-8 sm:mt-10 md:mt-12">
        <h2 className="font-display text-xl sm:text-2xl">Our Values</h2>
        <ul className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <li className="rounded-md border p-3 sm:p-4">
            <strong className="text-sm sm:text-base">Luxury Materials</strong>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">
              Only the finest, breathable fabrics—chosen for comfort and lasting beauty.
            </p>
          </li>
          <li className="rounded-md border p-3 sm:p-4">
            <strong className="text-sm sm:text-base">Timeless Craft</strong>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">
              Classic silhouettes, modern details. Designed to be cherished for years.
            </p>
          </li>
          <li className="rounded-md border p-3 sm:p-4">
            <strong className="text-sm sm:text-base">Ethical Creation</strong>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">
              Responsible production, fair labor, and a commitment to sustainability.
            </p>
          </li>
        </ul>
      </section>

      <section className="mt-8 sm:mt-10 md:mt-12 border-t pt-8 sm:pt-10 md:pt-12">
        <h2 className="font-display text-xl sm:text-2xl mb-4 sm:mb-6">Our Collections</h2>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div className="border rounded-lg p-4 sm:p-6">
            <h3 className="font-display text-base sm:text-lg mb-2">Signature Collection</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Our classic designs that embody timeless elegance. Perfect for everyday wear and special occasions.
            </p>
          </div>
          <div className="border rounded-lg p-4 sm:p-6">
            <h3 className="font-display text-base sm:text-lg mb-2">Premium Collection</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Luxurious fabrics and intricate details for those who appreciate the finest craftsmanship.
            </p>
          </div>
          <div className="border rounded-lg p-4 sm:p-6">
            <h3 className="font-display text-base sm:text-lg mb-2">Seasonal Collection</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Limited edition designs that reflect current trends while maintaining our classic aesthetic.
            </p>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
