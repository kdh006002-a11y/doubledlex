"use client";

import Link from "next/link";
import type { Listing } from "@/lib/types";
import { Photo } from "./Photo";
import { timeAgo } from "@/lib/time";

export function ListingCard({
  listing,
  distance,
}: {
  listing: Listing;
  distance?: string;
}) {
  return (
    <Link
      href={`/listing/${listing.id}`}
      className="flex gap-3 border-b border-gray-100 py-3 transition hover:bg-gray-50"
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
        <Photo
          id={listing.photoIds[0]}
          fallback={listing.emoji ?? "📦"}
          className="h-24 w-24 object-cover"
          alt={listing.title}
        />
        {listing.status !== "selling" && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-xs font-bold text-white">
            {listing.status === "reserved" ? "예약중" : "거래완료"}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <p className="line-clamp-2 text-sm text-gray-900">{listing.title}</p>
        <p className="mt-0.5 text-xs text-gray-500">
          {listing.neighborhood} · {timeAgo(listing.bumpedAt)}
          {distance ? ` · ${distance}` : ""}
        </p>
        <p className="mt-1 text-sm font-bold text-btc">
          ₿ {listing.priceBtc}
        </p>
        {listing.likes.length > 0 && (
          <div className="mt-auto flex items-center justify-end gap-1 text-xs text-gray-400">
            <span>❤️ {listing.likes.length}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
