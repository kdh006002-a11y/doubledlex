"use client";

import { useState } from "react";

const GRADIENTS = [
  "from-[#FFD9C2] via-[#FFB78F] to-[#FF8A5B]",
  "from-[#E6DEFF] via-[#C9B8FF] to-[#9B8CFF]",
  "from-[#CFEFE6] via-[#9FE3CF] to-[#5FD0B0]",
  "from-[#FFE0E9] via-[#FFB7CC] to-[#FF8FB0]",
  "from-[#FFF0C2] via-[#FFD98F] to-[#FFBE5B]",
  "from-[#D6E4FF] via-[#A9C4FF] to-[#7C9DFF]",
];

function hash(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * 상품 이미지. 원격 URL이 있으면 표시하고, 없거나 로드 실패 시
 * 카테고리 이모지 + 그라데이션으로 우아하게 폴백한다.
 */
export function ProductImage({
  src,
  emoji,
  seed,
  className = "",
  emojiClassName = "text-6xl",
}: {
  src?: string;
  emoji: string;
  seed: string;
  className?: string;
  emojiClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImg = src && !failed;
  const gradient = GRADIENTS[hash(seed) % GRADIENTS.length];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}
        >
          <span className={`drop-shadow-sm ${emojiClassName}`}>{emoji}</span>
        </div>
      )}
    </div>
  );
}
