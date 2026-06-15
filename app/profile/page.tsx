"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { shortAddress } from "@/lib/format";
import { addressExplorerUrl } from "@/lib/payment";
import { getProfile, type Profile } from "@/lib/profile";
import { ConnectWallet } from "@/components/ConnectWallet";
import { ProfileForm } from "@/components/ProfileForm";
import { MannerTemperature } from "@/components/MannerTemperature";

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const [editing, setEditing] = useState(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    setMounted(true);
  }, []);

  // 지갑 주소가 바뀌면 해당 프로필을 다시 읽는다
  useEffect(() => {
    if (mounted && address) setProfile(getProfile(address));
  }, [mounted, address]);

  // 1) 마운트 전 / 지갑 미연결
  if (!mounted) {
    return <Centered>불러오는 중…</Centered>;
  }

  if (!isConnected || !address) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-brand-50 text-3xl">
          🥕
        </div>
        <h1 className="mt-5 text-2xl font-extrabold">내 프로필</h1>
        <p className="mt-2 text-ink-muted">
          지갑을 연결하면 우리 동네 프로필을 만들 수 있어요.
        </p>
        <div className="mt-6 flex justify-center">
          <ConnectWallet />
        </div>
      </div>
    );
  }

  // 2) 연결됐지만 프로필 없음 → 계정 만들기
  if (!profile || editing) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {profile ? "프로필 수정" : "계정 만들기"}
        </h1>
        <p className="mt-2 text-ink-muted">
          {profile
            ? "닉네임과 동네를 바꿀 수 있어요."
            : "닉네임과 동네를 정하면 이웃과 채팅하고 거래할 수 있어요."}
        </p>

        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-[var(--surface-sunken)] px-4 py-3 text-sm">
          <span className="text-ink-muted">연결된 지갑</span>
          <span className="tnum font-semibold">{shortAddress(address)}</span>
        </div>

        <div className="mt-8">
          <ProfileForm
            address={address}
            initial={profile}
            onSaved={(p) => {
              setProfile(p);
              setEditing(false);
            }}
            onCancel={profile ? () => setEditing(false) : undefined}
          />
        </div>
      </div>
    );
  }

  // 3) 프로필 카드
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="overflow-hidden rounded-3xl bg-brand-gradient p-[1.5px] shadow-glow">
        <div className="rounded-[calc(1.5rem-1.5px)] bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-brand-100 to-violetx-400/30 text-4xl">
              {profile.avatarEmoji}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-2xl font-extrabold tracking-tight">
                {profile.nickname}
              </h1>
              <p className="mt-0.5 text-sm text-ink-muted">📍 {profile.neighborhood}</p>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="btn-ghost !py-2 !px-4 text-sm"
            >
              수정
            </button>
          </div>

          {profile.bio && (
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink">
              {profile.bio}
            </p>
          )}

          <div className="mt-5 border-t border-[var(--line)] pt-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              매너온도
            </div>
            <div className="mt-2">
              <MannerTemperature temp={profile.mannerTemp} />
            </div>
          </div>

          {profile.badges.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {profile.badges.map((b) => (
                <span
                  key={b}
                  className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700"
                >
                  🏅 {b}
                </span>
              ))}
            </div>
          )}

          <a
            href={addressExplorerUrl(address)}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums text-ink-muted transition hover:text-brand-600"
          >
            {shortAddress(address)} ↗
          </a>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link href="/me" className="btn-ghost !justify-between">
          <span>내 지갑 · 판매 상품</span>
          <span aria-hidden>→</span>
        </Link>
        <Link href="/chat" className="btn-ghost !justify-between">
          <span>채팅 보기</span>
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center text-ink-muted sm:px-6">
      {children}
    </div>
  );
}
