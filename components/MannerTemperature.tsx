import { mannerTone } from "@/lib/profile";

/**
 * 매너온도 게이지 — 당근마켓 시그니처.
 * 36.5°C에서 시작해서 좋은 거래 평가가 쌓이면 올라간다.
 */
export function MannerTemperature({
  temp,
  size = "md",
}: {
  temp: number;
  size?: "sm" | "md";
}) {
  const { label, emoji, ratio } = mannerTone(temp);
  const compact = size === "sm";

  return (
    <div className={compact ? "w-32" : "w-full max-w-xs"}>
      <div className="flex items-baseline justify-between">
        <span
          className={`tnum font-extrabold text-[var(--primary)] ${
            compact ? "text-sm" : "text-lg"
          }`}
        >
          {temp.toFixed(1)}°C
        </span>
        {!compact && (
          <span className="text-xs font-medium text-ink-muted">
            {emoji} {label}
          </span>
        )}
      </div>
      <div
        className={`mt-1 overflow-hidden rounded-full bg-[var(--surface-sunken)] ${
          compact ? "h-1.5" : "h-2.5"
        }`}
      >
        <div
          className="h-full rounded-full bg-brand-gradient transition-[width] duration-500"
          style={{ width: `${ratio}%` }}
        />
      </div>
      {!compact && (
        <p className="mt-1 text-[11px] text-ink-muted">
          첫 거래는 36.5°C에서 시작해요
        </p>
      )}
    </div>
  );
}
