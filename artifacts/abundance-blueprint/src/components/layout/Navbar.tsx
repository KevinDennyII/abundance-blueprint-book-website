import { Link, useLocation } from "wouter";
import { useEffect, useId, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { motion, useScroll } from "framer-motion";
import {
  clientLoginLink,
  isGroupActive,
  isNavActive,
  isNavGroup,
  mainNavItems,
  type NavGroup,
  type NavLink,
} from "@/lib/navigation";
import logo from "@assets/Long_Money_Concepts_Logo_Tagline_Transparent.png";

function NavAnchor({
  link,
  className,
  onClick,
  testId,
}: {
  link: NavLink;
  className: string;
  onClick?: () => void;
  testId?: string;
}) {
  if (link.external) {
    return (
      <a
        href={link.href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        data-testid={testId}
      >
        {link.label}
        {link.description ? (
          <span className="mt-0.5 block text-[0.65rem] font-normal normal-case tracking-normal text-muted">
            {link.description}
          </span>
        ) : null}
      </a>
    );
  }

  return (
    <Link
      href={link.href}
      className={className}
      onClick={onClick}
      data-testid={testId}
    >
      {link.label}
      {link.description ? (
        <span className="mt-0.5 block text-[0.65rem] font-normal normal-case tracking-normal text-muted">
          {link.description}
        </span>
      ) : null}
    </Link>
  );
}

function DesktopDropdown({
  group,
  location,
}: {
  group: NavGroup;
  location: string;
}) {
  const menuId = useId();
  const active = isGroupActive(location, group);

  return (
    <div className="relative group/nav">
      <button
        type="button"
        className={`inline-flex items-center gap-1 text-xs xl:text-sm tracking-widest uppercase transition-colors hover:text-secondary whitespace-nowrap ${
          active ? "text-secondary font-medium" : "text-foreground/80"
        }`}
        aria-haspopup="menu"
        aria-controls={menuId}
      >
        {group.label}
        <ChevronDown
          className="size-3.5 opacity-70 transition-transform group-hover/nav:rotate-180 group-focus-within/nav:rotate-180"
          aria-hidden="true"
        />
      </button>
      <div
        id={menuId}
        role="menu"
        className="invisible absolute left-1/2 top-full z-50 min-w-[16rem] -translate-x-1/2 pt-3 opacity-0 transition-[opacity,visibility] duration-150 group-hover/nav:visible group-hover/nav:opacity-100 group-focus-within/nav:visible group-focus-within/nav:opacity-100"
      >
        <ul className="rounded-md border border-border bg-background/98 py-2 shadow-md backdrop-blur-md">
          {group.children.map((child) => {
            const childActive =
              !child.external && isNavActive(location, child.href);
            return (
              <li key={child.href} role="none">
                <NavAnchor
                  link={child}
                  className={`block px-4 py-2.5 text-xs tracking-widest uppercase transition-colors hover:bg-primary/5 hover:text-secondary ${
                    childActive
                      ? "text-secondary font-medium"
                      : "text-foreground/80"
                  }`}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function desktopLinkClass(
  location: string,
  link: NavLink & { cta?: boolean },
) {
  const active = !link.external && isNavActive(location, link.href);

  if (link.cta) {
    return `inline-flex items-center whitespace-nowrap rounded-md border border-secondary px-3 py-1.5 text-xs xl:text-sm tracking-widest uppercase transition-colors ${
      active
        ? "bg-secondary/15 text-secondary font-medium"
        : "text-secondary hover:bg-secondary/10"
    }`;
  }

  return `text-xs xl:text-sm tracking-widest uppercase transition-colors hover:text-secondary whitespace-nowrap ${
    active ? "text-secondary font-medium" : "text-foreground/80"
  }`;
}

export function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setScrolled(latest > 50);
    });
  }, [scrollY]);

  useEffect(() => {
    setMobileOpen(false);
    setExpandedGroups({});
  }, [location]);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  function toggleGroup(id: string) {
    setExpandedGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled || mobileOpen
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm py-2"
          : "bg-transparent py-3"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex shrink-0 items-center"
          aria-label="Long Money Concepts — Home"
        >
          <img
            src={logo}
            alt="Long Money Concepts LLC — There's life beneath the numbers"
            className="block h-auto w-44 sm:w-52 md:w-56 lg:w-64"
            width={2050}
            height={736}
          />
        </Link>

        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          <nav className="flex items-center gap-5 xl:gap-7" aria-label="Main">
            {mainNavItems.map((item) => {
              if (isNavGroup(item)) {
                return (
                  <DesktopDropdown
                    key={item.id}
                    group={item}
                    location={location}
                  />
                );
              }

              return (
                <NavAnchor
                  key={item.href}
                  link={item}
                  className={desktopLinkClass(location, item)}
                />
              );
            })}
          </nav>

          <Link
            href={clientLoginLink.href}
            className={`shrink-0 border-l border-border pl-5 text-[0.7rem] tracking-wide text-muted transition-colors hover:text-secondary ${
              isNavActive(location, clientLoginLink.href)
                ? "text-secondary"
                : ""
            }`}
            data-testid="link-client-login-desktop"
          >
            {clientLoginLink.label}
          </Link>
        </div>

        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-primary hover:bg-primary/5 transition-colors"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileOpen((open) => !open)}
          data-testid="button-mobile-nav"
        >
          {mobileOpen ? (
            <X className="size-6" aria-hidden="true" />
          ) : (
            <Menu className="size-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {mobileOpen ? (
        <nav
          id="mobile-navigation"
          className="lg:hidden border-t border-border bg-background/98 backdrop-blur-md"
          aria-label="Main"
        >
          <ul className="container mx-auto px-4 md:px-6 py-4 flex flex-col gap-1">
            {mainNavItems.map((item) => {
              if (isNavGroup(item)) {
                const expanded = Boolean(expandedGroups[item.id]);
                const groupActive = isGroupActive(location, item);
                const panelId = `mobile-nav-${item.id}`;

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`flex w-full items-center justify-between rounded-md px-3 py-3 text-sm tracking-widest uppercase transition-colors ${
                        groupActive
                          ? "bg-secondary/15 text-secondary font-medium"
                          : "text-foreground/80 hover:bg-primary/5 hover:text-secondary"
                      }`}
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      onClick={() => toggleGroup(item.id)}
                      data-testid={`button-mobile-nav-${item.id}`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`size-4 transition-transform ${
                          expanded ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {expanded ? (
                      <ul id={panelId} className="mt-1 mb-1 space-y-0.5 pl-3">
                        {item.children.map((child) => {
                          const childActive =
                            !child.external &&
                            isNavActive(location, child.href);
                          const testId = `link-mobile-nav-${child.label
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`;
                          return (
                            <li key={child.href}>
                              <NavAnchor
                                link={child}
                                className={`block rounded-md px-3 py-2.5 text-sm tracking-widest uppercase transition-colors ${
                                  childActive
                                    ? "bg-secondary/15 text-secondary font-medium"
                                    : "text-foreground/80 hover:bg-primary/5 hover:text-secondary"
                                }`}
                                onClick={() => setMobileOpen(false)}
                                testId={testId}
                              />
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </li>
                );
              }

              const testId = `link-mobile-nav-${item.label
                .toLowerCase()
                .replace(/\s+/g, "-")}`;
              const active = !item.external && isNavActive(location, item.href);

              if (item.cta) {
                return (
                  <li key={item.href} className="pt-1">
                    <NavAnchor
                      link={item}
                      className={`block rounded-md border border-secondary px-3 py-3 text-center text-sm tracking-widest uppercase transition-colors ${
                        active
                          ? "bg-secondary/15 text-secondary font-medium"
                          : "text-secondary hover:bg-secondary/10"
                      }`}
                      onClick={() => setMobileOpen(false)}
                      testId={testId}
                    />
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <NavAnchor
                    link={item}
                    className={`block rounded-md px-3 py-3 text-sm tracking-widest uppercase transition-colors ${
                      active
                        ? "bg-secondary/15 text-secondary font-medium"
                        : "text-foreground/80 hover:bg-primary/5 hover:text-secondary"
                    }`}
                    onClick={() => setMobileOpen(false)}
                    testId={testId}
                  />
                </li>
              );
            })}

            <li className="mt-2 border-t border-border pt-3">
              <Link
                href={clientLoginLink.href}
                className={`block px-3 py-2 text-sm text-muted transition-colors hover:text-secondary ${
                  isNavActive(location, clientLoginLink.href)
                    ? "text-secondary"
                    : ""
                }`}
                onClick={() => setMobileOpen(false)}
                data-testid="link-mobile-nav-client-login"
              >
                {clientLoginLink.label}
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </motion.header>
  );
}
