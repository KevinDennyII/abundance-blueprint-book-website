import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import { navLinks } from "@/lib/navigation";

export function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm py-3" : "bg-transparent py-5"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl md:text-2xl font-semibold tracking-wide text-primary">
          La'Toya Ray<span className="text-secondary">, CPA</span>
        </Link>
        
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`text-xs xl:text-sm tracking-widest uppercase transition-colors hover:text-secondary whitespace-nowrap ${
                location === link.href ? "text-secondary font-medium" : "text-foreground/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Nav Toggle could go here, omitting for simplicity/focus on requested design */}
      </div>
    </motion.header>
  );
}
