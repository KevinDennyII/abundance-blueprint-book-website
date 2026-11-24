/**
 * Lightweight HTML → Markdown for Kit creator-post bodies.
 * Handles the tags Kit email/web posts typically emit.
 */

function decodeEntities(input: string): string {
  return input
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, n: string) =>
      String.fromCodePoint(Number(n)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, n: string) =>
      String.fromCodePoint(parseInt(n, 16)),
    );
}

function collapseBlankLines(input: string): string {
  return input
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function inlineMarkdown(html: string): string {
  let s = html;
  s = s.replace(/<br\s*\/?>/gi, "  \n");
  s = s.replace(
    /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
    (_m, href: string, text: string) => {
      const label = inlineMarkdown(text).replace(/\n+/g, " ").trim() || href;
      return `[${label}](${href})`;
    },
  );
  s = s.replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, "**$2**");
  s = s.replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, "*$2*");
  s = s.replace(/<[^>]+>/g, "");
  return decodeEntities(s).replace(/[ \t]{2,}/g, " ").trim();
}

/**
 * Convert Kit post HTML into Markdown suitable for ReactMarkdown.
 * Strips email chrome (styles, tables wrappers) while keeping copy structure.
 */
export function kitHtmlToMarkdown(html: string, title?: string): string {
  let s = html;
  s = s.replace(/<style[\s\S]*?<\/style>/gi, "");
  s = s.replace(/<script[\s\S]*?<\/script>/gi, "");
  s = s.replace(/<!--[\s\S]*?-->/g, "");

  // Kit emails put author / date / title above a ↓ marker — keep body only.
  const arrowSplit = s.search(/>\s*↓\s*</);
  if (arrowSplit > 0 && arrowSplit < s.length * 0.45) {
    s = s.slice(arrowSplit);
  }

  // Drop common Kit footer / chrome links.
  s = s.replace(
    /<a\b[^>]*(?:unsubscribe|preferences|poweredby|kit-mail)[^>]*>[\s\S]*?<\/a>/gi,
    "",
  );

  s = s.replace(/<hr\b[^>]*\/?>/gi, "\n\n---\n\n");
  s = s.replace(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi, (_m, inner: string) => {
    const text = inlineMarkdown(inner);
    return text ? `\n\n# ${text}\n\n` : "";
  });
  s = s.replace(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi, (_m, inner: string) => {
    const text = inlineMarkdown(inner);
    return text ? `\n\n## ${text}\n\n` : "";
  });
  s = s.replace(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi, (_m, inner: string) => {
    const text = inlineMarkdown(inner);
    return text ? `\n\n### ${text}\n\n` : "";
  });

  s = s.replace(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi, (_m, inner: string) => {
    const text = kitHtmlToMarkdown(inner)
      .split("\n")
      .map((line) => (line.trim() ? `> ${line}` : ">"))
      .join("\n");
    return `\n\n${text}\n\n`;
  });

  s = s.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_m, inner: string) => {
    const text = inlineMarkdown(inner);
    return text ? `\n- ${text}` : "";
  });
  s = s.replace(/<\/?(?:ul|ol)\b[^>]*>/gi, "\n\n");

  s = s.replace(/<p\b[^>]*>([\s\S]*?)<\/p>/gi, (_m, inner: string) => {
    const text = inlineMarkdown(inner);
    return text ? `\n\n${text}\n\n` : "";
  });

  s = s.replace(
    /<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi,
    (_m, src: string) => `\n\n![](${src})\n\n`,
  );

  // Remaining tags → text / breaks
  s = s.replace(/<br\s*\/?>/gi, "  \n");
  s = s.replace(/<\/(?:div|td|tr|table|tbody|figure|center)>/gi, "\n");
  s = s.replace(/<[^>]+>/g, "");
  s = decodeEntities(s);

  let md = collapseBlankLines(s);
  md = md.replace(/^(?:>\s*)?↓\s*/u, "");
  md = md.replace(/^(?:#+\s*)?↓\s*$/gmu, "").trim();
  if (title?.trim()) {
    const escaped = title.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    md = md
      .replace(new RegExp(`^#+\\s*${escaped}\\s*$`, "mi"), "")
      .trim();
  }
  return collapseBlankLines(md);
}

/** Short excerpt from Kit intro / meta, cleaned of header chrome. */
export function kitExcerpt(
  metaDescription: string,
  introContent: string,
  bodyMarkdown: string,
): string {
  if (metaDescription.trim()) return metaDescription.trim().slice(0, 400);

  let intro = introContent.trim();
  // Drop "Author · date · title ↓" prefix when present.
  const arrow = intro.indexOf("↓");
  if (arrow >= 0 && arrow < 180) {
    intro = intro.slice(arrow + 1).trim();
  }
  if (intro) return intro.slice(0, 400);

  const firstPara = bodyMarkdown
    .split(/\n\n+/)
    .map((p) => p.replace(/^#+\s+/, "").trim())
    .find((p) => p.length > 40 && !p.startsWith("![") && !p.startsWith("---"));
  return (firstPara ?? "").slice(0, 400);
}
