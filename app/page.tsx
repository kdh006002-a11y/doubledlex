"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useListings } from "@/lib/listingStore";
import { useMyProfile } from "@/lib/profileStore";
import { useMounted } from "@/lib/useMounted";
import { CATEGORIES, DEFAULT_CENTER } from "@/lib/seed";
import { ListingCard } from "@/components/ListingCard";
import { MapView, type MapMarker } from "@/components/MapView";
import { distanceKm, distanceLabel } from "@/lib/geo";

export default function Home() {
  const mounted = useMounted();
  const router = useRouter();
  const listings = useListings((s) => s.listings);
  const ensureSeed = useListings((s) => s.ensureSeed);
  const { profile } = useMyProfile();

  const [cat, setCat] = useState<string>("전체");
  const [q, setQ] = useState("");
  const [view, setView] = useState<"list" | "map">("list");

  useEffect(() => {
    ensureSeed();
  }, [ensureSeed]);

  const center = profile?.location ?? DEFAULT_CENTER;

  const filtered = useMemo(() => {
    let arr = [...listings];
    if (cat !== "전체") arr = arr.filter((l) => l.category === cat);
    const k = q.trim().toLowerCase();
    if (k) {
      arr = arr.filter(
        (l) =>
          l.title.toLowerCase().includes(k) ||
          l.description.toLowerCase().includes(k)
      );
    }
    arr.sort((a, b) => b.bumpedAt - a.bumpedAt);
    return arr;
  }, [listings, cat, q]);

  const markers: MapMarker[] = useMemo(
    () =>
      filtered.map((l) => ({
        id: l.id,
        lat: l.location.lat,
        lng: l.location.lng,
        emoji: l.emoji ?? "🥕",
        label: `${l.title} · ₿${l.priceBtc}`,
      })),
    [filtered]
  );

  if (!mounted) {
    return (
      <div className="py-20 text-center text-sm text-gray-400">불러오는 중…</div>
    );
  }

  return (
    <div className="relative">
      {/* 동네 표시 */}
      <div className="mb-3 flex items-center justify-between">
        <Link href="/profile" className="flex items-center gap-1 text-lg font-bold">
          📍 {profile?.neighborhood ?? "동네 설정하기"}
          <span className="text-gray-400">▾</span>
        </Link>
        <button
          onClick={() => setView((v) => (v === "list" ? "map" : "list"))}
          className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600"
        >
          {view === "list" ? "🗺️ 지도로 보기" : "📋 목록으로 보기"}
        </button>
      </div>

      {/* 검색 */}
      <div className="mb-3 flex items-center rounded-full border border-gray-200 bg-white px-4 py-2">
        <span className="text-gray-400">🔍</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="동네 물건을 검색해보세요"
          className="w-full bg-transparent px-2 text-sm outline-none"
        />
      </div>

      {/* 카테고리 */}
      <div className="mb-2 flex gap-2 overflow-x-auto pb-2">
        {["전체", ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-sm transition ${
              cat === c
                ? "border-brand bg-brand text-white"
                : "border-gray-300 bg-white text-gray-700 hover:border-brand"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {view === "map" ? (
        <MapView
          center={center}
          markers={markers}
          height={480}
          zoom={14}
          onMarkerClick={(id) => router.push(`/listing/${id}`)}
        />
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-sm text-gray-400">
          조건에 맞는 물건이 없어요.
        </div>
      ) : (
        <ul>
          {filtered.map((l) => (
            <li key={l.id}>
              <ListingCard
                listing={l}
                distance={
                  profile ? distanceLabel(distanceKm(center, l.location)) : undefined
                }
              />
            </li>
          ))}
        </ul>
      )}

      {/* 글쓰기 FAB */}
      <Link
        href="/new"
        className="fixed bottom-20 right-4 z-30 flex items-center gap-1 rounded-full bg-brand px-5 py-3 font-bold text-white shadow-lg md:bottom-8"
      >
        ➕ 글쓰기
      </Link>
    </div>
  );
}
