import { useEffect, useState } from "react";
import {
  COACH_ACCOUNTABLE_CLIENT_LOGIN_URL,
  COACH_ACCOUNTABLE_CLIENT_LOGIN_WIDGET_SCRIPT_SRC,
} from "@/lib/social";

type CoachAccountableLoginEmbedProps = {
  className?: string;
  "data-testid"?: string;
};

const INITIAL_HEIGHT_PX = 320;
const CA_ORIGIN = "https://www.coachaccountable.com";

/** Map the published loginWidget script src to the iframe CA would inject. */
function loginWidgetIframeSrcFromScript(scriptSrc: string): string {
  return scriptSrc.replace("/loginWidget/", "/loginWidget/w-");
}

/**
 * CoachAccountable remote login widget.
 * Mirrors their script (iframe + postMessage height) without injecting it.
 * CSP must allow https://www.coachaccountable.com in frame-src.
 */
export function CoachAccountableLoginEmbed({
  className,
  "data-testid": testId = "embed-coachaccountable-client-login",
}: CoachAccountableLoginEmbedProps) {
  const scriptSrc = COACH_ACCOUNTABLE_CLIENT_LOGIN_WIDGET_SCRIPT_SRC;
  const iframeSrc = scriptSrc
    ? loginWidgetIframeSrcFromScript(scriptSrc)
    : null;
  const [height, setHeight] = useState(INITIAL_HEIGHT_PX);

  useEffect(() => {
    if (!iframeSrc) return;

    function onMessage(event: MessageEvent) {
      if (event.origin !== CA_ORIGIN) return;
      const data = event.data as { a?: string; h?: number } | null;
      if (
        data &&
        data.a === "tellHeight" &&
        typeof data.h === "number" &&
        data.h > 0
      ) {
        setHeight(data.h);
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [iframeSrc]);

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
          Client login will appear here once the CoachAccountable login widget
          is configured.
        </p>
        {COACH_ACCOUNTABLE_CLIENT_LOGIN_URL ? (
          <p className="mt-4">
            <a
              href={COACH_ACCOUNTABLE_CLIENT_LOGIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary underline underline-offset-4 hover:text-primary"
            >
              Open client login
            </a>
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className={className ?? "w-full"} data-testid={testId}>
      <iframe
        title="Client login — The Long Money Table"
        src={iframeSrc}
        width="100%"
        height={height}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block w-full border-0"
        style={{ height }}
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-top-navigation allow-forms allow-popups"
      />
    </div>
  );
}
