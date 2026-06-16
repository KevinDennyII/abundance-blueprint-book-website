import { useEffect } from "react";
import { useLocation } from "wouter";
import { scrollToHashOrTop } from "@/lib/scroll";

export function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      scrollToHashOrTop();
    });

    return () => cancelAnimationFrame(frame);
  }, [location]);

  useEffect(() => {
    const onHashChange = () => scrollToHashOrTop();

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return null;
}
