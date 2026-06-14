import Link from "next/link";
import { ACTIVE_CHAIN } from "@/lib/wagmi";

const OLD_WAY = [
  "바이낸스 수익 실현",
  "개인 지갑 전송",
  "업비트·빗썸 입금",
  "가스비 + 수수료",
  "원화 출금",
  "그제서야 소비",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--line)]">
      {/* 배경 점 그리드 + 그라데이션 글로우 */}
      <div className="pointer-events-none absolute inset-0 bg-hero-grid [background-size:22px_22px] opacity-70" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-violetx-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 top-24 h-80 w-80 rounded-full bg-brand-300/25 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        {/* 좌측 카피 */}
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
            🥕 동네 중고거래 · 암호화폐 결제
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl">
            코인을 현금으로
            <br />
            <span className="text-gradient">바꾸지 마세요.</span>
            <br />
            동네에서 바로 쓰세요.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink-muted">
            거래소를 거쳐 원화로 출금하는 번거롭고 비싼 과정은 이제 그만. 보유한
            코인 그대로 우리 동네 중고 물건을 사고, 판매자는{" "}
            <b className="text-ink">가스비·수수료 부담 없이</b> 코인을 바로 받습니다.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="#market" className="btn-primary">
              물건 구경하기
            </Link>
            <Link href="/sell" className="btn-ghost">
              + 내 물건 팔기
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="text-mint-600">✓</span> 환전 0단계
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-mint-600">✓</span> 거래소 수수료 없음
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-mint-600">✓</span> ETH·USDC 결제
            </span>
          </div>
        </div>

        {/* 우측 — 핵심 가치 시각화: 기존 경로 vs 더블디럭스 */}
        <div className="animate-fade-up [animation-delay:120ms]">
          <div className="card p-6 shadow-card">
            <div className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              코인으로 물건 사기까지
            </div>

            {/* 기존 방식 */}
            <div className="mt-4 rounded-2xl bg-[#f7f5f2] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink-muted">
                <span className="rounded-md bg-red-100 px-2 py-0.5 text-xs text-red-600">
                  기존
                </span>
                6단계 · 수수료 발생
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {OLD_WAY.map((step, i) => (
                  <span key={step} className="flex items-center gap-1.5">
                    <span className="rounded-lg bg-white px-2 py-1 text-[11px] font-medium text-ink-muted line-through decoration-red-300/70">
                      {step}
                    </span>
                    {i < OLD_WAY.length - 1 && (
                      <span className="text-ink-muted/40">→</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* 더블디럭스 */}
            <div className="mt-3 rounded-2xl bg-brand-gradient p-[1.5px] shadow-glow">
              <div className="rounded-[calc(1rem-1.5px)] bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className="rounded-md bg-mint-500/15 px-2 py-0.5 text-xs text-mint-600">
                    더블디럭스
                  </span>
                  단 1단계
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="rounded-lg bg-violetx-500/10 px-3 py-1.5 text-sm font-bold text-violetx-700">
                    Ξ 보유 코인
                  </span>
                  <span className="text-brand-500">→</span>
                  <span className="rounded-lg bg-brand-gradient px-3 py-1.5 text-sm font-bold text-white">
                    바로 결제 ✓
                  </span>
                </div>
                <p className="mt-3 text-xs text-ink-muted">
                  판매자는 {ACTIVE_CHAIN.name} 네트워크로 코인을 즉시 수령합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
