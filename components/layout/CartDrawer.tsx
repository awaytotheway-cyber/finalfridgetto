"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Lock, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartTotals, ShippingProgress } from "@/components/cart/CartSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { Button } from "@/components/ui/Button";
import { useModal } from "@/lib/hooks";
import { selectCount, selectSubtotal, useCart } from "@/store/cart";
import Link from "next/link";

/** Slide-in cart from the right with a soft blurred backdrop. */
export function CartDrawer() {
  const router = useRouter();
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.closeCart);
  const items = useCart((s) => s.items);
  const count = useCart(selectCount);
  const subtotal = useCart(selectSubtotal);
  const panelRef = useModal<HTMLDivElement>(isOpen, close);

  const goToCheckout = () => {
    close();
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80]">
          <motion.div
            className="absolute inset-0 bg-charcoal/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={close}
            aria-hidden
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cream shadow-[var(--shadow-lift)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
          >
            <header className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 id="cart-drawer-title" className="text-2xl">
                Your basket{" "}
                {count > 0 && <span className="font-sans text-base text-stone">({count})</span>}
              </h2>
              <button
                type="button"
                onClick={close}
                className="grid h-11 w-11 place-items-center rounded-full text-forest transition-colors hover:bg-parchment"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex-1 overflow-y-auto">
                <EmptyCart onNavigate={close} />
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6">
                  <div className="pt-5">
                    <ShippingProgress subtotal={subtotal} />
                  </div>
                  <ul className="divide-y divide-line">
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <CartLineItem key={item.productId} item={item} onNavigate={close} />
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>

                <footer className="border-t border-line bg-parchment/40 px-6 py-6">
                  <CartTotals subtotal={subtotal} />
                  <Button size="lg" className="mt-5 w-full" onClick={goToCheckout}>
                    <Lock className="h-4 w-4" /> Checkout
                  </Button>
                  <Link
                    href="/cart"
                    onClick={close}
                    className="mt-3 block text-center text-sm text-stone underline-offset-4 hover:text-forest hover:underline"
                  >
                    View full cart
                  </Link>
                </footer>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
