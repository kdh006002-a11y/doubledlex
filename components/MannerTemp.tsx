/** 당근마켓 "매너온도" badge. */
export function MannerTemp({ temp }: { temp: number }) {
  const color =
    temp >= 50
      ? "text-red-500"
      : temp >= 40
      ? "text-orange-500"
      : temp >= 30
      ? "text-green-600"
      : "text-blue-500";
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-bold ${color}`}
      title="매너온도"
    >
      🌡️ {temp.toFixed(1)}°C
    </span>
  );
}
