"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatMessage, Conversation } from "./types";

function convId(listingId: string, buyer: string): string {
  return `${listingId}:${buyer.toLowerCase()}`;
}

type ChatState = {
  conversations: Record<string, Conversation>;
  /** Get or create the conversation for (listing, buyer). Returns its id. */
  ensure: (args: {
    listingId: string;
    buyerAddress: string;
    sellerAddress: string;
  }) => string;
  send: (id: string, from: string, text: string) => void;
};

export const useChat = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: {},
      ensure: ({ listingId, buyerAddress, sellerAddress }) => {
        const id = convId(listingId, buyerAddress);
        if (!get().conversations[id]) {
          set((s) => ({
            conversations: {
              ...s.conversations,
              [id]: {
                id,
                listingId,
                buyerAddress: buyerAddress.toLowerCase(),
                sellerAddress: sellerAddress.toLowerCase(),
                messages: [],
                updatedAt: Date.now(),
              },
            },
          }));
        }
        return id;
      },
      send: (id, from, text) =>
        set((s) => {
          const c = s.conversations[id];
          if (!c) return s;
          const msg: ChatMessage = {
            id: crypto.randomUUID(),
            from: from.toLowerCase(),
            text,
            at: Date.now(),
          };
          return {
            conversations: {
              ...s.conversations,
              [id]: { ...c, messages: [...c.messages, msg], updatedAt: msg.at },
            },
          };
        }),
    }),
    { name: "btc-danggn-chat" }
  )
);

/** Pure helper: conversations involving `address`, newest first. */
export function listConversations(
  map: Record<string, Conversation>,
  address?: string
): Conversation[] {
  const me = address?.toLowerCase();
  if (!me) return [];
  return Object.values(map)
    .filter((c) => c.buyerAddress === me || c.sellerAddress === me)
    .sort((a, b) => b.updatedAt - a.updatedAt);
}
