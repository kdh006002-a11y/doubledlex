import { LogoMark } from "./Logo";
import { ACTIVE_CHAIN } from "@/lib/wagmi";

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <LogoMark size={28} />
              <span className="text-lg font-extrabold">
                더블<span className="text-gradient">디럭스</span>
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              현금화 없이, 가스비·거래소 수수료 없이. 보유한 코인 그대로 우리 동네
              중고 물건을 사고팔아요. 판매자는 코인을 쉽고 저렴하게 바로 받습니다.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <FooterCol
              title="둘러보기"
              links={[
                ["홈", "/"],
                ["판매하기", "/sell"],
                ["내 지갑", "/me"],
              ]}
            />
            <FooterCol
              title="결제"
              links={[
                ["지원 코인 ETH·USDC", "#"],
                [`네트워크 ${ACTIVE_CHAIN.name}`, "#"],
                ["수수료 안내", "#"],
              ]}
            />
            <FooterCol
              title="회사"
              links={[
                ["소개", "#"],
                ["이용약관", "#"],
                ["문의", "#"],
              ]}
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-[var(--line)] pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} 더블디럭스. 데모 프로젝트.</span>
          <span>
            ⚠ 현재 <b>{ACTIVE_CHAIN.name} 테스트넷</b>에서 동작합니다 — 실제 자산이
            아닙니다.
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <div className="font-semibold text-ink">{title}</div>
      <ul className="mt-3 space-y-2">
        {links.map(([label, href]) => (
          <li key={label}>
            <a
              href={href}
              className="text-ink-muted transition hover:text-brand-600"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
