import { LETTER_SITE_URL } from "@/lib/social";

export type NavLink = {
  href: string;
  label: string;
  /** When true, render a normal `<a>` that leaves the SPA. */
  external?: boolean;
};

export const navLinks: readonly NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/library", label: "Library" },
  { href: "/book", label: "The Book" },
  { href: "/circle", label: "Community" },
  { href: "/work-with-me", label: "Work With Me" },
  { href: "/about", label: "About" },
  { href: LETTER_SITE_URL, label: "Articles", external: true },
];
