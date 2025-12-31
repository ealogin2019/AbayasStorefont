import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border/40 p-4 md:p-6">
      <div className="container max-w-4xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-display text-lg tracking-tight mb-2">We Use Cookies</h3>
            <p className="text-sm text-muted-foreground max-w-2xl">
              We use cookies and similar technologies to provide the best experience on our website. By continuing, you consent to our use of cookies unless you've disabled them in your browser settings.
            </p>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs uppercase tracking-widest text-accent hover:text-accent/80 transition-colors mt-2"
            >
              {showDetails ? "Hide Details" : "Cookie Settings"}
            </button>

            {/* Details Section */}
            {showDetails && (
              <div className="mt-4 space-y-3 border-t border-border/40 pt-4">
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-semibold mb-1">Strictly Necessary</h4>
                  <p className="text-xs text-muted-foreground">
                    Required for the website to function properly. These cookies cannot be disabled.
                  </p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-semibold mb-1">Functional</h4>
                  <p className="text-xs text-muted-foreground">
                    Enable advanced functionality and personalization of content.
                  </p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-semibold mb-1">Analytics</h4>
                  <p className="text-xs text-muted-foreground">
                    Help us understand how you use our website to improve your experience.
                  </p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-semibold mb-1">Marketing</h4>
                  <p className="text-xs text-muted-foreground">
                    Used to track your activity across websites for personalized advertising.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={handleRejectAll}
              className="flex-1 md:flex-none px-4 py-2 text-xs uppercase tracking-widest border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              Reject
            </button>
            <button
              onClick={handleAcceptAll}
              className="flex-1 md:flex-none px-6 py-2 text-xs uppercase tracking-widest bg-foreground text-background font-semibold hover:bg-foreground/90 transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
