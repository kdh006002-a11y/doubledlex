"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useMyProfile } from "@/lib/profileStore";
import { useMounted } from "@/lib/useMounted";
import { ChatPanel } from "@/components/ChatPanel";

export default function ChatPage() {
  const mounted = useMounted();
  const { address, isConnected, profile } = useMyProfile();
  const [initialId, setInitialId] = useState<string | undefined>(undefined);

  // Read ?c=<conversationId> without useSearchParams (avoids the Suspense
  // requirement during build for a fully client-side page).
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("c");
    if (c) setInitialId(c);
  }, []);

  if (!mounted) {
    return <div className="py-20 text-center text-sm text-gray-400">불러오는 중…</div>;
  }

  if (!isConnected || !address) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="mb-4 font-bold">채팅을 보려면 지갑으로 로그인하세요</p>
        <div className="flex justify-center">
          <ConnectButton showBalance={false} />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="mb-2 font-bold">먼저 프로필을 만들어주세요</p>
        <Link
          href="/profile"
          className="mt-2 inline-block rounded-lg bg-brand px-5 py-2.5 font-bold text-white"
        >
          프로필 만들기
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold">채팅</h1>
      <ChatPanel myAddress={address} initialId={initialId} />
    </div>
  );
}
