import Link from "next/link";

/**
 * 더블디럭스 로고 — 포레스트 그린 그라데이션 라운드 사각형 위에
 * 겹친 두 개의 흰 원("Double"). claude.ai/design의 새 브랜드마크와 일치.
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
        <linearGradient
          id="dd-grad"
          x1="6"
          y1="6"
          x2="42"
          y2="42"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2F8159" />
          <stop offset="1" stopColor="#14563A" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="42" height="42" rx="13" fill="url(#dd-grad)" />
      <circle
        cx="20"
        cy="26"
        r="8.5"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        opacity="0.55"
      />
      <circle cx="29" cy="26" r="8.5" fill="none" stroke="#fff" strokeWidth="3" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <LogoMark size={30} />
      <span className="text-[18px] font-bold tracking-tight text-ink">
        더블디럭스
      </span>
    </Link>
  );
}
