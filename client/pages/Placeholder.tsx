import { Link } from "react-router-dom";

export default function Placeholder({
  title = "Coming soon",
}: {
  title?: string;
}) {
  return (
    <section className="container flex min-h-[50vh] flex-col items-center justify-center gap-4 py-12 text-center">
      <h1 className="font-display text-3xl tracking-tight md:text-4xl">
        {title}
      </h1>
      <p className="max-w-xl text-muted-foreground">
        This page is coming soon. Discover our latest abayas or return to the homepage for more inspiration.
      </p>
      <Link
        to="/"
        className="rounded-md bg-primary px-5 py-2.5 text-sm text-primary-foreground shadow-lg hover:bg-primary/90"
      >
        Back to Arab Abayas Home
      </Link>
    </section>
  );
}
