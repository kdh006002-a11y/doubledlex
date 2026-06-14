"use client";

import { useEffect, useState } from "react";
import { getPhoto } from "@/lib/idb";

/**
 * Renders a photo stored in IndexedDB by id. While loading / when missing it
 * shows an emoji fallback (used by seed listings that have no real photo).
 */
export function Photo({
  id,
  alt,
  className,
  fallback = "📦",
}: {
  id?: string;
  alt?: string;
  className?: string;
  fallback?: string;
}) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    if (!id) {
      setSrc(null);
      return;
    }
    getPhoto(id)
      .then((d) => {
        if (alive) setSrc(d ?? null);
      })
      .catch(() => {
        if (alive) setSrc(null);
      });
    return () => {
      alive = false;
    };
  }, [id]);

  if (src) {
    // Data URLs from IndexedDB — plain <img> is simpler than next/image here.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt ?? ""} className={className} />;
  }

  return (
    <div
      className={`flex items-center justify-center bg-gray-100 ${className ?? ""}`}
      aria-label={alt}
    >
      <span className="text-4xl">{fallback}</span>
    </div>
  );
}
