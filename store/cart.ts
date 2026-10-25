"use client";

/**
 * Cart store — Zustand with localStorage persistence.
 * Holds line items plus UI state for the slide-in drawer.
 */
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartItem, Product } from "@/lib/types";

const MAX_QTY = 20;

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  /** Incremented on every add — drives the badge bounce animation. */
  addedTick: number;

  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addedTick: 0,

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === product.id);
          const items = existing
            ? state.items.map((i) =>
                i.productId === product.id
                  ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + quantity) }
                  : i,
              )
            : [
                ...state.items,
                {
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  size: product.size,
                  image: product.images[0].src,
                  quantity: Math.min(MAX_QTY, quantity),
                },
              ];
          return { items, addedTick: state.addedTick + 1 };
        }),

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),

      setQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) =>
                  i.productId === productId ? { ...i, quantity: Math.min(MAX_QTY, quantity) } : i,
                ),
        })),

      clear: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: "subhadra-cart",
      storage: createJSONStorage(() => localStorage),
      // Only persist the items — never reopen the drawer on reload.
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

/* ---------- Derived selectors ---------- */

export const selectCount = (s: CartState) => s.items.reduce((n, i) => n + i.quantity, 0);
export const selectSubtotal = (s: CartState) =>
  s.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

export const FREE_SHIPPING_THRESHOLD = 999;
export const SHIPPING_FEE = 79;
export const MAX_ITEM_QTY = MAX_QTY;
