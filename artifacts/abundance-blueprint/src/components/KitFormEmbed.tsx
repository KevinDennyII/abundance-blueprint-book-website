import { useEffect, useRef } from "react";

type KitFormEmbedProps = {
  /** Kit form embed UID (from the form’s share / embed code). */
  uid: string;
  className?: string;
};

/**
 * Loads a Kit (ConvertKit) form via the official async embed script.
 * Prefer this over pasting the full HTML form markup — Kit injects and
 * maintains the form UI from their CDN.
 */
export function KitFormEmbed({ uid, className }: KitFormEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.replaceChildren();

    const script = document.createElement("script");
    script.async = true;
    script.dataset.uid = uid;
    script.src = `https://long-money-concepts-llc.kit.com/${uid}/index.js`;
    container.appendChild(script);

    return () => {
      container.replaceChildren();
    };
  }, [uid]);

  return <div ref={containerRef} className={className} />;
}
