"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// 당근마켓식 하단 탭바 (모바일 전용). 데스크톱은 Header 네비를 사용.
const TABS = [
  { href: "/", label: "홈", icon: "🏠", match: (p: string) => p === "/" },
  { href: "/map", label: "내 근처", icon: "📍", match: (p: string) => p.startsWith("/map") },
  { href: "/chat", label: "채팅", icon: "💬", match: (p: string) => p.startsWith("/chat") },
  { href: "/profile", label: "내 프로필", icon: "🥕", match: (p: string) => p.startsWith("/profile") },
];

export function MobileTabBar() {
  const pathname = usePathname();

  // 채팅방(/chat/[id])은 자체 풀스크린 레이아웃 → 탭바 숨김
  const p = pathname.replace(/\/+$/, "");
  if (p.startsWith("/chat/")) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] glass md:hidden">
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {TABS.map((t) => {
          const active = t.match(pathname);
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition ${
                  active ? "text-[var(--primary)]" : "text-ink-muted"
                }`}
              >
                <span className="text-lg leading-none" aria-hidden>
                  {t.icon}
                </span>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
