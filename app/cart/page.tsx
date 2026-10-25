"use client";

import { AnimatePresence } from "framer-motion";
import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartTotals, ShippingProgress } from "@/components/cart/CartSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { ButtonLink } from "@/components/ui/Button";
import { useMounted } from "@/lib/hooks";
import { selectCount, selectSubtotal, useCart } from "@/store/cart";

export default function CartPage() {
  const mounted = useMounted();
  const items = useCart((s) => s.items);
  const count = useCart(selectCount);
  const subtotal = useCart(selectSubtotal);

  return (
    <div className="container-page pt-10 md:pt-16">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-8">
        <div>
          <p className="eyebrow">Your basket</p>
          <h1 className="mt-4 text-5xl">Cart</h1>
        </div>
        {mounted && count > 0 && (
          <p className="text-stone">
            {count} {count === 1 ? "item" : "items"}
          </p>
        )}
      </header>

      {!mounted ? (
        // Cart lives in localStorage — show a skeleton until it is read.
        <div className="space-y-6 py-10" aria-busy="true" aria-label="Loading cart">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="skeleton h-24 w-20 rounded-xl" />
              <div className="flex-1 space-y-3">
                <div className="skeleton h-5 w-48 rounded-full" />
                <div className="skeleton h-4 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid gap-12 py-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <ul className="divide-y divide-line border-b border-line">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <CartLineItem key={item.productId} item={item} />
                ))}
              </AnimatePresence>
            </ul>
            <Link href="/shop" className="mt-6 inline-flex items-center gap-2 text-forest hover:text-terracotta">
              <ArrowLeft className="h-4 w-4" /> Continue shopping
            </Link>
          </div>

          <aside className="lg:col-span-5" aria-label="Order summary">
            <div className="rounded-[1.5rem] border border-line bg-parchment/40 p-6 sm:p-8 lg:sticky lg:top-28">
              <h2 className="text-2xl">Order summary</h2>
              <div className="mt-6">
                <ShippingProgress subtotal={subtotal} />
              </div>
              <div className="mt-6">
                <CartTotals subtotal={subtotal} />
              </div>
              <ButtonLink href="/checkout" size="lg" className="mt-7 w-full">
                <Lock className="h-4 w-4" /> Proceed to checkout
              </ButtonLink>
              <p className="mt-4 text-center text-xs text-stone">Taxes included. Secure checkout.</p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
