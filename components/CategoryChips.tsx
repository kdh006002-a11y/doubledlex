"use client";

import type { Category } from "@/lib/types";
import { CATEGORIES, CATEGORY_EMOJI } from "@/lib/products";

export function CategoryChips({
  active,
  onChange,
}: {
  active: Category | "전체";
  onChange: (c: Category | "전체") => void;
}) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      <button
        onClick={() => onChange("전체")}
        className={`chip ${active === "전체" ? "chip-active" : ""}`}
      >
        🏷️ 전체
      </button>
      {CATEGORIES.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`chip ${active === c ? "chip-active" : ""}`}
        >
          <span aria-hidden>{CATEGORY_EMOJI[c]}</span>
          {c}
        </button>
      ))}
    </div>
  );
}
