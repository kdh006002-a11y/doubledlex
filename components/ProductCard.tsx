"use client";

import type { Product } from "@/lib/products";
import { useCart } from "@/lib/store";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const open = useCart((s) => s.open);

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:shadow-md">
      <div className="flex h-44 items-center justify-center bg-gray-50 text-7xl">
        {product.image}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <p className="line-clamp-2 text-sm text-gray-800">{product.name}</p>

        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-lg font-bold text-btc">
            ₿ {product.priceBtc}
          </span>
        </div>

        <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
          <span className="text-yellow-500">★ {product.rating}</span>
          <span>({product.reviews.toLocaleString()})</span>
        </div>

        {product.rocket && (
          <span className="mt-2 inline-flex w-fit items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-xs font-bold text-blue-600">
            🚀 로켓배송
          </span>
        )}

        <button
          onClick={() => {
            add(product);
            open();
          }}
          className="mt-3 rounded-md bg-brand py-2 text-sm font-bold text-white transition hover:bg-brand-dark"
        >
          담기
        </button>
      </div>
    </div>
  );
}
