"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useMyProfile, useProfiles } from "@/lib/profileStore";
import { useListings } from "@/lib/listingStore";
import { useMounted } from "@/lib/useMounted";
import { MapPicker } from "@/components/MapPicker";
import { MannerTemp } from "@/components/MannerTemp";
import { ListingCard } from "@/components/ListingCard";
import { DEFAULT_CENTER } from "@/lib/seed";
import type { LatLng } from "@/lib/types";

const AVATARS = ["🥕", "🐰", "🐱", "🐶", "🦊", "🐻", "🐼", "🐧", "🦁", "🐸"];

export default function ProfilePage() {
  const mounted = useMounted();
  const { address, isConnected, profile } = useMyProfile();
  const upsert = useProfiles((s) => s.upsert);
  const listings = useListings((s) => s.listings);

  const [nickname, setNickname] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [location, setLocation] = useState<LatLng | null>(null);
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [saved, setSaved] = useState(false);

  // Load existing profile into the form.
  useEffect(() => {
    if (profile) {
      setNickname(profile.nickname);
      setNeighborhood(profile.neighborhood);
      setLocation(profile.location);
      setAvatar(profile.avatar);
    }
  }, [profile]);

  if (!mounted) {
    return <div className="py-20 text-center text-sm text-gray-400">불러오는 중…</div>;
  }

  if (!isConnected || !address) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="mb-4 text-2xl">🥕</p>
        <p className="mb-1 font-bold">지갑으로 로그인하세요</p>
        <p className="mb-5 text-sm text-gray-500">
          이 데모에서는 지갑 주소가 곧 계정이에요.
        </p>
        <div className="flex justify-center">
          <ConnectButton showBalance={false} />
        </div>
      </div>
    );
  }

  const myListings = listings.filter(
    (l) => l.sellerAddress === address.toLowerCase()
  );

  function save() {
    if (!address) return;
    if (!nickname.trim()) {
      alert("닉네임을 입력해 주세요");
      return;
    }
    if (!location) {
      alert("지도에서 내 동네 위치를 선택해 주세요");
      return;
    }
    upsert({
      address,
      nickname: nickname.trim(),
      neighborhood: neighborhood.trim() || "우리동네",
      location,
      avatar,
      mannerTemp: profile?.mannerTemp ?? 36.5,
      createdAt: profile?.createdAt ?? Date.now(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">나의 당근</h1>

      <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-3xl">
            {avatar}
          </div>
          <div>
            <p className="font-bold">{profile?.nickname ?? "프로필을 만들어주세요"}</p>
            <p className="text-xs text-gray-400">
              {address.slice(0, 6)}…{address.slice(-4)}
            </p>
            <MannerTemp temp={profile?.mannerTemp ?? 36.5} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">아바타</label>
          <div className="flex flex-wrap gap-2">
            {AVATARS.map((a) => (
              <button
                key={a}
                onClick={() => setAvatar(a)}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-xl ${
                  avatar === a ? "bg-brand/15 ring-2 ring-brand" : "bg-gray-50"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">닉네임</label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="예: 역삼동주민"
            maxLength={20}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand"
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
          <label className="mb-1 block text-sm font-medium">내 동네 위치</label>
          <MapPicker
            value={location}
            onChange={setLocation}
            defaultCenter={DEFAULT_CENTER}
          />
        </div>

        <button
          onClick={save}
          className="w-full rounded-lg bg-brand py-3 font-bold text-white transition hover:bg-brand-dark"
        >
          {saved ? "✅ 저장됐어요" : profile ? "프로필 저장" : "프로필 만들기"}
        </button>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-bold">나의 판매내역 ({myListings.length})</h2>
          <Link href="/new" className="text-sm font-medium text-brand">
            + 글쓰기
          </Link>
        </div>
        {myListings.length === 0 ? (
          <p className="rounded-xl border border-gray-200 bg-white py-10 text-center text-sm text-gray-400">
            아직 등록한 물건이 없어요.
          </p>
        ) : (
          <ul className="rounded-xl border border-gray-200 bg-white px-4">
            {myListings.map((l) => (
              <li key={l.id}>
                <ListingCard listing={l} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
