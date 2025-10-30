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
        This page is a placeholder. Keep building by asking for what you want
        here next.
      </p>
      <Link
        to="/"
        className="rounded-md bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:bg-primary/90"
      >
        Back to home
      </Link>
    </section>
  );
}
