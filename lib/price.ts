import type { TokenSymbol } from "./tokens";

/**
 * 목업 환율 (1 토큰 = ? 원).
 * 실제 서비스에서는 Chainlink 등 가격 오라클로 교체할 지점.
 */
export const KRW_PER_TOKEN: Record<TokenSymbol, number> = {
  ETH: 4_800_000,
  USDC: 1_400,
};

/** 원화 → 해당 토큰 수량 */
export function krwToToken(krw: number, symbol: TokenSymbol): number {
  return krw / KRW_PER_TOKEN[symbol];
}

/** 토큰 수량 → 원화 */
export function tokenToKrw(amount: number, symbol: TokenSymbol): number {
  return amount * KRW_PER_TOKEN[symbol];
}

/**
 * 거래소(업비트/빗썸 등)로 출금했을 때 발생했을 비용 추정.
 * - 거래소 거래/스프레드 수수료 ~0.5% + 원화 출금/송금 처리 비용을 단순 모델링.
 * 더블디럭스에서 코인을 그대로 쓰면 이 비용이 사라진다는 걸 보여주기 위한 비교용.
 */
export function estimatedExchangeCostKrw(krw: number): number {
  const tradingFee = krw * 0.005; // 매도/스프레드 약 0.5%
  const withdrawFlat = 1000; // 원화 출금 처리 비용(단순화)
  return Math.round(tradingFee + withdrawFlat);
}
