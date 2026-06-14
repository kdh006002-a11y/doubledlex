import type { Category, Condition } from "./types";

/** 사용자가 등록한 판매 글 (데모: 백엔드 없이 localStorage 보관) */
export interface Listing {
  id: string;
  title: string;
  priceKrw: number;
  category: Category;
  condition: Condition;
  location: string;
  description: string;
  emoji: string;
  sellerAddress: string;
  createdAt: string;
}

const KEY = "dd_listings";

export function getListings(): Listing[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Listing[]) : [];
  } catch {
    return [];
  }
}

export function saveListings(list: Listing[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
}

export function addListing(listing: Listing): Listing[] {
  const next = [listing, ...getListings()];
  saveListings(next);
  return next;
}

export function removeListing(id: string): Listing[] {
  const next = getListings().filter((l) => l.id !== id);
  saveListings(next);
  return next;
}
