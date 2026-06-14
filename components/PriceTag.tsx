import { formatKrw, formatToken } from "@/lib/format";
import { krwToToken } from "@/lib/price";
import { DEFAULT_TOKEN, TOKENS, type TokenSymbol } from "@/lib/tokens";

type Size = "sm" | "md" | "lg";

const KRW_SIZE: Record<Size, string> = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-3xl",
};
const COIN_SIZE: Record<Size, string> = {
  sm: "text-[11px]",
  md: "text-xs",
  lg: "text-sm",
};

/**
 * 코인 + 원화 동시 표기.
 * 기준 가치는 원화로 두고, 결제할 코인 기준 수량을 함께 보여준다.
 */
export function PriceTag({
  krw,
  symbol = DEFAULT_TOKEN,
  size = "md",
}: {
  krw: number;
  symbol?: TokenSymbol;
  size?: Size;
}) {
  const coinAmount = krwToToken(krw, symbol);
  const token = TOKENS[symbol];

  return (
    <div className="flex flex-col">
      <span className={`font-extrabold tracking-tight ${KRW_SIZE[size]}`}>
        {formatKrw(krw)}
      </span>
      <span
        className={`mt-0.5 inline-flex items-center gap-1 font-semibold text-violetx-600 ${COIN_SIZE[size]}`}
      >
        <span aria-hidden>{token.emoji}</span>
        {formatToken(coinAmount, symbol)}
      </span>
    </div>
  );
}
