"use client";

import { useState } from "react";
import { PRODUCTS, CATEGORIES } from "@/lib/products";
import { ProductCard } from "./ProductCard";

export function ProductGrid() {
  const [cat, setCat] = useState("전체");
  const items =
    cat === "전체" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat);

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              cat === c
                ? "border-brand bg-brand text-white"
                : "border-gray-300 bg-white text-gray-700 hover:border-brand"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
