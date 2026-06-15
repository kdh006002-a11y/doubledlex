import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--line)] py-20 text-center">
        <span className="text-4xl">🔍</span>
        <p className="mt-3 font-semibold text-ink">조건에 맞는 상품이 없어요</p>
        <p className="mt-1 text-sm text-ink-muted">
          다른 카테고리나 검색어로 찾아보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
