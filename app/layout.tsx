import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "BTC 당근 — 동네 비트코인 중고거래",
  description:
    "당근마켓 스타일 동네 중고거래 데모. 지갑으로 로그인하고, 사진 올려 글쓰고, 채팅하고, 지도로 거래 위치를 확인하세요. 결제는 BTC.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <Header />
          <main className="mx-auto w-full max-w-[1180px] px-4 py-6 pb-24 md:pb-6">
            {children}
          </main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
