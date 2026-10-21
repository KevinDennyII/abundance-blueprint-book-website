import { useEffect } from "react";

/**
 * Hard-navigates to an absolute URL (for permanent off-site redirects).
 * Prefer host-level 301s when available; this covers SPA / Replit preview.
 */
export function ExternalRedirect({ href }: { href: string }) {
  useEffect(() => {
    window.location.replace(href);
  }, [href]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <p className="text-muted text-center text-base">
        Redirecting to{" "}
        <a
          href={href}
          className="text-secondary hover:text-primary transition-colors"
        >
          {href}
        </a>
        …
      </p>
    </main>
  );
}
