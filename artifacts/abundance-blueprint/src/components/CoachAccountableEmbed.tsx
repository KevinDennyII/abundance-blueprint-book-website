import { useEffect, useRef } from "react";
import { COACH_ACCOUNTABLE_START_HERE_SCRIPT_SRC } from "@/lib/social";

type CoachAccountableEmbedProps = {
  className?: string;
  "data-testid"?: string;
};

/**
 * CoachAccountable's collection script always injects a 600px-tall iframe,
 * which leaves empty white space under a short "Start Here" list. We keep
 * their script (so the widget stays current), then tighten the iframe height.
 */
const IFRAME_HEIGHT_PX = 380;

/**
 * CoachAccountable Offering Collection widget (script → iframe).
 * CSP must allow https://www.coachaccountable.com in script-src + frame-src.
 */
export function CoachAccountableEmbed({
  className,
  "data-testid": testId = "embed-coachaccountable-start-here",
}: CoachAccountableEmbedProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const src = COACH_ACCOUNTABLE_START_HERE_SCRIPT_SRC;

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !src) return;

    host.replaceChildren();

    const tightenIframe = (iframe: HTMLIFrameElement) => {
      iframe.style.height = `${IFRAME_HEIGHT_PX}px`;
      iframe.style.minHeight = `${IFRAME_HEIGHT_PX}px`;
      iframe.setAttribute("height", String(IFRAME_HEIGHT_PX));
    };

    const observer = new MutationObserver(() => {
      const iframe = host.querySelector("iframe");
      if (iframe) {
        tightenIframe(iframe);
        observer.disconnect();
      }
    });
    observer.observe(host, { childList: true, subtree: true });

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    script.async = false;
    host.appendChild(script);

    return () => {
      observer.disconnect();
      host.replaceChildren();
    };
  }, [src]);

  if (!src) {
    return (
      <div
        className={
          className ??
          "border border-dashed border-border bg-white/60 px-6 py-10 text-center"
        }
        data-testid={testId}
      >
        <p className="text-muted text-sm leading-relaxed max-w-md mx-auto">
          Single-session booking will appear here once the CoachAccountable
          &ldquo;Start Here&rdquo; embed is configured.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={hostRef}
      className={className ?? "w-full bg-transparent"}
      data-testid={testId}
    />
  );
}
