import { useReducedMotion, type Variants } from "framer-motion";

/** Shared page entrance variants — respect prefers-reduced-motion. */
export function usePageMotion() {
  const reduceMotion = useReducedMotion();

  const fadeInUp: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
      };

  const staggerContainer: Variants = reduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
      };

  return { fadeInUp, staggerContainer };
}
