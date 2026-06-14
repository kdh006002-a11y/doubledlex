export type Product = {
  id: string;
  name: string;
  category: string;
  // Price is denominated in BTC (e.g. 0.0012 BTC).
  priceBtc: number;
  image: string;
  rating: number;
  reviews: number;
  rocket: boolean; // "로켓배송" style fast-delivery badge
};

// Demo catalog. Images are emoji-as-data so the app runs with zero assets.
export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "무선 노이즈캔슬링 헤드폰",
    category: "전자기기",
    priceBtc: 0.0042,
    image: "🎧",
    rating: 4.8,
    reviews: 12843,
    rocket: true,
  },
  {
    id: "p2",
    name: "스테인리스 텀블러 1L",
    category: "주방용품",
    priceBtc: 0.00038,
    image: "🥤",
    rating: 4.6,
    reviews: 5210,
    rocket: true,
  },
  {
    id: "p3",
    name: "기계식 게이밍 키보드",
    category: "전자기기",
    priceBtc: 0.0021,
    image: "⌨️",
    rating: 4.7,
    reviews: 9981,
    rocket: false,
  },
  {
    id: "p4",
    name: "유기농 원두 1kg",
    category: "식품",
    priceBtc: 0.00052,
    image: "☕",
    rating: 4.9,
    reviews: 22310,
    rocket: true,
  },
  {
    id: "p5",
    name: "초경량 캠핑 의자",
    category: "스포츠/레저",
    priceBtc: 0.00075,
    image: "🪑",
    rating: 4.5,
    reviews: 3120,
    rocket: false,
  },
  {
    id: "p6",
    name: "고속 충전 보조배터리 20000mAh",
    category: "전자기기",
    priceBtc: 0.00061,
    image: "🔋",
    rating: 4.4,
    reviews: 18402,
    rocket: true,
  },
  {
    id: "p7",
    name: "프리미엄 요가매트",
    category: "스포츠/레저",
    priceBtc: 0.00045,
    image: "🧘",
    rating: 4.7,
    reviews: 7654,
    rocket: true,
  },
  {
    id: "p8",
    name: "스마트 LED 무드등",
    category: "홈데코",
    priceBtc: 0.00029,
    image: "💡",
    rating: 4.3,
    reviews: 2891,
    rocket: false,
  },
];

export const CATEGORIES = [
  "전체",
  "전자기기",
  "주방용품",
  "식품",
  "스포츠/레저",
  "홈데코",
];
