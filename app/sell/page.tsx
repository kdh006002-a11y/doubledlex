"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { CATEGORIES, CATEGORY_EMOJI } from "@/lib/products";
import { addListing } from "@/lib/listings";
import type { Category, Condition } from "@/lib/types";
import { PriceTag } from "@/components/PriceTag";
import { ConnectWallet } from "@/components/ConnectWallet";

const CONDITIONS: Condition[] = ["새상품", "거의 새것", "사용감 적음", "사용감 있음"];

export default function SellPage() {
  const { address, isConnected } = useAccount();
  const [done, setDone] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("디지털기기");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState<Condition>("거의 새것");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [wallet, setWallet] = useState("");

  // 연결된 지갑 주소를 수취 주소로 기본 채움
  useEffect(() => {
    if (address && !wallet) setWallet(address);
  }, [address, wallet]);

  const priceKrw = Number(price.replace(/[^0-9]/g, "")) || 0;
  const valid = title.trim() && priceKrw > 0 && wallet.trim().length >= 6;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    addListing({
      id: `my-${Date.now()}`,
      title: title.trim(),
      priceKrw,
      category,
      condition,
      location: location.trim() || "우리 동네",
      description: description.trim(),
      emoji: CATEGORY_EMOJI[category],
      sellerAddress: wallet.trim(),
      createdAt: new Date().toISOString(),
    });
    setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-mint-500/15 text-3xl">
          ✓
        </div>
        <h1 className="mt-5 text-2xl font-extrabold">상품이 등록됐어요!</h1>
        <p className="mt-2 text-ink-muted">
          구매자가 결제하면 코인이 <b className="text-ink">{wallet.slice(0, 6)}…</b>{" "}
          지갑으로 바로 입금돼요. 환전 절차는 필요 없습니다.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/me" className="btn-primary">
            내 지갑에서 보기
          </Link>
          <button
            onClick={() => {
              setDone(false);
              setTitle("");
              setPrice("");
              setDescription("");
            }}
            className="btn-ghost"
          >
            계속 등록하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight">내 물건 팔기</h1>
      <p className="mt-2 text-ink-muted">
        등록만 해두면 구매자가 코인으로 결제하고, 판매 대금은{" "}
        <b className="text-ink">환전 없이 내 지갑으로 바로</b> 들어와요.
      </p>

      {!isConnected && (
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-brand-200 bg-brand-50 p-4">
          <span className="text-sm font-medium text-brand-800">
            지갑을 연결하면 수취 주소가 자동으로 채워져요.
          </span>
          <ConnectWallet compact />
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Field label="상품명">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예) 아이패드 프로 11인치 (M2)"
            className="dd-input"
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="카테고리">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="dd-input"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_EMOJI[c]} {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="상태">
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as Condition)}
              className="dd-input"
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="가격 (원)" hint="원화로 입력하면 코인 가격이 자동 계산돼요">
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            inputMode="numeric"
            placeholder="예) 850000"
            className="dd-input"
          />
          {priceKrw > 0 && (
            <div className="mt-2 rounded-2xl bg-[#f5f3f0] px-4 py-3">
              <span className="text-xs text-ink-muted">코인 환산 가격</span>
              <div className="mt-1">
                <PriceTag krw={priceKrw} size="md" />
              </div>
            </div>
          )}
        </Field>

        <Field label="거래 지역">
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="예) 서울 강남구 역삼동"
            className="dd-input"
          />
        </Field>

        <Field label="상품 설명">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="상품 상태, 거래 방법 등을 적어주세요."
            className="dd-input resize-none"
          />
        </Field>

        <Field label="코인 받을 지갑 주소" hint="판매 대금이 이 주소로 바로 입금돼요">
          <input
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            placeholder="0x…"
            className="dd-input font-mono text-sm"
          />
        </Field>

        <button type="submit" disabled={!valid} className="btn-primary w-full !py-3.5">
          상품 등록하기
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-ink-muted">{hint}</span>}
    </label>
  );
}
