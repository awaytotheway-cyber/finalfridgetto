"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Plus, ShoppingBag } from "lucide-react";
import { useRef, useState } from "react";
import { flyToCart } from "@/components/motion/FlyToCart";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  /** "full" = labelled primary button, "icon" = round quick-add on cards */
  variant?: "full" | "icon";
  className?: string;
  /** Open the drawer after adding (used on the product page). */
  openDrawer?: boolean;
}

export function AddToCartButton({
  product,
  quantity = 1,
  variant = "full",
  className,
  openDrawer = false,
}: AddToCartButtonProps) {
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);
  const ref = useRef<HTMLButtonElement>(null);
  const [added, setAdded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    // Cards are wrapped in links — don't navigate when quick-adding.
    e.preventDefault();
    e.stopPropagation();
    addItem(product, quantity);
    flyToCart(product.images[0].src, ref.current);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
    if (openDrawer) window.setTimeout(openCart, 900);
  };

  if (variant === "icon") {
    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        aria-label={`Add ${product.name} to cart`}
        className={cn(
          "grid h-11 w-11 place-items-center rounded-full bg-forest text-cream shadow-[var(--shadow-soft)] transition-colors hover:bg-terracotta",
          className,
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={added ? "check" : "plus"}
            initial={{ scale: 0.4, opacity: 0, rotate: -45 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {added ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          </motion.span>
        </AnimatePresence>
      </button>
    );
  }

  return (
    <Button ref={ref} size="lg" onClick={handleClick} className={cn("min-w-48", className)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={added ? "added" : "add"}
          className="inline-flex items-center gap-2"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {added ? (
            <>
              <Check className="h-5 w-5" /> Added to basket
            </>
          ) : (
            <>
              <ShoppingBag className="h-5 w-5" /> Add to basket
            </>
          )}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
