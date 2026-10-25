"use client";

import { useState } from "react";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { MAX_ITEM_QTY } from "@/store/cart";

/** Quantity stepper + add to cart for the product page. */
export function ProductPurchase({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <QuantitySelector value={qty} onChange={setQty} max={MAX_ITEM_QTY} label={`Quantity of ${product.name}`} />
        <AddToCartButton product={product} quantity={qty} openDrawer className="flex-1 sm:flex-none" />
      </div>
      {qty > 1 && (
        <p className="mt-3 text-sm text-stone">
          {qty} × {formatPrice(product.price)} = <span className="font-medium text-charcoal">{formatPrice(qty * product.price)}</span>
        </p>
      )}
    </div>
  );
}
