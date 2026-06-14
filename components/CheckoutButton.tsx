"use client";

import { useState } from "react";
import { parseUnits, type Address } from "viem";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import {
  ADDRESSES,
  BTC_DECIMALS,
  FEE_TIERS,
  buildExactOutputParams,
  erc20Abi,
  quoterAbi,
  swapRouterAbi,
  tokenAddress,
  withSlippage,
  type PayToken,
} from "@/lib/payment";

type Status =
  | { kind: "idle" }
  | { kind: "working"; msg: string }
  | { kind: "done"; hash: string }
  | { kind: "error"; msg: string };

export function CheckoutButton({
  totalBtc,
  payToken,
  onSuccess,
  recipient,
  label,
}: {
  totalBtc: number;
  payToken: PayToken;
  onSuccess: () => void;
  /** Who receives the BTC. Defaults to the configured merchant address. */
  recipient?: Address;
  /** Override the idle button label. */
  label?: string;
}) {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const payee = recipient ?? ADDRESSES.merchant;

  async function pay() {
    if (!address || !publicClient) return;
    // Price → on-chain BTC amount (8 decimals, like Bitcoin).
    const amountOut = parseUnits(totalBtc.toFixed(BTC_DECIMALS), BTC_DECIMALS);

    try {
      if (payToken === "BTC") {
        // Path 1: buyer already holds BTC -> straight ERC20 transfer.
        setStatus({ kind: "working", msg: "BTC 전송 중…" });
        const hash = await writeContractAsync({
          address: ADDRESSES.btc,
          abi: erc20Abi,
          functionName: "transfer",
          args: [payee, amountOut],
        });
        await publicClient.waitForTransactionReceipt({ hash });
        finish(hash);
        return;
      }

      // Path 2: buyer pays in WETH/USDC -> Uniswap exactOutputSingle.
      const tokenIn = tokenAddress(payToken);
      const fee = FEE_TIERS.MEDIUM;

      // 1) Quote how much tokenIn is needed for the exact BTC output.
      setStatus({ kind: "working", msg: "Uniswap 가격 조회 중…" });
      const quote = (await publicClient.readContract({
        address: ADDRESSES.quoter,
        abi: quoterAbi,
        functionName: "quoteExactOutputSingle",
        args: [
          {
            tokenIn,
            tokenOut: ADDRESSES.btc,
            amount: amountOut,
            fee,
            sqrtPriceLimitX96: 0n,
          },
        ],
      })) as readonly [bigint, bigint, number, bigint];
      const amountInMaximum = withSlippage(quote[0]);

      // 2) Approve the router to pull tokenIn.
      setStatus({ kind: "working", msg: `${payToken} 사용 승인 중…` });
      const approveHash = await writeContractAsync({
        address: tokenIn,
        abi: erc20Abi,
        functionName: "approve",
        args: [ADDRESSES.swapRouter, amountInMaximum],
      });
      await publicClient.waitForTransactionReceipt({ hash: approveHash });

      // 3) Swap exact BTC out, delivered straight to the merchant.
      setStatus({ kind: "working", msg: "BTC로 스왑 후 결제 중…" });
      const params = buildExactOutputParams({
        tokenIn,
        amountOutBtc: amountOut,
        amountInMaximum,
        recipient: payee,
        fee,
      });
      const swapHash = await writeContractAsync({
        address: ADDRESSES.swapRouter,
        abi: swapRouterAbi,
        functionName: "exactOutputSingle",
        args: [params],
      });
      await publicClient.waitForTransactionReceipt({ hash: swapHash });
      finish(swapHash);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "결제 실패";
      setStatus({ kind: "error", msg: msg.split("\n")[0].slice(0, 140) });
    }
  }

  function finish(hash: string) {
    setStatus({ kind: "done", hash });
    onSuccess();
  }

  if (!isConnected) {
    return (
      <div className="rounded-md bg-gray-100 py-3 text-center text-sm text-gray-500">
        결제하려면 지갑을 연결하세요
      </div>
    );
  }

  if (status.kind === "done") {
    return (
      <div className="rounded-md bg-green-50 p-3 text-center text-sm text-green-700">
        ✅ 결제 완료!
        <br />
        <span className="break-all text-xs text-green-600">{status.hash}</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        disabled={status.kind === "working"}
        onClick={pay}
        className="w-full rounded-md bg-btc py-3 font-bold text-white transition hover:brightness-95 disabled:opacity-60"
      >
        {status.kind === "working"
          ? status.msg
          : label ?? `₿ ${totalBtc.toFixed(8)} 결제하기`}
      </button>
      {status.kind === "error" && (
        <p className="text-xs text-red-500">{status.msg}</p>
      )}
    </div>
  );
}
