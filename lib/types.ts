// Shared domain types for the 당근마켓-style local marketplace (demo).

export type LatLng = { lat: number; lng: number };

/** A user account. In this demo the wallet address IS the account id. */
export type Profile = {
  address: string; // wallet address, stored lowercased — the account id
  nickname: string;
  neighborhood: string; // 동네 이름 e.g. "역삼동"
  location: LatLng; // 동네 중심 좌표
  avatar: string; // emoji
  mannerTemp: number; // 매너온도 (당근), 기본 36.5
  createdAt: number;
};

export type ListingStatus = "selling" | "reserved" | "sold";

/** A second-hand item for sale (중고거래 글). */
export type Listing = {
  id: string;
  sellerAddress: string; // = Profile.address (lowercased)
  sellerNickname: string; // denormalized for quick display
  title: string;
  description: string;
  priceBtc: number; // 가격은 BTC로 표시
  category: string;
  photoIds: string[]; // keys into the IndexedDB photo store (lib/idb)
  emoji?: string; // fallback thumbnail for seed items with no photo
  location: LatLng; // 거래 희망 장소
  neighborhood: string;
  status: ListingStatus;
  likes: string[]; // addresses who liked (찜)
  createdAt: number;
  bumpedAt: number; // 끌올 시각 (정렬 기준)
};

export type ChatMessage = {
  id: string;
  from: string; // address (lowercased)
  text: string;
  at: number;
};

/** A 1:1 conversation about a listing between a buyer and the seller. */
export type Conversation = {
  id: string; // `${listingId}:${buyerAddress}`
  listingId: string;
  buyerAddress: string;
  sellerAddress: string;
  messages: ChatMessage[];
  updatedAt: number;
};
