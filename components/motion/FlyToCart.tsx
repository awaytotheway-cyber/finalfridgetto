"use client";

/**
 * "Add to cart" micro-animation: a small thumbnail of the product flies
 * from the button that was clicked to the cart icon in the navbar.
 *
 * Usage: call `flyToCart(imageSrc, buttonElement)` after adding an item.
 * <FlyToCartLayer /> (mounted once in the root layout) renders the flight.
 */
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const EVENT = "subhadra:fly-to-cart";

interface Flight {
  id: number;
  src: string;
  from: DOMRect;
  to: DOMRect;
}

export function flyToCart(src: string, origin: HTMLElement | null) {
  if (!origin || typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(EVENT, { detail: { src, from: origin.getBoundingClientRect() } }),
  );
}

export function FlyToCartLayer() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onFly = (e: Event) => {
      if (reduce) return;
      const { src, from } = (e as CustomEvent<{ src: string; from: DOMRect }>).detail;
      // Pick the visible cart target (desktop vs. mobile can differ).
      const target = Array.from(document.querySelectorAll<HTMLElement>("[data-cart-target]")).find(
        (el) => el.offsetParent !== null,
      );
      if (!target) return;
      setFlights((f) => [...f, { id: Date.now() + Math.random(), src, from, to: target.getBoundingClientRect() }]);
    };
    window.addEventListener(EVENT, onFly);
    return () => window.removeEventListener(EVENT, onFly);
  }, [reduce]);

  const SIZE = 56;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
      <AnimatePresence>
        {flights.map((f) => {
          const startX = f.from.left + f.from.width / 2 - SIZE / 2;
          const startY = f.from.top + f.from.height / 2 - SIZE / 2;
          const endX = f.to.left + f.to.width / 2 - SIZE / 2;
          const endY = f.to.top + f.to.height / 2 - SIZE / 2;
          return (
            <motion.div
              key={f.id}
              className="absolute left-0 top-0 overflow-hidden rounded-full border-2 border-cream shadow-[var(--shadow-lift)]"
              style={{ width: SIZE, height: SIZE }}
              initial={{ x: startX, y: startY, scale: 1, opacity: 1 }}
              animate={{
                // Arc: rise first, then swoop into the cart.
                x: [startX, (startX + endX) / 2, endX],
                y: [startY, Math.min(startY, endY) - 120, endY],
                scale: [1, 0.9, 0.3],
                opacity: [1, 1, 0.6],
              }}
              transition={{ duration: 0.85, ease: [0.45, 0, 0.2, 1] }}
              onAnimationComplete={() => setFlights((all) => all.filter((x) => x.id !== f.id))}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.src.replace(/w=\d+/, "w=120")} alt="" className="h-full w-full object-cover" />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
