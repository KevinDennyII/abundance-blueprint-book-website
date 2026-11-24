import { LETTER_PAGE_PATH } from "@/lib/social";

export type NavLink = {
  href: string;
  label: string;
  /** When true, render a normal `<a>` that leaves the SPA. */
  external?: boolean;
  /** Optional secondary line under the label (dropdown items). */
  description?: string;
};

export type NavGroup = {
  kind: "group";
  id: string;
  label: string;
  children: readonly NavLink[];
};

export type NavItem =
  | (NavLink & { kind?: "link"; /** Gold-outline CTA styling in the header */ cta?: boolean })
  | NavGroup;

export function isNavGroup(item: NavItem): item is NavGroup {
  return (item as NavGroup).kind === "group";
}

/** Primary header menu (excludes Client Login). */
export const mainNavItems: readonly NavItem[] = [
  { href: "/book", label: "The Book" },
  {
    kind: "group",
    id: "community",
    label: "Community",
    children: [
      { href: "/circle", label: "The Long Money Circle" },
      { href: "/live", label: "Long Money Live" },
    ],
  },
  {
    kind: "group",
    id: "resources",
    label: "Resources",
    children: [
      {
        href: "/library",
        label: "The Long Money Library",
        description: "Guides, workshops & shop",
      },
      { href: LETTER_PAGE_PATH, label: "Letter" },
    ],
  },
  { href: "/work-with-me", label: "Work With Me", cta: true },
  { href: "/about", label: "About" },
];

/** Desktop top-right + mobile footer of the drawer + site footer. */
export const clientLoginLink: NavLink = {
  href: "/client-login",
  label: "Client Login",
};

/** Flattened leaf links for the site footer (includes Client Login). */
export const footerNavLinks: readonly NavLink[] = [
  { href: "/book", label: "The Book" },
  { href: "/circle", label: "The Long Money Circle" },
  { href: "/live", label: "Long Money Live" },
  { href: "/library", label: "The Long Money Library" },
  { href: LETTER_PAGE_PATH, label: "Letter" },
  { href: "/work-with-me", label: "Work With Me" },
  { href: "/about", label: "About" },
  clientLoginLink,
];

export function isNavActive(location: string, href: string) {
  if (location === href) return true;
  if (href === LETTER_PAGE_PATH && location.startsWith(`${LETTER_PAGE_PATH}/`)) {
    return true;
  }
  if (
    href === "/work-with-me" &&
    (location.startsWith("/financial-wellness-reset") ||
      location.startsWith("/cash-flow-intensive") ||
      location.startsWith("/readiness-assessment") ||
      location.startsWith("/contact"))
  ) {
    return true;
  }
  return false;
}

export function isGroupActive(location: string, group: NavGroup) {
  return group.children.some(
    (child) => !child.external && isNavActive(location, child.href),
  );
}
