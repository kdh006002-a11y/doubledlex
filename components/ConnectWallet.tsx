"use client";

import { useEffect, useRef, useState } from "react";
import {
  useAccount,
  useBalance,
  useChainId,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { ACTIVE_CHAIN } from "@/lib/wagmi";
import { addressExplorerUrl } from "@/lib/payment";
import { shortAddress } from "@/lib/format";

export function ConnectWallet({ compact = false }: { compact?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { data: balance } = useBalance({ address });

  useEffect(() => setMounted(true), []);

  // 바깥 클릭 시 메뉴 닫기
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const wrongNetwork = isConnected && chainId !== ACTIVE_CHAIN.id;

  function handleConnect() {
    const injected =
      connectors.find((c) => c.id === "injected") ?? connectors[0];
    if (!injected) return;
    connect({ connector: injected });
  }

  // 하이드레이션 안정화: 마운트 전엔 중립 버튼만
  if (!mounted) {
    return (
      <button className="btn-primary !py-2.5 !px-4 text-sm" disabled>
        지갑 연결
      </button>
    );
  }

  if (!isConnected) {
    const noWallet = !!error && /not found|provider/i.test(error.message);
    return (
      <div className="flex flex-col items-end">
        <button
          onClick={handleConnect}
          disabled={isPending}
          className="btn-primary !py-2.5 !px-4 text-sm"
        >
          <WalletIcon />
          {isPending ? "연결 중…" : "지갑 연결"}
        </button>
        {noWallet && (
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noreferrer"
            className="mt-1 text-xs text-brand-600 hover:underline"
          >
            메타마스크 설치하기 ↗
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <div className="flex items-center gap-2">
        {wrongNetwork && (
          <button
            onClick={() => switchChain({ chainId: ACTIVE_CHAIN.id })}
            className="rounded-2xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 ring-1 ring-red-200 transition hover:bg-red-100"
          >
            ⚠ {ACTIVE_CHAIN.name} 전환
          </button>
        )}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-2xl border border-[var(--line)] bg-white px-3 py-2 text-sm font-semibold transition hover:bg-brand-50"
        >
          <span className="h-2 w-2 rounded-full bg-mint-500 shadow-[0_0_0_3px_rgba(16,201,154,0.18)]" />
          {!compact && balance && (
            <span className="tabular-nums text-ink-muted">
              {Number(balance.formatted).toFixed(3)} {balance.symbol}
            </span>
          )}
          <span className="tabular-nums">{shortAddress(address)}</span>
        </button>
      </div>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-60 animate-fade-up rounded-2xl border border-[var(--line)] bg-white p-2 shadow-card">
          <div className="px-3 py-2">
            <div className="text-xs text-ink-muted">연결된 지갑</div>
            <div className="mt-0.5 font-semibold tabular-nums">
              {shortAddress(address)}
            </div>
            {balance && (
              <div className="mt-0.5 text-sm text-ink-muted tabular-nums">
                {Number(balance.formatted).toFixed(4)} {balance.symbol}
              </div>
            )}
          </div>
          <div className="my-1 h-px bg-[var(--line)]" />
          <a
            href={addressExplorerUrl(address!)}
            target="_blank"
            rel="noreferrer"
            className="block rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-brand-50"
          >
            Etherscan에서 보기 ↗
          </a>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(address ?? "");
              setOpen(false);
            }}
            className="block w-full rounded-xl px-3 py-2 text-left text-sm font-medium transition hover:bg-brand-50"
          >
            주소 복사
          </button>
          <button
            onClick={() => {
              disconnect();
              setOpen(false);
            }}
            className="block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            연결 해제
          </button>
        </div>
      )}
    </div>
  );
}

function WalletIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 7.5A2.5 2.5 0 0 1 5.5 5H17a2 2 0 0 1 2 2v1H6a1 1 0 0 0 0 2h13a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5.5A2.5 2.5 0 0 1 3 17.5v-10Z"
        fill="currentColor"
      />
      <circle cx="16" cy="14" r="1.4" fill="#FF6B1A" />
    </svg>
  );
}
