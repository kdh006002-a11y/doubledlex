"use client";

import { useMemo, useState } from "react";
import type { Category, Product } from "@/lib/types";
import { CategoryChips } from "./CategoryChips";
import { ProductGrid } from "./ProductGrid";

export function Marketplace({ products }: { products: Product[] }) {
  const [active, setActive] = useState<Category | "전체">("전체");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const byCat = active === "전체" || p.category === active;
      const q = query.trim().toLowerCase();
      const byQuery =
        q === "" ||
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q);
      return byCat && byQuery;
    });
  }, [products, active, query]);

  return (
    <section id="market" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            우리 동네 중고 거래
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            마음에 드는 물건을 코인으로 바로 결제하세요.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted">
            🔍
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="상품명·지역 검색"
            className="w-full rounded-2xl border border-[var(--line)] bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </div>

      <div className="mt-5">
        <CategoryChips active={active} onChange={setActive} />
      </div>

      <p className="mb-4 mt-4 text-sm text-ink-muted">
        총 <b className="text-ink">{filtered.length}</b>개 상품
      </p>

      <ProductGrid products={filtered} />
    </section>
  );
}
