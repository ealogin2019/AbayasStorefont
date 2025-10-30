export default function About() {
  return (
    <div className="container py-16">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h1 className="font-display text-3xl">About Sable Abaya</h1>
          <p className="mt-4 text-muted-foreground">
            Sable Abaya blends timeless modesty with contemporary tailoring. Our
            pieces are crafted for comfort and elegance — minimal lines, premium
            fabrics, and a neutral palette inspired by the sand and skyline of
            the region.
          </p>
          <p className="mt-4 text-muted-foreground">
            We focus on quality and versatility: abayas that transition from
            everyday wear to special occasions. Each design is thoughtfully
            detailed and ethically made.
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
            <strong>Quality fabrics</strong>
            <p className="text-sm text-muted-foreground">
              We source breathable, durable textiles suited for the Middle East
              climate.
            </p>
          </li>
          <li className="rounded-md border p-4">
            <strong>Timeless design</strong>
            <p className="text-sm text-muted-foreground">
              Clean silhouettes that remain elegant season after season.
            </p>
          </li>
          <li className="rounded-md border p-4">
            <strong>Sustainable practices</strong>
            <p className="text-sm text-muted-foreground">
              Thoughtful production and minimal waste.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );
}
