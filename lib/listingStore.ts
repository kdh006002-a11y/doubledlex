"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LatLng, Listing, ListingStatus } from "./types";
import { SEED_LISTINGS, SEED_SELLERS } from "./seed";
import { useProfiles } from "./profileStore";

export type CreateListingInput = {
  sellerAddress: string;
  sellerNickname: string;
  title: string;
  description: string;
  priceBtc: number;
  category: string;
  photoIds: string[];
  location: LatLng;
  neighborhood: string;
};

type ListingState = {
  listings: Listing[];
  seeded: boolean;
  ensureSeed: () => void;
  create: (input: CreateListingInput) => Listing;
  setStatus: (id: string, status: ListingStatus) => void;
  toggleLike: (id: string, address: string) => void;
  bump: (id: string) => void;
  remove: (id: string) => void;
};

export const useListings = create<ListingState>()(
  persist(
    (set) => ({
      listings: [],
      seeded: false,
      ensureSeed: () =>
        set((s) => {
          if (s.seeded) return s;
          // Register the demo sellers' profiles too, so their nickname /
          // 매너온도 / avatar show up on listing detail pages.
          const profiles = useProfiles.getState();
          SEED_SELLERS.forEach((p) => profiles.upsert(p));
          return { listings: [...SEED_LISTINGS, ...s.listings], seeded: true };
        }),
      create: (input) => {
        const listing: Listing = {
          id: crypto.randomUUID(),
          sellerAddress: input.sellerAddress.toLowerCase(),
          sellerNickname: input.sellerNickname,
          title: input.title,
          description: input.description,
          priceBtc: input.priceBtc,
          category: input.category,
          photoIds: input.photoIds,
          location: input.location,
          neighborhood: input.neighborhood,
          status: "selling",
          likes: [],
          createdAt: Date.now(),
          bumpedAt: Date.now(),
        };
        set((s) => ({ listings: [listing, ...s.listings] }));
        return listing;
      },
      setStatus: (id, status) =>
        set((s) => ({
          listings: s.listings.map((l) => (l.id === id ? { ...l, status } : l)),
        })),
      toggleLike: (id, address) =>
        set((s) => {
          const me = address.toLowerCase();
          return {
            listings: s.listings.map((l) => {
              if (l.id !== id) return l;
              const liked = l.likes.includes(me);
              return {
                ...l,
                likes: liked ? l.likes.filter((a) => a !== me) : [...l.likes, me],
              };
            }),
          };
        }),
      bump: (id) =>
        set((s) => ({
          listings: s.listings.map((l) =>
            l.id === id ? { ...l, bumpedAt: Date.now() } : l
          ),
        })),
      remove: (id) =>
        set((s) => ({ listings: s.listings.filter((l) => l.id !== id) })),
    }),
    { name: "btc-danggn-listings" }
  )
);

/** Reactive single-listing selector. */
export function useListing(id: string): Listing | undefined {
  return useListings((s) => s.listings.find((l) => l.id === id));
}
