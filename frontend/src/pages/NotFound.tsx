import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-secondary/30">
      <div className="text-center p-6">
        <h1 className="text-5xl font-semibold mb-2 tracking-tight">404</h1>
        <p className="text-base text-muted-foreground mb-6">We couldn't find that page.<br/>
        Discover our latest abayas or return to the homepage.</p>
        <Link
          to="/"
          className="inline-flex items-center justify-center h-11 px-6 rounded-md bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
        >
          Back to Arab Abayas Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
