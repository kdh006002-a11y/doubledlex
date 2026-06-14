"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex w-full max-w-[1180px] items-center gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-1 text-2xl font-extrabold">
          <span className="text-brand">BTC</span>
          <span className="text-gray-900">당근</span>
          <span className="ml-0.5 text-btc">🥕</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-4 text-sm font-medium text-gray-600 md:flex">
          <Link href="/" className="hover:text-brand">
            홈
          </Link>
          <Link href="/new" className="hover:text-brand">
            글쓰기
          </Link>
          <Link href="/chat" className="hover:text-brand">
            채팅
          </Link>
          <Link href="/profile" className="hover:text-brand">
            나의 당근
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <ConnectButton
            showBalance={false}
            accountStatus="avatar"
            chainStatus="icon"
          />
        </div>
      </div>
    </header>
  );
}
