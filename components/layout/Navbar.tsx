"use client";

import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { useModal, useMounted } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { selectCount, useCart } from "@/store/cart";

export const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

/** Cart icon with a live count badge that bounces whenever an item is added. */
function CartButton() {
  const mounted = useMounted();
  const count = useCart(selectCount);
  const tick = useCart((s) => s.addedTick);
  const open = useCart((s) => s.openCart);
  const controls = useAnimationControls();
  const shown = mounted ? count : 0;

  useEffect(() => {
    if (tick === 0) return;
    // Wait for the fly-to-cart thumbnail to land, then bounce.
    const t = setTimeout(() => {
      controls.start({ scale: [1, 1.35, 0.9, 1.1, 1], transition: { duration: 0.6 } });
    }, 700);
    return () => clearTimeout(t);
  }, [tick, controls]);

  return (
    <button
      type="button"
      onClick={open}
      data-cart-target
      className="relative grid h-11 w-11 place-items-center rounded-full text-forest transition-colors hover:bg-parchment"
      aria-label={`Open cart, ${shown} ${shown === 1 ? "item" : "items"}`}
    >
      <motion.span animate={controls} className="grid place-items-center">
        <ShoppingBag className="h-[22px] w-[22px]" strokeWidth={1.6} />
      </motion.span>
      <AnimatePresence>
        {shown > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-terracotta px-1 text-[0.68rem] font-semibold text-cream"
          >
            {shown}
          </motion.span>
        )}
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {mounted ? `${count} items in cart` : ""}
      </span>
    </button>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useModal<HTMLDivElement>(open, onClose);
  const pathname = usePathname();
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] md:hidden">
          <motion.div
            className="absolute inset-0 bg-charcoal/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={panelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
            className="absolute inset-x-0 top-0 rounded-b-3xl bg-cream px-5 pb-10 pt-4 shadow-[var(--shadow-lift)]"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 34 }}
          >
            <div className="flex h-14 items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={onClose}
                className="grid h-11 w-11 place-items-center rounded-full text-forest hover:bg-parchment"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav aria-label="Mobile" className="mt-8">
              <ul className="space-y-1">
                {[{ href: "/", label: "Home" }, ...NAV_LINKS].map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.08 + i * 0.05 } }}
                  >
                    <Link
                      href={l.href}
                      onClick={onClose}
                      aria-current={pathname === l.href ? "page" : undefined}
                      className="block rounded-xl px-3 py-3 font-serif text-3xl text-forest hover:bg-parchment aria-[current=page]:text-terracotta"
                    >
                      {l.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500",
          scrolled ? "bg-cream/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md" : "bg-cream/0",
        )}
      >
        <div className="container-page flex h-[76px] items-center justify-between gap-6">
          <Logo />

          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-2">
              {NAV_LINKS.map((l) => {
                const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className="relative rounded-full px-4 py-2 text-[0.95rem] text-charcoal transition-colors hover:text-forest"
                    >
                      {l.label}
                      {active && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute inset-x-4 -bottom-0.5 h-px bg-terracotta"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <CartButton />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid h-11 w-11 place-items-center rounded-full text-forest hover:bg-parchment md:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
