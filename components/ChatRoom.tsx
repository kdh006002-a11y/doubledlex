"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import type { Product } from "@/lib/types";
import { formatKrw } from "@/lib/format";
import {
  getOrCreateThread,
  sendMessage,
  appendSellerReply,
  pickSellerReply,
  type ChatThread,
} from "@/lib/chat";
import { getProfile, sellerMannerTemp } from "@/lib/profile";
import { ConnectWallet } from "./ConnectWallet";
import { MannerTemperature } from "./MannerTemperature";

const QUICK_REPLIES = [
  "네고 가능한가요?",
  "지금 거래 가능할까요?",
  "직거래 원해요",
  "코인 결제 어떻게 하나요?",
];

function clock(iso: string): string {
  return new Date(iso).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ChatRoom({ product }: { product: Product }) {
  const [mounted, setMounted] = useState(false);
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const { address, isConnected } = useAccount();
  const hasProfile = mounted && Boolean(getProfile(address));
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // 게이트 통과 시에만 스레드 생성/로드
  useEffect(() => {
    if (mounted && isConnected && hasProfile) {
      setThread(getOrCreateThread(product));
    }
  }, [mounted, isConnected, hasProfile, product]);

  // 새 메시지마다 맨 아래로
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [thread?.messages.length, typing]);

  const mannerTemp = sellerMannerTemp(product.sellerAddress);

  function send(value: string) {
    const body = value.trim();
    if (!body) return;
    const updated = sendMessage(product.id, body);
    if (updated) setThread({ ...updated });
    setText("");
    // 판매자 자동응답 시뮬레이션 (백엔드 대체)
    setTyping(true);
    setTimeout(() => {
      const replied = appendSellerReply(product.id, pickSellerReply(body));
      if (replied) setThread({ ...replied });
      setTyping(false);
    }, 900);
  }

  // ── 게이트: 미마운트 / 지갑 미연결 / 프로필 없음 ──
  if (!mounted) {
    return <Gate>불러오는 중…</Gate>;
  }
  if (!isConnected) {
    return (
      <Gate
        title="채팅하려면 지갑을 연결하세요"
        desc="당근처럼 동네 이웃끼리 안전하게 거래하기 위해 본인 확인이 필요해요."
      >
        <ConnectWallet />
      </Gate>
    );
  }
  if (!hasProfile) {
    return (
      <Gate
        title="동네 프로필을 먼저 만들어 주세요"
        desc="닉네임과 동네를 인증해야 이웃과 채팅할 수 있어요."
      >
        <Link href="/profile" className="btn-primary">
          프로필 만들기
        </Link>
      </Gate>
    );
  }

  return (
    <div className="mx-auto -mb-16 flex h-[calc(100dvh-4rem)] max-w-2xl flex-col px-0 sm:h-[calc(100dvh-6rem)] sm:px-6 sm:py-6 md:mb-0">
      {/* 헤더 */}
      <div className="flex items-center gap-3 border-b border-[var(--line)] bg-white px-4 py-3 sm:rounded-t-3xl">
        <Link href="/chat" className="text-ink-muted transition hover:text-ink" aria-label="뒤로">
          ←
        </Link>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-gradient text-base font-bold text-white">
          {product.sellerName.slice(0, 1)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold">{product.sellerName}</div>
          <div className="text-xs text-ink-muted">📍 {product.location}</div>
        </div>
        <MannerTemperature temp={mannerTemp} size="sm" />
      </div>

      {/* 상품 요약 바 */}
      <Link
        href={`/products/${product.id}`}
        className="flex items-center gap-3 border-b border-[var(--line)] bg-[var(--surface-sunken)] px-4 py-3 transition hover:bg-brand-50"
      >
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-xl shadow-soft">
          {product.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{product.title}</div>
          <div className="tnum text-sm font-bold text-[var(--primary)]">
            {formatKrw(product.priceKrw)}
          </div>
        </div>
        <span className="rounded-full bg-mint-500/10 px-3 py-1 text-xs font-semibold text-mint-700">
          코인 결제
        </span>
      </Link>

      {/* 안전거래 가이드 */}
      <div className="bg-brand-50 px-4 py-2 text-center text-[11px] text-brand-700">
        🛡️ 직거래 시 안전한 장소에서 만나고, 결제는 만나서 코인으로 바로 진행하세요.
      </div>

      {/* 메시지 */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-[var(--bg-subtle)] px-4 py-5">
        {thread?.messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-end gap-2 ${m.sender === "me" ? "flex-row-reverse" : ""}`}
          >
            {m.sender === "seller" && (
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-gradient text-xs font-bold text-white">
                {product.sellerName.slice(0, 1)}
              </div>
            )}
            <div
              className={`max-w-[72%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                m.sender === "me"
                  ? "rounded-br-md bg-brand-gradient text-white"
                  : "rounded-bl-md border border-[var(--line)] bg-white text-ink"
              }`}
            >
              {m.text}
            </div>
            <span className="mb-0.5 shrink-0 text-[10px] text-ink-muted">{clock(m.at)}</span>
          </div>
        ))}
        {typing && (
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-gradient text-xs font-bold text-white">
              {product.sellerName.slice(0, 1)}
            </div>
            <div className="rounded-2xl rounded-bl-md border border-[var(--line)] bg-white px-3.5 py-2 text-sm text-ink-muted">
              입력 중…
            </div>
          </div>
        )}
      </div>

      {/* 빠른답변 */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto border-t border-[var(--line)] bg-white px-4 py-2.5">
        {QUICK_REPLIES.map((q) => (
          <button
            key={q}
            onClick={() => send(q)}
            className="shrink-0 rounded-full border border-[var(--line)] px-3 py-1.5 text-xs font-medium text-ink-muted transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
          >
            {q}
          </button>
        ))}
      </div>

      {/* 입력 */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(text);
        }}
        className="flex items-center gap-2 border-t border-[var(--line)] bg-white px-4 py-3 sm:rounded-b-3xl"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="메시지를 입력하세요"
          className="dd-input !py-2.5"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="btn-primary shrink-0 !px-5 !py-2.5"
        >
          전송
        </button>
      </form>
    </div>
  );
}

function Gate({
  title,
  desc,
  children,
}: {
  title?: string;
  desc?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-brand-50 text-3xl">
        💬
      </div>
      {title && <h1 className="mt-5 text-2xl font-extrabold">{title}</h1>}
      {desc && <p className="mt-2 text-ink-muted">{desc}</p>}
      {children && <div className="mt-6 flex justify-center">{children}</div>}
    </div>
  );
}
