"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { PRODUCTS } from "@/lib/products";
import {
  DEFAULT_CENTER,
  NEIGHBORHOODS,
  coordsForLocation,
  matchNeighborhood,
} from "@/lib/geo";
import type { MapItem } from "@/components/NeighborhoodMap";
import { ProductGrid } from "@/components/ProductGrid";

// Leaflet 은 window 에 의존 → 정적 export 안전하게 클라이언트에서만 로드
const NeighborhoodMap = dynamic(() => import("@/components/NeighborhoodMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center rounded-3xl bg-[var(--surface-sunken)] text-sm text-ink-muted">
      지도를 불러오는 중…
    </div>
  ),
});

// 시드 상품에 실제로 등장하는 동네만 칩으로 노출
const PRESENT = NEIGHBORHOODS.filter((n) =>
  PRODUCTS.some((p) => p.location.includes(n.key))
);

export default function MapPage() {
  const [active, setActive] = useState<string>("전체");

  const products = useMemo(
    () =>
      active === "전체"
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.location.includes(active)),
    [active]
  );

  const items: MapItem[] = useMemo(
    () =>
      products.map((p) => {
        const c = coordsForLocation(p.location, p.id);
        return {
          id: p.id,
          title: p.title,
          emoji: p.emoji,
          priceKrw: p.priceKrw,
          location: p.location,
          lat: c.lat,
          lng: c.lng,
        };
      }),
    [products]
  );

  const { center, zoom } = useMemo(() => {
    if (active === "전체") {
      return { center: [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng] as [number, number], zoom: 11 };
    }
    const n = matchNeighborhood(active) ?? DEFAULT_CENTER;
    return { center: [n.lat, n.lng] as [number, number], zoom: 14 };
  }, [active]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">내 근처</h1>
        <p className="mt-1 text-sm text-ink-muted">
          우리 동네 이웃이 내놓은 물건을 지도에서 바로 찾아보세요.
        </p>
      </div>

      {/* 동네 선택 칩 */}
      <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        <button
          onClick={() => setActive("전체")}
          className={`chip ${active === "전체" ? "chip-active" : ""}`}
        >
          🗺️ 전체
        </button>
        {PRESENT.map((n) => (
          <button
            key={n.key}
            onClick={() => setActive(n.key)}
            className={`chip ${active === n.key ? "chip-active" : ""}`}
          >
            📍 {n.key}
          </button>
        ))}
      </div>

      {/* 지도 */}
      <div className="mt-5 h-[60vh] min-h-[360px] overflow-hidden rounded-3xl border border-[var(--line)] shadow-soft">
        <NeighborhoodMap items={items} center={center} zoom={zoom} />
      </div>

      {/* 근처 상품 */}
      <p className="mb-4 mt-8 text-sm text-ink-muted">
        근처 <b className="text-ink">{products.length}</b>개 상품
      </p>
      <ProductGrid products={products} />
    </section>
  );
}
