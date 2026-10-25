"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import type { CartItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { MAX_ITEM_QTY, useCart } from "@/store/cart";

export function CartLineItem({ item, onNavigate }: { item: CartItem; onNavigate?: () => void }) {
  const setQuantity = useCart((s) => s.setQuantity);
  const removeItem = useCart((s) => s.removeItem);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40, transition: { duration: 0.25 } }}
      className="flex gap-4 py-5"
    >
      <Link
        href={`/product/${item.slug}`}
        onClick={onNavigate}
        className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-parchment"
        tabIndex={-1}
        aria-hidden
      >
        <Image src={item.image} alt="" fill sizes="80px" className="object-cover" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/product/${item.slug}`}
              onClick={onNavigate}
              className="font-serif text-lg leading-snug text-forest hover:text-terracotta"
            >
              {item.name}
            </Link>
            <p className="text-sm text-stone">{item.size}</p>
          </div>
          <p className="shrink-0 font-medium tabular-nums">{formatPrice(item.price * item.quantity)}</p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <QuantitySelector
            size="sm"
            value={item.quantity}
            min={1}
            max={MAX_ITEM_QTY}
            label={`Quantity of ${item.name}`}
            onChange={(q) => setQuantity(item.productId, q)}
          />
          <button
            type="button"
            onClick={() => removeItem(item.productId)}
            className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm text-stone transition-colors hover:bg-parchment hover:text-terracotta"
            aria-label={`Remove ${item.name} from cart`}
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>
    </motion.li>
  );
}
