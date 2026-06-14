"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAccount } from "wagmi";
import type { Profile } from "./types";

type ProfileState = {
  profiles: Record<string, Profile>; // keyed by lowercased address
  upsert: (p: Profile) => void;
  adjustManner: (address: string, delta: number) => void;
};

export const useProfiles = create<ProfileState>()(
  persist(
    (set) => ({
      profiles: {},
      upsert: (p) =>
        set((s) => ({
          profiles: {
            ...s.profiles,
            [p.address.toLowerCase()]: { ...p, address: p.address.toLowerCase() },
          },
        })),
      adjustManner: (address, delta) =>
        set((s) => {
          const key = address.toLowerCase();
          const cur = s.profiles[key];
          if (!cur) return s;
          const next = Math.min(99, Math.max(0, Number((cur.mannerTemp + delta).toFixed(1))));
          return { profiles: { ...s.profiles, [key]: { ...cur, mannerTemp: next } } };
        }),
    }),
    { name: "btc-danggn-profiles" }
  )
);

/** Non-reactive lookup (safe outside React render). */
export function getProfile(address?: string): Profile | undefined {
  if (!address) return undefined;
  return useProfiles.getState().profiles[address.toLowerCase()];
}

/** Current user = connected wallet + its profile (if onboarded). */
export function useMyProfile() {
  const { address, isConnected } = useAccount();
  const key = address ? address.toLowerCase() : undefined;
  const profile = useProfiles((s) => (key ? s.profiles[key] : undefined));
  return { address, key, isConnected, profile };
}
