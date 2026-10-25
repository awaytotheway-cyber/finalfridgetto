"use client";

import { motion } from "framer-motion";

/**
 * Route transition. A template re-mounts on every navigation, so each page
 * gently fades and rises in. Reduced-motion users get the fade only
 * (handled globally by <MotionConfig reducedMotion="user">).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
