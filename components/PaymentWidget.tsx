"use client";

import { useEffect, useState } from "react";
import { parseEther, parseUnits, formatUnits } from "viem";
import {
  useAccount,
  useBalance,
  useChainId,
  useConnect,
  useReadContract,
  useSendTransaction,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import type { Product } from "@/lib/types";
import { TOKEN_LIST, TOKENS, type TokenSymbol } from "@/lib/tokens";
import { krwToToken } from "@/lib/price";
import { formatKrw, formatToken, shortAddress } from "@/lib/format";
import { erc20Abi, txExplorerUrl } from "@/lib/payment";
import { ACTIVE_CHAIN } from "@/lib/wagmi";

export function PaymentWidget({ product }: { product: Product }) {
  const [mounted, setMounted] = useState(false);
  const [symbol, setSymbol] = useState<TokenSymbol>("ETH");

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connect, connectors, isPending: connecting } = useConnect();
  const { switchChain, isPending: switching } = useSwitchChain();

  const token = TOKENS[symbol];
  const amount = krwToToken(product.priceKrw, symbol);

  // wagmi v2의 useBalance는 ERC20 token 옵션을 지원하지 않는다.
  // 네이티브(ETH)는 useBalance, ERC20(USDC)는 balanceOf를 직접 읽는다.
  const native = useBalance({
    address,
    chainId: ACTIVE_CHAIN.id,
    query: { enabled: Boolean(address) && token.isNative },
  });
  const erc20 = useReadContract({
    address: token.address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: ACTIVE_CHAIN.id,
    query: { enabled: Boolean(address) && !token.isNative },
  });
  const balanceValue: bigint | undefined = token.isNative
    ? native.data?.value
    : (erc20.data as bigint | undefined);
  const balanceFormatted =
    balanceValue != null ? formatUnits(balanceValue, token.decimals) : undefined;

  // 네이티브(ETH) 송금 / ERC20 transfer 두 경로
  const send = useSendTransaction();
  const write = useWriteContract();
  const hash = token.isNative ? send.data : write.data;
  const submitting = token.isNative ? send.isPending : write.isPending;
  const submitError = token.isNative ? send.error : write.error;

  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    chainId: ACTIVE_CHAIN.id,
  });

  useEffect(() => setMounted(true), []);

  // 필요 수량(최소단위) 계산
  let required: bigint | undefined;
  try {
    required = token.isNative
      ? parseEther(amount.toFixed(18))
      : parseUnits(amount.toFixed(token.decimals), token.decimals);
  } catch {
    required = undefined;
  }

  const wrongNetwork = isConnected && chainId !== ACTIVE_CHAIN.id;
  const enough =
    balanceValue != null && required != null
      ? balanceValue >= required
      : undefined;
  const busy = submitting || confirming;

  function onSelectToken(s: TokenSymbol) {
    if (busy) return;
    send.reset();
    write.reset();
    setSymbol(s);
  }

  function onConnect() {
    const injected =
      connectors.find((c) => c.id === "injected") ?? connectors[0];
    if (injected) connect({ connector: injected });
  }

  function onPay() {
    if (required == null) return;
    if (token.isNative) {
      send.sendTransaction({ to: product.sellerAddress, value: required });
    } else {
      write.writeContract({
        address: token.address!,
        abi: erc20Abi,
        functionName: "transfer",
        args: [product.sellerAddress, required],
      });
    }
  }

  // ── 단일 액션 버튼 상태 도출 ──────────────────────────
  let label = "결제하기";
  let action: (() => void) | undefined = onPay;
  let disabled = false;
  let tone: "primary" | "muted" = "primary";

  if (!mounted) {
    label = "불러오는 중…";
    disabled = true;
  } else if (isSuccess) {
    label = "결제 완료 ✓";
    disabled = true;
  } else if (!isConnected) {
    label = connecting ? "연결 중…" : "지갑 연결하기";
    action = onConnect;
    disabled = connecting;
  } else if (wrongNetwork) {
    label = switching ? "전환 중…" : `${ACTIVE_CHAIN.name}으로 전환`;
    action = () => switchChain({ chainId: ACTIVE_CHAIN.id });
    disabled = switching;
  } else if (submitting) {
    label = "지갑에서 승인하세요…";
    disabled = true;
  } else if (confirming) {
    label = "결제 확인 중…";
    disabled = true;
  } else if (enough === false) {
    label = `${token.symbol} 잔액이 부족해요`;
    disabled = true;
    tone = "muted";
  } else {
    label = `${formatToken(amount, symbol)} 결제하기`;
  }

  return (
    <div className="card overflow-hidden p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold">코인으로 결제</h3>
        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700">
          {ACTIVE_CHAIN.name}
        </span>
      </div>

      {/* 토큰 선택 (Uniswap식 세그먼트) */}
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-[#f5f3f0] p-1">
        {TOKEN_LIST.map((t) => (
          <button
            key={t.symbol}
            onClick={() => onSelectToken(t.symbol)}
            disabled={busy}
            className={`flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold transition disabled:opacity-50 ${
              symbol === t.symbol
                ? "bg-white shadow-soft text-ink"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            <span aria-hidden>{t.emoji}</span>
            {t.symbol}
          </button>
        ))}
      </div>

      {/* 결제 금액 카드 ("You pay") */}
      <div className="mt-3 rounded-2xl border border-[var(--line)] bg-white p-4">
        <div className="flex items-center justify-between text-xs text-ink-muted">
          <span>결제 금액</span>
          {mounted && isConnected && balanceFormatted && (
            <span className="font-mono tabular-nums">
              잔액 {Number(balanceFormatted).toFixed(token.isNative ? 4 : 2)}{" "}
              {token.symbol}
            </span>
          )}
        </div>
        <div className="mt-2 flex items-end justify-between">
          <div className="font-mono text-2xl font-semibold tracking-tight tabular-nums">
            {formatToken(amount, symbol)}
          </div>
          <div className="rounded-full bg-violetx-500/10 px-3 py-1.5 text-sm font-bold text-violetx-700">
            {token.emoji} {symbol}
          </div>
        </div>
        <div className="mt-1 text-sm text-ink-muted">
          ≈ {formatKrw(product.priceKrw)}
        </div>
      </div>

      {/* 받는 사람 */}
      <div className="mt-3 flex items-center justify-between rounded-2xl bg-[#f5f3f0] px-4 py-3 text-sm">
        <span className="text-ink-muted">받는 사람 (판매자)</span>
        <span className="flex items-center gap-2 font-semibold tabular-nums">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-gradient text-[10px] text-white">
            {product.sellerName.slice(0, 1)}
          </span>
          {shortAddress(product.sellerAddress)}
        </span>
      </div>

      {/* 단일 액션 버튼 */}
      <button
        onClick={action}
        disabled={disabled}
        className={`mt-4 w-full ${
          tone === "muted" ? "btn-ghost !justify-center" : "btn-primary"
        } !py-3.5 text-base`}
      >
        {busy && <Spinner />}
        {label}
      </button>

      {/* 상태 / 결과 */}
      {submitError && !busy && (
        <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">
          {humanizeError(submitError)}
        </p>
      )}

      {hash && (
        <div
          className={`mt-3 rounded-xl px-3 py-2.5 text-xs ${
            isSuccess
              ? "bg-mint-500/10 text-mint-700"
              : "bg-violetx-500/10 text-violetx-700"
          }`}
        >
          <div className="font-semibold">
            {isSuccess ? "✓ 결제가 완료됐어요!" : "트랜잭션 전송됨 · 확인 중"}
          </div>
          <a
            href={txExplorerUrl(hash)}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-block break-all underline underline-offset-2"
          >
            Etherscan에서 보기: {shortAddress(hash)} ↗
          </a>
        </div>
      )}

      <p className="mt-3 text-center text-[11px] leading-relaxed text-ink-muted">
        구매자 지갑에서 판매자 주소로 직접 송금됩니다. 테스트넷이므로 실제 자산이
        아닙니다.
      </p>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
        opacity="0.25"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function humanizeError(error: unknown): string {
  const msg = error instanceof Error ? error.message : String(error);
  if (/User rejected|denied/i.test(msg)) return "지갑에서 요청을 거절했어요.";
  if (/insufficient funds/i.test(msg))
    return "가스비를 낼 잔액이 부족해요. 테스트넷 ETH가 필요합니다.";
  return msg.split("\n")[0].slice(0, 140);
}
