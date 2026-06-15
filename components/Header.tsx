"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { ConnectWallet } from "./ConnectWallet";

const NAV = [
  { href: "/", label: "홈" },
  { href: "/map", label: "내 근처" },
  { href: "/chat", label: "채팅" },
  { href: "/sell", label: "판매하기" },
  { href: "/me", label: "내 지갑" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Logo />

        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-ink-muted hover:bg-brand-50/60 hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2">
          <Link
            href="/profile"
            className="hidden btn-ghost !py-2.5 !px-3 text-sm md:inline-flex"
            aria-label="내 프로필"
          >
            🥕 프로필
          </Link>
          <Link
            href="/sell"
            className="hidden btn-ghost !py-2.5 !px-4 text-sm sm:inline-flex"
          >
            + 내 물건 팔기
          </Link>
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
}
