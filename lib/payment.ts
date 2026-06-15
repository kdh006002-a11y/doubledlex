import { erc20Abi } from "viem";
import { ACTIVE_CHAIN } from "./wagmi";

/** viem의 표준 ERC20 ABI를 재노출 (transfer / balanceOf / decimals 포함) */
export { erc20Abi };

/** Sepolia Etherscan 트랜잭션 링크 */
export function txExplorerUrl(hash: string): string {
  const base =
    ACTIVE_CHAIN.blockExplorers?.default.url ?? "https://sepolia.etherscan.io";
  return `${base}/tx/${hash}`;
}

/** Sepolia Etherscan 주소 링크 */
export function addressExplorerUrl(address: string): string {
  const base =
    ACTIVE_CHAIN.blockExplorers?.default.url ?? "https://sepolia.etherscan.io";
  return `${base}/address/${address}`;
}

/** 결제 진행 단계 — Uniswap식 단일 버튼 상태머신 */
export type PayStage =
  | "idle"
  | "needsWallet"
  | "wrongNetwork"
  | "insufficient"
  | "ready"
  | "signing"
  | "pending"
  | "success"
  | "error";
