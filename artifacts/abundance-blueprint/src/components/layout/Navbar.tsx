import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, useScroll } from "framer-motion";
import { navLinks } from "@/lib/navigation";

export function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setScrolled(latest > 50);
    });
  }, [scrollY]);

  useEffect(() => {
    setMobileOpen(false);
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

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled || mobileOpen
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-xl md:text-2xl font-semibold tracking-wide text-primary"
        >
          La'Toya Ray<span className="text-secondary">, CPA</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs xl:text-sm tracking-widest uppercase transition-colors hover:text-secondary whitespace-nowrap ${
                location === link.href
                  ? "text-secondary font-medium"
                  : "text-foreground/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

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
        >
          <ul className="container mx-auto px-4 md:px-6 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block rounded-md px-3 py-3 text-sm tracking-widest uppercase transition-colors ${
                    location === link.href
                      ? "bg-secondary/15 text-secondary font-medium"
                      : "text-foreground/80 hover:bg-primary/5 hover:text-secondary"
                  }`}
                  data-testid={`link-mobile-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </motion.header>
  );
}
