"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useMyProfile } from "@/lib/profileStore";
import { useListings } from "@/lib/listingStore";
import { useMounted } from "@/lib/useMounted";
import { PhotoUploader } from "@/components/PhotoUploader";
import { MapPicker } from "@/components/MapPicker";
import { CATEGORIES } from "@/lib/seed";
import type { LatLng } from "@/lib/types";

export default function NewListingPage() {
  const mounted = useMounted();
  const router = useRouter();
  const { address, isConnected, profile } = useMyProfile();
  const create = useListings((s) => s.create);

  const [photoIds, setPhotoIds] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<LatLng | null>(
    profile?.location ?? null
  );
  const [neighborhood, setNeighborhood] = useState(profile?.neighborhood ?? "");
  const [submitting, setSubmitting] = useState(false);

  if (!mounted) {
    return <div className="py-20 text-center text-sm text-gray-400">불러오는 중…</div>;
  }

  if (!isConnected || !address) {
    return (
      <Gate>
        <p className="mb-4 font-bold">글을 쓰려면 지갑으로 로그인하세요</p>
        <div className="flex justify-center">
          <ConnectButton showBalance={false} />
        </div>
      </Gate>
    );
  }

  if (!profile) {
    return (
      <Gate>
        <p className="mb-2 font-bold">먼저 프로필을 만들어주세요</p>
        <p className="mb-4 text-sm text-gray-500">
          닉네임과 동네를 설정하면 글을 쓸 수 있어요.
        </p>
        <Link
          href="/profile"
          className="inline-block rounded-lg bg-brand px-5 py-2.5 font-bold text-white"
        >
          프로필 만들기
        </Link>
      </Gate>
    );
  }

  function submit() {
    if (!address || !profile) return;
    const priceBtc = Number(price);
    if (!title.trim()) return alert("제목을 입력해 주세요");
    if (!price || Number.isNaN(priceBtc) || priceBtc <= 0)
      return alert("가격(BTC)을 올바르게 입력해 주세요");
    if (!location) return alert("지도에서 거래 위치를 선택해 주세요");

    setSubmitting(true);
    const listing = create({
      sellerAddress: address,
      sellerNickname: profile.nickname,
      title: title.trim(),
      description: description.trim(),
      priceBtc,
      category,
      photoIds,
      location,
      neighborhood: neighborhood.trim() || profile.neighborhood,
    });
    router.push(`/listing/${listing.id}`);
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">내 물건 팔기</h1>

      <div>
        <label className="mb-1 block text-sm font-medium">
          사진 <span className="text-gray-400">(첫 장이 대표 이미지)</span>
        </label>
        <PhotoUploader photoIds={photoIds} onChange={setPhotoIds} max={10} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">제목</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="글 제목"
          maxLength={60}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">카테고리</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">가격 (BTC)</label>
        <div className="flex items-center rounded-lg border border-gray-200 px-3 focus-within:border-brand">
          <span className="text-btc">₿</span>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            inputMode="decimal"
            placeholder="0.0010"
            className="w-full bg-transparent px-2 py-2 text-sm outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">자세한 설명</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          placeholder="상품 상태, 거래 방법 등을 적어주세요."
          className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">동네 이름</label>
        <input
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
          placeholder="예: 역삼동"
          maxLength={20}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">거래 희망 위치</label>
        <MapPicker
          value={location}
          onChange={setLocation}
          defaultCenter={profile.location}
        />
      </div>

      <button
        onClick={submit}
        disabled={submitting}
        className="w-full rounded-lg bg-brand py-3 font-bold text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {submitting ? "등록 중…" : "작성 완료"}
      </button>
    </div>
  );
}

function Gate({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
      <p className="mb-3 text-2xl">🥕</p>
      {children}
    </div>
  );
}
