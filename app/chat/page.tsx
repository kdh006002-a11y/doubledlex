"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { timeAgo } from "@/lib/format";
import { getThreads, removeThread, type ChatThread } from "@/lib/chat";

export default function ChatListPage() {
  const [mounted, setMounted] = useState(false);
  const [threads, setThreads] = useState<ChatThread[]>([]);

  useEffect(() => {
    setMounted(true);
    setThreads(getThreads());
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight">채팅</h1>
      <p className="mt-1 text-sm text-ink-muted">
        판매자와 나눈 대화예요. 거래는 만나서 코인으로 바로 결제하면 끝!
      </p>

      {!mounted ? null : threads.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-[var(--line)] py-16 text-center">
          <span className="text-3xl">💬</span>
          <p className="mt-3 font-semibold">아직 채팅이 없어요</p>
          <p className="mt-1 text-sm text-ink-muted">
            마음에 드는 물건의 판매자에게 말을 걸어보세요.
          </p>
          <Link href="/" className="btn-primary mt-5 !py-2.5">
            물건 구경하기
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {threads.map((t) => {
            const last = t.messages[t.messages.length - 1];
            return (
              <li key={t.id} className="group flex items-center gap-3">
                <Link
                  href={`/chat/${t.id}`}
                  className="flex flex-1 items-center gap-3 rounded-2xl border border-[var(--line)] bg-white p-3.5 transition hover:shadow-soft"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-100 to-violetx-400/30 text-2xl">
                    {t.productEmoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-semibold">{t.sellerName}</span>
                      <span className="shrink-0 text-[11px] text-ink-muted">
                        <span suppressHydrationWarning>{timeAgo(t.updatedAt)}</span>
                      </span>
                    </div>
                    <div className="truncate text-xs text-ink-muted">{t.productTitle}</div>
                    {last && (
                      <div className="mt-0.5 truncate text-sm text-ink">
                        {last.sender === "me" ? "나: " : ""}
                        {last.text}
                      </div>
                    )}
                  </div>
                </Link>
                <button
                  onClick={() => setThreads(removeThread(t.id))}
                  className="rounded-xl px-2 py-1 text-xs text-ink-muted transition hover:bg-red-50 hover:text-red-600"
                  aria-label="채팅 나가기"
                >
                  나가기
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
