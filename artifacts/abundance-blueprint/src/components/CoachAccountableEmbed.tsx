import { COACH_ACCOUNTABLE_START_HERE_SCRIPT_SRC } from "@/lib/social";

type CoachAccountableEmbedProps = {
  className?: string;
  "data-testid"?: string;
};

/**
 * CoachAccountable's collection script hardcodes a 600px iframe, leaving empty
 * white space under the three-offering list. Their script only injects an
 * iframe at the matching widget URL (script id prefix `S` → widget prefix `W`).
 * We load that iframe ourselves at a height that shows all three offerings
 * without scrolling or empty pad below.
 */
const IFRAME_HEIGHT_PX = 420;

/** Map the published script src to the widget iframe src CA would inject. */
function widgetIframeSrcFromScript(scriptSrc: string): string {
  return scriptSrc.replace("/offering/S", "/offering/W");
}

/**
 * CoachAccountable Offering Collection widget.
 * CSP must allow https://www.coachaccountable.com in frame-src.
 */
export function CoachAccountableEmbed({
  className,
  "data-testid": testId = "embed-coachaccountable-start-here",
}: CoachAccountableEmbedProps) {
  const scriptSrc = COACH_ACCOUNTABLE_START_HERE_SCRIPT_SRC;
  const iframeSrc = scriptSrc
    ? widgetIframeSrcFromScript(scriptSrc)
    : null;

  if (!iframeSrc) {
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
    <div className={className ?? "w-full"} data-testid={testId}>
      <iframe
        title="Start with a single session"
        src={iframeSrc}
        width="100%"
        height={IFRAME_HEIGHT_PX}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block w-full border-0"
        style={{ height: IFRAME_HEIGHT_PX }}
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-top-navigation allow-forms allow-popups"
      />
    </div>
  );
}
