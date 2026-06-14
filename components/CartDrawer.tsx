"use client";

import { useState } from "react";
import { useCart, cartTotalBtc } from "@/lib/store";
import { CheckoutButton } from "./CheckoutButton";
import type { PayToken } from "@/lib/payment";

const PAY_TOKENS: { id: PayToken; label: string }[] = [
  { id: "BTC", label: "BTC 직접" },
  { id: "WETH", label: "ETH로 결제" },
  { id: "USDC", label: "USDC로 결제" },
];

export function CartDrawer() {
  const { lines, isOpen, close, setQty, remove, clear } = useCart();
  const [payToken, setPayToken] = useState<PayToken>("WETH");
  const items = Object.values(lines);
  const total = cartTotalBtc(lines);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={close} />

      <aside className="relative flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-bold">장바구니</h2>
          <button onClick={close} className="text-2xl text-gray-400">
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="mt-20 text-center text-sm text-gray-400">
              장바구니가 비어 있습니다
            </p>
          ) : (
            <ul className="space-y-4">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded bg-gray-50 text-3xl">
                    {product.image}
                  </div>
                  <div className="flex-1">
                    <p className="line-clamp-1 text-sm">{product.name}</p>
                    <p className="text-sm font-bold text-btc">
                      ₿ {(product.priceBtc * qty).toFixed(8)}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        onClick={() => setQty(product.id, qty - 1)}
                        className="h-6 w-6 rounded border text-sm"
                      >
                        −
                      </button>
                      <span className="text-sm">{qty}</span>
                      <button
                        onClick={() => setQty(product.id, qty + 1)}
                        className="h-6 w-6 rounded border text-sm"
                      >
                        +
                      </button>
                      <button
                        onClick={() => remove(product.id)}
                        className="ml-auto text-xs text-gray-400 underline"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-3 border-t px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">결제 수단</span>
              <div className="flex gap-1">
                {PAY_TOKENS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setPayToken(t.id)}
                    className={`rounded-full border px-2.5 py-1 text-xs ${
                      payToken === t.id
                        ? "border-btc bg-btc text-white"
                        : "border-gray-300 text-gray-600"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-base font-bold">
              <span>총 결제금액</span>
              <span className="text-btc">₿ {total.toFixed(8)}</span>
            </div>

            <CheckoutButton
              totalBtc={total}
              payToken={payToken}
              onSuccess={clear}
            />
            {payToken !== "BTC" && (
              <p className="text-center text-[11px] text-gray-400">
                {payToken}로 지불하면 Uniswap이 BTC로 스왑해 판매자에게 전송합니다
              </p>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
