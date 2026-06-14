import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getRelated, PRODUCTS } from "@/lib/products";
import { timeAgo, shortAddress } from "@/lib/format";
import { ProductImage } from "@/components/ProductImage";
import { ProductCard } from "@/components/ProductCard";
import { PriceTag } from "@/components/PriceTag";
import { PaymentWidget } from "@/components/PaymentWidget";
import { FeeSavingsCard } from "@/components/FeeSavingsCard";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProduct(params.id);
  if (!product) notFound();
  const related = getRelated(product);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <nav className="mb-5 text-sm text-ink-muted">
        <Link href="/" className="hover:text-brand-600">
          홈
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink">{product.category}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* 좌측: 이미지 + 정보 */}
        <div>
          <ProductImage
            src={product.image}
            emoji={product.emoji}
            seed={product.id}
            className="aspect-square w-full rounded-3xl border border-[var(--line)] shadow-soft"
            emojiClassName="text-[120px]"
          />

          {/* 판매자 */}
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-white p-4">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-brand-gradient text-lg font-bold text-white">
              {product.sellerName.slice(0, 1)}
            </div>
            <div className="flex-1">
              <div className="font-semibold">{product.sellerName}</div>
              <div className="text-xs text-ink-muted tabular-nums">
                {shortAddress(product.sellerAddress)} · {product.location}
              </div>
            </div>
            <span className="rounded-full bg-mint-500/10 px-3 py-1 text-xs font-semibold text-mint-700">
              ⚡ 코인 수령
            </span>
          </div>

          {/* 설명 */}
          <div className="mt-6">
            <h2 className="text-sm font-bold text-ink-muted">상품 설명</h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-ink">
              {product.description}
            </p>
          </div>
        </div>

        {/* 우측: 요약 + 결제 위젯 + 절약 */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-2 text-xs font-medium text-ink-muted">
              {product.category} · {product.condition} ·{" "}
              <span suppressHydrationWarning>{timeAgo(product.createdAt)}</span>
            </span>
            <h1 className="text-2xl font-extrabold leading-snug tracking-tight">
              {product.title}
            </h1>
            <div className="pt-2">
              <PriceTag krw={product.priceKrw} size="lg" />
            </div>
            <div className="flex items-center gap-4 pt-2 text-sm text-ink-muted">
              <span>♡ 관심 {product.likes}</span>
              <span>💬 채팅 {product.chats}</span>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <PaymentWidget product={product} />
            <FeeSavingsCard krw={product.priceKrw} />
          </div>
        </div>
      </div>

      {/* 관련 상품 */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-extrabold tracking-tight">
            이런 상품은 어때요?
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
