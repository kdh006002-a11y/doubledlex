import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "더블디럭스 — 코인 그대로 쓰는 동네 중고거래",
  description:
    "현금화 없이, 가스비·거래소 수수료 없이. 보유한 코인 그대로 우리 동네 중고 물건을 사고팔아요. 판매자는 코인을 쉽고 저렴하게 바로 받습니다.",
  keywords: ["중고거래", "암호화폐", "코인결제", "더블디럭스", "당근", "web3 마켓"],
  openGraph: {
    title: "더블디럭스",
    description: "현금화 없이, 코인 그대로 쓰는 동네 중고거래 마켓",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FF6B1A",
  width: "device-width",
  initialScale: 1,
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
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
