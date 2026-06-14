import Link from "next/link";
import type { Product } from "@/lib/types";
import { timeAgo } from "@/lib/format";
import { ProductImage } from "./ProductImage";
import { PriceTag } from "./PriceTag";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-[var(--line)] bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-card"
    >
      <div className="relative aspect-square">
        <ProductImage
          src={product.image}
          emoji={product.emoji}
          seed={product.id}
          className="h-full w-full transition duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          {product.condition}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-[11px] font-medium text-ink-muted">
          {product.location} ·{" "}
          <span suppressHydrationWarning>{timeAgo(product.createdAt)}</span>
        </span>
        <h3 className="mt-1 line-clamp-2 min-h-[2.6em] text-sm font-semibold leading-snug text-ink">
          {product.title}
        </h3>

        <div className="mt-auto pt-3">
          <PriceTag krw={product.priceKrw} size="md" />
        </div>

        <div className="mt-3 flex items-center gap-3 border-t border-[var(--line)] pt-3 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1">♡ {product.likes}</span>
          <span className="inline-flex items-center gap-1">💬 {product.chats}</span>
        </div>
      </div>
    </Link>
  );
}
