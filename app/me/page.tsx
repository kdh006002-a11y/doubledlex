"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { TOKENS } from "@/lib/tokens";
import { tokenToKrw } from "@/lib/price";
import { formatKrw, shortAddress } from "@/lib/format";
import { addressExplorerUrl, erc20Abi } from "@/lib/payment";
import { ACTIVE_CHAIN } from "@/lib/wagmi";
import { getListings, removeListing, type Listing } from "@/lib/listings";
import { PriceTag } from "@/components/PriceTag";
import { ConnectWallet } from "@/components/ConnectWallet";

export default function MePage() {
  const [mounted, setMounted] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const { address, isConnected } = useAccount();

  const { data: ethBal } = useBalance({
    address,
    chainId: ACTIVE_CHAIN.id,
    query: { enabled: Boolean(address) },
  });
  const { data: usdcRaw } = useReadContract({
    address: TOKENS.USDC.address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: ACTIVE_CHAIN.id,
    query: { enabled: Boolean(address) },
  });

  useEffect(() => {
    setMounted(true);
    setListings(getListings());
  }, []);

  const ethAmount = ethBal ? Number(ethBal.formatted) : 0;
  const usdcAmount =
    usdcRaw != null
      ? Number(formatUnits(usdcRaw as bigint, TOKENS.USDC.decimals))
      : 0;
  const ethKrw = tokenToKrw(ethAmount, "ETH");
  const usdcKrw = tokenToKrw(usdcAmount, "USDC");
  const totalKrw = ethKrw + usdcKrw;

  if (mounted && !isConnected) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-brand-50 text-3xl">
          👛
        </div>
        <h1 className="mt-5 text-2xl font-extrabold">내 지갑</h1>
        <p className="mt-2 text-ink-muted">
          지갑을 연결하면 받은 코인 잔액과 판매 중인 상품을 볼 수 있어요.
        </p>
        <div className="mt-6 flex justify-center">
          <ConnectWallet />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight">내 지갑</h1>

      {/* 잔액 요약 카드 */}
      <div className="mt-6 overflow-hidden rounded-3xl bg-brand-gradient p-[1.5px] shadow-glow">
        <div className="rounded-[calc(1.5rem-1.5px)] bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                코인 잔액 합계 (환전 없이 수령)
              </div>
              <div className="mt-1 font-mono text-3xl font-semibold tracking-tight tabular-nums">
                ≈ {formatKrw(totalKrw)}
              </div>
            </div>
            {mounted && address && (
              <a
                href={addressExplorerUrl(address)}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-[var(--line)] px-3 py-2 text-sm font-semibold tabular-nums transition hover:bg-brand-50"
              >
                {shortAddress(address)} ↗
              </a>
            )}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <BalanceRow
              emoji={TOKENS.ETH.emoji}
              symbol="ETH"
              amount={mounted ? ethAmount : 0}
              krw={mounted ? ethKrw : 0}
            />
            <BalanceRow
              emoji={TOKENS.USDC.emoji}
              symbol="USDC"
              amount={mounted ? usdcAmount : 0}
              krw={mounted ? usdcKrw : 0}
            />
          </div>

          <p className="mt-4 text-xs text-ink-muted">
            거래가 완료되면 판매 대금이 이 지갑으로 바로 입금돼요. 거래소를 거친
            환전·출금이 필요 없습니다.
          </p>
        </div>
      </div>

      {/* 판매 중인 상품 */}
      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-xl font-extrabold tracking-tight">판매 중인 상품</h2>
        <Link href="/sell" className="btn-ghost !py-2 !px-4 text-sm">
          + 새로 등록
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-dashed border-[var(--line)] py-16 text-center">
          <span className="text-3xl">📦</span>
          <p className="mt-3 font-semibold">아직 등록한 상품이 없어요</p>
          <p className="mt-1 text-sm text-ink-muted">
            안 쓰는 물건을 올리고 코인으로 바로 받아보세요.
          </p>
          <Link href="/sell" className="btn-primary mt-5 !py-2.5">
            물건 팔기
          </Link>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {listings.map((l) => (
            <li
              key={l.id}
              className="flex items-center gap-4 rounded-2xl border border-[var(--line)] bg-white p-4"
            >
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-100 to-violetx-400/30 text-2xl">
                {l.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">{l.title}</div>
                <div className="text-xs text-ink-muted">
                  {l.category} · {l.condition} · {l.location}
                </div>
              </div>
              <div className="text-right">
                <PriceTag krw={l.priceKrw} size="sm" />
              </div>
              <button
                onClick={() => setListings(removeListing(l.id))}
                className="ml-1 rounded-xl px-2 py-1 text-xs text-ink-muted transition hover:bg-red-50 hover:text-red-600"
                aria-label="삭제"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BalanceRow({
  emoji,
  symbol,
  amount,
  krw,
}: {
  emoji: string;
  symbol: string;
  amount: number;
  krw: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-[#f5f3f0] px-4 py-3">
      <span className="flex items-center gap-2 font-semibold">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-sm shadow-soft">
          {emoji}
        </span>
        {symbol}
      </span>
      <span className="text-right">
        <span className="block font-mono font-semibold tabular-nums">
          {amount.toFixed(symbol === "ETH" ? 4 : 2)}
        </span>
        <span className="block font-mono text-xs text-ink-muted tabular-nums">
          ≈ {formatKrw(krw)}
        </span>
      </span>
    </div>
  );
}
