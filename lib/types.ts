export type Category =
  | "디지털기기"
  | "가구/인테리어"
  | "패션/잡화"
  | "생활가전"
  | "취미/게임"
  | "스포츠/레저";

export type Condition = "새상품" | "거의 새것" | "사용감 적음" | "사용감 있음";

export interface Product {
  id: string;
  title: string;
  description: string;
  /** 상품의 기준 가치는 원화로 보관하고, 결제 시 코인으로 환산한다 */
  priceKrw: number;
  category: Category;
  /** 카테고리 대표 이모지 — 이미지가 없을 때의 우아한 폴백 */
  emoji: string;
  /** 원격 이미지 URL (Higgsfield 등). 비어 있으면 그라데이션 폴백 */
  image?: string;
  location: string;
  createdAt: string; // ISO
  sellerName: string;
  sellerAddress: `0x${string}`;
  likes: number;
  chats: number;
  condition: Condition;
}
