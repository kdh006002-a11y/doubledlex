import type { TokenSymbol } from "./tokens";

/** ₩50,000 형태로 포맷 */
export function formatKrw(krw: number): string {
  return "₩" + Math.round(krw).toLocaleString("ko-KR");
}

/** 토큰 수량을 적당한 소수 자릿수로 포맷 (ETH는 4자리, USDC는 2자리) */
export function formatToken(amount: number, symbol: TokenSymbol): string {
  const digits = symbol === "ETH" ? 5 : 2;
  const fixed = amount.toFixed(digits);
  // 끝의 불필요한 0 제거
  const trimmed = fixed.replace(/\.?0+$/, "");
  return `${trimmed} ${symbol}`;
}

/** 0x1234…abcd 형태 주소 단축 */
export function shortAddress(address?: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

/** "3분 전", "2시간 전" 형태 상대 시간 */
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "방금 전";
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}일 전`;
  const week = Math.floor(day / 7);
  if (week < 5) return `${week}주 전`;
  const month = Math.floor(day / 30);
  return `${month}개월 전`;
}
