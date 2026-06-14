"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useListing, useListings } from "@/lib/listingStore";
import { useMyProfile, useProfiles } from "@/lib/profileStore";
import { useChat } from "@/lib/chatStore";
import { useMounted } from "@/lib/useMounted";
import { deletePhoto } from "@/lib/idb";
import { Photo } from "@/components/Photo";
import { MapView } from "@/components/MapView";
import { MannerTemp } from "@/components/MannerTemp";
import { CheckoutButton } from "@/components/CheckoutButton";
import { timeAgo } from "@/lib/time";
import type { ListingStatus } from "@/lib/types";
import type { PayToken } from "@/lib/payment";

const PAY_TOKENS: { id: PayToken; label: string }[] = [
  { id: "BTC", label: "BTC 직접" },
  { id: "WETH", label: "ETH로 결제" },
  { id: "USDC", label: "USDC로 결제" },
];

const STATUS_LABEL: Record<ListingStatus, string> = {
  selling: "판매중",
  reserved: "예약중",
  sold: "거래완료",
};

export default function ListingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const mounted = useMounted();
  const router = useRouter();
  const listing = useListing(params.id);

  const ensureSeed = useListings((s) => s.ensureSeed);
  const setStatus = useListings((s) => s.setStatus);
  const toggleLike = useListings((s) => s.toggleLike);
  const bump = useListings((s) => s.bump);
  const remove = useListings((s) => s.remove);

  const { address, isConnected, profile } = useMyProfile();
  const profiles = useProfiles((s) => s.profiles);
  const ensureChat = useChat((s) => s.ensure);

  const [activePhoto, setActivePhoto] = useState(0);
  const [payToken, setPayToken] = useState<PayToken>("WETH");

  useEffect(() => {
    ensureSeed();
  }, [ensureSeed]);

  if (!mounted) {
    return <div className="py-20 text-center text-sm text-gray-400">불러오는 중…</div>;
  }

  if (!listing) {
    return (
      <div className="py-20 text-center">
        <p className="mb-3 text-sm text-gray-500">존재하지 않는 글이에요.</p>
        <Link href="/" className="font-bold text-brand">
          홈으로
        </Link>
      </div>
    );
  }

  const sellerProfile = profiles[listing.sellerAddress.toLowerCase()];
  const me = address?.toLowerCase();
  const isMine = me === listing.sellerAddress.toLowerCase();
  const liked = me ? listing.likes.includes(me) : false;

  function onLike() {
    if (!address) return alert("찜하려면 지갑을 연결하세요");
    toggleLike(listing!.id, address);
  }

  function startChat() {
    if (!address) return alert("채팅하려면 지갑을 연결하세요");
    if (!profile) return router.push("/profile");
    const cid = ensureChat({
      listingId: listing!.id,
      buyerAddress: address,
      sellerAddress: listing!.sellerAddress,
    });
    router.push(`/chat?c=${encodeURIComponent(cid)}`);
  }

  async function onDelete() {
    if (!window.confirm("이 글을 삭제할까요?")) return;
    for (const pid of listing!.photoIds) await deletePhoto(pid).catch(() => {});
    remove(listing!.id);
    router.push("/");
  }

  return (
    <div className="space-y-5 pb-36 md:pb-6">
      {/* 사진 갤러리 */}
      <div>
        <div className="relative overflow-hidden rounded-xl">
          <Photo
            id={listing.photoIds[activePhoto]}
            fallback={listing.emoji ?? "📦"}
            className="h-72 w-full object-cover"
            alt={listing.title}
          />
          {listing.status !== "selling" && (
            <span className="absolute left-3 top-3 rounded-md bg-black/70 px-2 py-1 text-xs font-bold text-white">
              {STATUS_LABEL[listing.status]}
            </span>
          )}
        </div>
        {listing.photoIds.length > 1 && (
          <div className="mt-2 flex gap-2 overflow-x-auto">
            {listing.photoIds.map((pid, i) => (
              <button
                key={pid}
                onClick={() => setActivePhoto(i)}
                className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${
                  i === activePhoto ? "border-brand" : "border-transparent"
                }`}
              >
                <Photo id={pid} className="h-16 w-16 object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 판매자 */}
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-2xl">
          {sellerProfile?.avatar ?? "🥕"}
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold">
            {sellerProfile?.nickname ?? listing.sellerNickname}
          </p>
          <p className="text-xs text-gray-400">{listing.neighborhood}</p>
        </div>
        <MannerTemp temp={sellerProfile?.mannerTemp ?? 36.5} />
      </div>

      {/* 내용 */}
      <div>
        <h1 className="text-lg font-bold">{listing.title}</h1>
        <p className="mt-1 text-xs text-gray-400">
          {listing.category} · {timeAgo(listing.bumpedAt)}
        </p>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
          {listing.description || "설명이 없습니다."}
        </p>
        <p className="mt-3 text-xs text-gray-400">
          ❤️ 관심 {listing.likes.length}
        </p>
      </div>

      {/* 지도 */}
      <div>
        <p className="mb-2 text-sm font-bold">📍 거래 희망 장소 · {listing.neighborhood}</p>
        <MapView
          center={listing.location}
          markers={[
            {
              id: listing.id,
              lat: listing.location.lat,
              lng: listing.location.lng,
              emoji: listing.emoji ?? "🥕",
              label: listing.title,
            },
          ]}
          height={240}
          zoom={15}
        />
      </div>

      {/* 판매자 컨트롤 */}
      {isMine && (
        <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm font-bold">판매자 메뉴</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(STATUS_LABEL) as ListingStatus[]).map((st) => (
              <button
                key={st}
                onClick={() => setStatus(listing.id, st)}
                className={`rounded-full border px-3 py-1.5 text-xs ${
                  listing.status === st
                    ? "border-brand bg-brand text-white"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                {STATUS_LABEL[st]}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => bump(listing.id)}
              className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700"
            >
              ⬆️ 끌어올리기
            </button>
            <button
              onClick={onDelete}
              className="flex-1 rounded-lg border border-red-200 py-2 text-sm font-medium text-red-500"
            >
              삭제
            </button>
          </div>
        </div>
      )}

      {/* 구매자 결제 옵션 */}
      {!isMine && listing.status === "selling" && (
        <div className="space-y-2 rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">결제 수단</span>
            <div className="flex gap-1">
              {PAY_TOKENS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setPayToken(t.id)}
                  className={`rounded-full border px-2.5 py-1 text-xs ${
                    payToken === t.id
                      ? "border-btc bg-btc text-white"
                      : "border-gray-300 text-gray-600"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <CheckoutButton
            totalBtc={listing.priceBtc}
            payToken={payToken}
            recipient={listing.sellerAddress as `0x${string}`}
            label={`₿ ${listing.priceBtc} 판매자에게 송금`}
            onSuccess={() => setStatus(listing.id, "sold")}
          />
          {payToken !== "BTC" && isConnected && (
            <p className="text-center text-[11px] text-gray-400">
              {payToken}로 결제하면 Uniswap이 BTC로 스왑해 판매자에게 전송합니다
            </p>
          )}
        </div>
      )}

      {/* 하단 고정 바: 찜 + 가격 + 채팅 */}
      <div className="fixed inset-x-0 bottom-14 z-30 border-t border-gray-200 bg-white px-4 py-3 md:static md:bottom-auto md:rounded-xl md:border">
        <div className="mx-auto flex w-full max-w-[1180px] items-center gap-3">
          <button
            onClick={onLike}
            className="text-2xl"
            aria-label="찜하기"
          >
            {liked ? "❤️" : "🤍"}
          </button>
          <div className="flex-1">
            <p className="text-base font-bold text-btc">₿ {listing.priceBtc}</p>
          </div>
          {isMine ? (
            <Link
              href="/chat"
              className="rounded-lg bg-brand px-5 py-2.5 font-bold text-white"
            >
              채팅 목록
            </Link>
          ) : (
            <button
              onClick={startChat}
              className="rounded-lg bg-brand px-5 py-2.5 font-bold text-white"
            >
              💬 채팅하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
