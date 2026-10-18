import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();
  const progress = useSpring(scrollYProgress, { stiffness: 190, damping: 32, restDelta: .001 });
  return <motion.div className="scroll-progress" aria-hidden="true" style={{ scaleX: reduced ? scrollYProgress : progress }} />;
}
