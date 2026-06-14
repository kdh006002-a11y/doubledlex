"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./products";

export type CartLine = {
  product: Product;
  qty: number;
};

type CartState = {
  lines: Record<string, CartLine>;
  isOpen: boolean;
  add: (product: Product) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: {},
      isOpen: false,
      add: (product) =>
        set((s) => {
          const existing = s.lines[product.id];
          return {
            lines: {
              ...s.lines,
              [product.id]: {
                product,
                qty: existing ? existing.qty + 1 : 1,
              },
            },
          };
        }),
      remove: (id) =>
        set((s) => {
          const next = { ...s.lines };
          delete next[id];
          return { lines: next };
        }),
      setQty: (id, qty) =>
        set((s) => {
          if (qty <= 0) {
            const next = { ...s.lines };
            delete next[id];
            return { lines: next };
          }
          const line = s.lines[id];
          if (!line) return s;
          return { lines: { ...s.lines, [id]: { ...line, qty } } };
        }),
      clear: () => set({ lines: {} }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
    }),
    { name: "btc-coupang-cart" }
  )
);

// Derived helpers (call with the lines map).
export function cartCount(lines: Record<string, CartLine>): number {
  return Object.values(lines).reduce((n, l) => n + l.qty, 0);
}

export function cartTotalBtc(lines: Record<string, CartLine>): number {
  return Object.values(lines).reduce(
    (sum, l) => sum + l.product.priceBtc * l.qty,
    0
  );
}
