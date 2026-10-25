"use client";

import { MotionConfig } from "framer-motion";

/** Global motion defaults. `reducedMotion="user"` honours the OS setting. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </MotionConfig>
  );
}
