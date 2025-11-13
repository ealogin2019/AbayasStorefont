export default function About() {
  return (
    <div className="container py-16">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h1 className="font-display text-3xl md:text-4xl">About Arab Abayas</h1>
          <p className="mt-4 text-muted-foreground">
            Arab Abayas reimagines tradition with a modern sensibility. Our abayas are designed for women who value elegance, comfort, and timeless style. Each piece is a celebration of heritage, crafted with meticulous attention to detail and luxurious fabrics.
          </p>
          <p className="mt-4 text-muted-foreground">
            Inspired by the beauty of the Middle East, we blend classic silhouettes with contemporary touches. Our mission is to offer versatile abayas that transition seamlessly from day to night, always with a touch of sophistication.
          </p>
        </div>
        <div className="rounded-xl border overflow-hidden bg-card">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fdd122c117889471494f780391c37609a%2F81ce6da7ab2f4a539be7643f189385d0?format=webp&width=1200"
            alt="Sable Abaya story"
            className="w-full object-cover"
          />
        </div>
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl">Our Values</h2>
        <ul className="mt-4 grid gap-4 md:grid-cols-3">
          <li className="rounded-md border p-4">
            <strong>Luxury Materials</strong>
            <p className="text-sm text-muted-foreground">
              Only the finest, breathable fabrics—chosen for comfort and lasting beauty.
            </p>
          </li>
          <li className="rounded-md border p-4">
            <strong>Timeless Craft</strong>
            <p className="text-sm text-muted-foreground">
              Classic silhouettes, modern details. Designed to be cherished for years.
            </p>
          </li>
          <li className="rounded-md border p-4">
            <strong>Ethical Creation</strong>
            <p className="text-sm text-muted-foreground">
              Responsible production, fair labor, and a commitment to sustainability.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );
}
