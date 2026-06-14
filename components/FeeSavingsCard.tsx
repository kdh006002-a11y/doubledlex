import { estimatedExchangeCostKrw } from "@/lib/price";
import { formatKrw } from "@/lib/format";

/**
 * "거래소로 출금했다면 들었을 비용" vs "더블디럭스(가스비만)" 비교.
 * 핵심 가치(현금화 우회 + 저렴한 수령)를 숫자로 보여준다.
 */
export function FeeSavingsCard({ krw }: { krw: number }) {
  const exchangeCost = estimatedExchangeCostKrw(krw);
  // 저가 네트워크 기준 가스비를 소액으로 단순 모델링 (데모용)
  const networkGasKrw = 300;
  const saved = Math.max(exchangeCost - networkGasKrw, 0);

  return (
    <div className="card overflow-hidden">
      <div className="bg-gradient-to-br from-mint-400/15 to-violetx-400/15 px-5 py-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          이 거래로 아끼는 비용
        </div>
        <div className="mt-1 text-2xl font-extrabold text-mint-700">
          약 {formatKrw(saved)} 절약
        </div>
        <p className="mt-1 text-xs text-ink-muted">
          코인을 거래소에서 현금화하지 않고 그대로 결제할 때 기준
        </p>
      </div>

      <div className="space-y-2 p-5 text-sm">
        <Row
          label="거래소 출금 시 예상 비용"
          value={`− ${formatKrw(exchangeCost)}`}
          muted
          strike
        />
        <Row label="더블디럭스 네트워크 가스비" value={`− ${formatKrw(networkGasKrw)}`} />
        <div className="my-1 h-px bg-[var(--line)]" />
        <Row label="실질 절약" value={formatKrw(saved)} highlight />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  muted,
  strike,
  highlight,
}: {
  label: string;
  value: string;
  muted?: boolean;
  strike?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? "text-ink-muted" : "text-ink"}>{label}</span>
      <span
        className={`tabular-nums font-semibold ${
          highlight ? "text-mint-700" : muted ? "text-ink-muted" : "text-ink"
        } ${strike ? "line-through decoration-red-300" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
