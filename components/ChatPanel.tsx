"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { listConversations, useChat } from "@/lib/chatStore";
import { useListings } from "@/lib/listingStore";
import { useProfiles } from "@/lib/profileStore";
import { Photo } from "./Photo";
import { timeAgo } from "@/lib/time";
import type { Conversation } from "@/lib/types";

function shortAddr(a: string) {
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

// 데모용: 상대방(판매자/구매자) 자동 응답 메시지 풀.
const CANNED = [
  "안녕하세요! 네 가능합니다 :)",
  "넵 직거래 가능해요!",
  "지금 거래 가능하세요?",
  "혹시 시간 괜찮으시면 오늘 어떠세요?",
  "예약 걸어둘게요!",
  "감사합니다 🙏",
];

export function ChatPanel({
  myAddress,
  initialId,
}: {
  myAddress: string;
  initialId?: string;
}) {
  const conversations = useChat((s) => s.conversations);
  const send = useChat((s) => s.send);
  const listings = useListings((s) => s.listings);
  const profiles = useProfiles((s) => s.profiles);

  const list = useMemo(
    () => listConversations(conversations, myAddress),
    [conversations, myAddress]
  );

  const [selectedId, setSelectedId] = useState<string | undefined>(
    initialId ?? list[0]?.id
  );
  const selected: Conversation | undefined = selectedId
    ? conversations[selectedId]
    : undefined;

  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  // Keep a valid selection.
  useEffect(() => {
    if (!selectedId && list[0]) setSelectedId(list[0].id);
  }, [list, selectedId]);

  // Jump to a conversation requested via ?c=<id> (set after mount).
  useEffect(() => {
    if (initialId) setSelectedId(initialId);
  }, [initialId]);

  // Scroll to newest.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.messages.length, selectedId]);

  function counterpartOf(c: Conversation) {
    const me = myAddress.toLowerCase();
    return c.buyerAddress === me ? c.sellerAddress : c.buyerAddress;
  }

  function nameOf(addr: string) {
    return profiles[addr.toLowerCase()]?.nickname ?? shortAddr(addr);
  }

  function listingOf(c: Conversation) {
    return listings.find((l) => l.id === c.listingId);
  }

  function handleSend() {
    const t = text.trim();
    if (!t || !selected) return;
    send(selected.id, myAddress, t);
    setText("");

    // Demo only: simulate the other party replying once, since there is no
    // server. (Real two-party chat would need a backend — see README.)
    const other = counterpartOf(selected);
    if (other !== myAddress.toLowerCase()) {
      const reply = CANNED[Math.floor(Math.random() * CANNED.length)];
      const id = selected.id;
      setTimeout(() => useChat.getState().send(id, other, reply), 1100);
    }
  }

  if (list.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white py-20 text-center text-sm text-gray-400">
        아직 채팅이 없어요.
        <br />
        관심 있는 물건에서 <span className="font-bold text-brand">채팅하기</span>를 눌러보세요.
      </div>
    );
  }

  return (
    <div className="grid h-[70vh] grid-cols-1 overflow-hidden rounded-xl border border-gray-200 bg-white md:grid-cols-[300px_1fr]">
      {/* Conversation list */}
      <aside
        className={`overflow-y-auto border-r border-gray-100 ${
          selected ? "hidden md:block" : "block"
        }`}
      >
        {list.map((c) => {
          const other = counterpartOf(c);
          const l = listingOf(c);
          const last = c.messages[c.messages.length - 1];
          return (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`flex w-full items-center gap-3 border-b border-gray-50 px-3 py-3 text-left ${
                c.id === selectedId ? "bg-orange-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                <Photo
                  id={l?.photoIds[0]}
                  fallback={l?.emoji ?? "📦"}
                  className="h-12 w-12 object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-bold">{nameOf(other)}</span>
                  {last && (
                    <span className="shrink-0 text-[11px] text-gray-400">
                      {timeAgo(last.at)}
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-gray-500">
                  {last ? last.text : l?.title ?? "대화를 시작해 보세요"}
                </p>
              </div>
            </button>
          );
        })}
      </aside>

      {/* Chat room */}
      <section className={`flex flex-col ${selected ? "flex" : "hidden md:flex"}`}>
        {selected ? (
          <>
            <header className="flex items-center gap-2 border-b border-gray-100 px-3 py-2">
              <button
                onClick={() => setSelectedId(undefined)}
                className="text-gray-400 md:hidden"
                aria-label="뒤로"
              >
                ‹
              </button>
              <span className="text-sm font-bold">{nameOf(counterpartOf(selected))}</span>
              {listingOf(selected) && (
                <Link
                  href={`/listing/${selected.listingId}`}
                  className="ml-auto flex items-center gap-2 rounded-lg bg-gray-50 px-2 py-1 text-xs text-gray-600"
                >
                  <span className="line-clamp-1 max-w-[140px]">
                    {listingOf(selected)!.title}
                  </span>
                  <span className="font-bold text-btc">
                    ₿{listingOf(selected)!.priceBtc}
                  </span>
                </Link>
              )}
            </header>

            <div className="flex-1 space-y-2 overflow-y-auto bg-gray-50 px-3 py-3">
              {selected.messages.length === 0 && (
                <p className="mt-10 text-center text-xs text-gray-400">
                  첫 메시지를 보내보세요 👋
                </p>
              )}
              {selected.messages.map((m) => {
                const mine = m.from === myAddress.toLowerCase();
                return (
                  <div
                    key={m.id}
                    className={`flex ${mine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                        mine
                          ? "rounded-br-sm bg-brand text-white"
                          : "rounded-bl-sm bg-white text-gray-800 shadow-sm"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>

            <div className="flex items-center gap-2 border-t border-gray-100 px-3 py-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder="메시지를 입력하세요"
                className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand"
              />
              <button
                onClick={handleSend}
                disabled={!text.trim()}
                className="rounded-full bg-brand px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
              >
                전송
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
            왼쪽에서 대화를 선택하세요
          </div>
        )}
      </section>
    </div>
  );
}
