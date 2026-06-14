const ITEMS = [
  {
    icon: "🔄",
    title: "현금화 0단계",
    desc: "거래소 매도·원화 출금 없이, 지갑에 있는 코인 그대로 결제해요. 복잡한 환전 과정을 통째로 건너뜁니다.",
    accent: "from-brand-100 to-brand-200",
  },
  {
    icon: "💸",
    title: "수수료·가스비 절약",
    desc: "거래소 매도 수수료와 출금 비용이 사라져요. 저가 네트워크로 가스비까지 아끼고, 절약한 만큼 결제 화면에서 바로 보여드려요.",
    accent: "from-mint-400/40 to-mint-500/40",
  },
  {
    icon: "⚡",
    title: "판매자 즉시 수령",
    desc: "판매자는 환전 절차 없이 코인을 자기 지갑으로 바로 받아요. 거래가 끝나면 곧장 잔액에 반영됩니다.",
    accent: "from-violetx-400/30 to-violetx-500/30",
  },
];

export function ValueProps() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {ITEMS.map((it) => (
          <div
            key={it.title}
            className="card p-6 transition hover:-translate-y-0.5 hover:shadow-card"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${it.accent} text-2xl`}
            >
              {it.icon}
            </div>
            <h3 className="mt-4 text-lg font-bold">{it.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {it.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
