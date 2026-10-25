"use client";

import { Truck } from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "@/store/cart";

/** Free-shipping progress meter. */
export function ShippingProgress({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  return (
    <div className="rounded-xl bg-parchment/70 p-4">
      <p className="flex items-center gap-2 text-sm text-forest">
        <Truck className="h-4 w-4 shrink-0" />
        {remaining > 0 ? (
          <span>
            Add <strong className="font-semibold">{formatPrice(remaining)}</strong> more for free delivery
          </span>
        ) : (
          <span>You&rsquo;ve unlocked <strong className="font-semibold">free delivery</strong></span>
        )}
      </p>
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-label="Progress towards free delivery"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
      >
        <motion.div
          className="h-full rounded-full bg-forest"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

export function getShipping(subtotal: number) {
  return subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}

/** Subtotal / shipping / total rows. */
export function CartTotals({ subtotal, showTotal = true }: { subtotal: number; showTotal?: boolean }) {
  const shipping = getShipping(subtotal);
  return (
    <dl className="space-y-2 text-[0.95rem]">
      <div className="flex justify-between">
        <dt className="text-stone">Subtotal</dt>
        <dd className="font-medium tabular-nums">{formatPrice(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-stone">Delivery</dt>
        <dd className="tabular-nums">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
      </div>
      {showTotal && (
        <div className="flex justify-between border-t border-line pt-3 text-lg">
          <dt className="font-serif text-forest">Total</dt>
          <dd className="font-semibold tabular-nums">{formatPrice(subtotal + shipping)}</dd>
        </div>
      )}
    </dl>
  );
}
