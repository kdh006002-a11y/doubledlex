import Link from "next/link";

/**
 * 더블디럭스 로고 — 직접 제작한 SVG.
 * 두 개의 겹친 다이아몬드(=Double Deluxe)에 당근 오렌지→크립토 보라 그라데이션.
 */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="dd-grad" x1="4" y1="6" x2="44" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B1A" />
          <stop offset="0.45" stopColor="#FF8443" />
          <stop offset="1" stopColor="#7C5CFF" />
        </linearGradient>
      </defs>
      {/* 뒤 다이아몬드 */}
      <rect
        x="24"
        y="3"
        width="22"
        height="22"
        rx="6"
        transform="rotate(45 24 3)"
        fill="url(#dd-grad)"
        opacity="0.28"
      />
      {/* 앞 다이아몬드 */}
      <rect
        x="24"
        y="9"
        width="22"
        height="22"
        rx="6"
        transform="rotate(45 24 9)"
        fill="url(#dd-grad)"
      />
      {/* 중앙 D 모노그램 (코인 슬릿 느낌) */}
      <rect x="21.5" y="20" width="3" height="11" rx="1.5" fill="white" />
      <path
        d="M26 20.5c3.6 0 6 2.2 6 5.5s-2.4 5.5-6 5.5"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <LogoMark size={32} />
      <span className="text-[19px] font-extrabold tracking-tight">
        더블<span className="text-gradient">디럭스</span>
      </span>
    </Link>
  );
}
