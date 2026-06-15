import type { Category, Product } from "./types";

export const CATEGORIES: Category[] = [
  "디지털기기",
  "가구/인테리어",
  "패션/잡화",
  "생활가전",
  "취미/게임",
  "스포츠/레저",
];

export const CATEGORY_EMOJI: Record<Category, string> = {
  디지털기기: "💻",
  "가구/인테리어": "🛋️",
  "패션/잡화": "👟",
  생활가전: "🧺",
  "취미/게임": "🎮",
  "스포츠/레저": "🚴",
};

const minsAgo = (n: number) => new Date(Date.now() - n * 60_000).toISOString();

export const PRODUCTS: Product[] = [
  {
    id: "ipad-pro-11-m2",
    title: "아이패드 프로 11인치 4세대 (M2) 128GB",
    description:
      "작년에 구매한 아이패드 프로입니다. 필름·케이스 끼고 깨끗하게 사용했어요. 애플펜슬 2세대 함께 드립니다. 직거래/택배 모두 가능해요.",
    priceKrw: 850_000,
    category: "디지털기기",
    emoji: "📱",
    location: "서울 강남구 역삼동",
    createdAt: minsAgo(7),
    sellerName: "코인부자",
    sellerAddress: "0xdeadbeefcafebabe123456789abcdef00badf00d",
    likes: 23,
    chats: 8,
    condition: "거의 새것",
  },
  {
    id: "macbook-air-m3",
    title: "맥북 에어 M3 13인치 (스페이스그레이)",
    description:
      "M3 칩 / 16GB / 512GB 모델. 사이클 30회 미만, 보증기간 남아있습니다. 코인 결제 환영합니다 🙌",
    priceKrw: 1_150_000,
    category: "디지털기기",
    emoji: "💻",
    location: "서울 용산구 한남동",
    createdAt: minsAgo(34),
    sellerName: "블록민수",
    sellerAddress: "0xfeedface0a1b2c3d4e5f60718293a4b5c6d7e8f9",
    likes: 41,
    chats: 15,
    condition: "거의 새것",
  },
  {
    id: "fabric-sofa-1p",
    title: "잘 쓰던 1인용 패브릭 소파 (베이지)",
    description:
      "이사 가면서 내놓아요. 큰 오염 없이 깨끗합니다. 직접 보고 가져가실 분 우대해요. 코인으로 바로 결제 가능!",
    priceKrw: 120_000,
    category: "가구/인테리어",
    emoji: "🛋️",
    location: "서울 마포구 연남동",
    createdAt: minsAgo(58),
    sellerName: "새벽지갑",
    sellerAddress: "0x13579bdf02468ace13579bdf02468ace13579bdf",
    likes: 12,
    chats: 5,
    condition: "사용감 적음",
  },
  {
    id: "dyson-v12",
    title: "다이슨 V12 디텍트 슬림 무선청소기",
    description:
      "흡입력 짱짱합니다. 부품 풀구성, 거치대 포함. 필터 새것으로 교체했어요.",
    priceKrw: 320_000,
    category: "생활가전",
    emoji: "🧹",
    location: "경기 성남시 분당구",
    createdAt: minsAgo(95),
    sellerName: "한남동고래",
    sellerAddress: "0xa1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4",
    likes: 33,
    chats: 11,
    condition: "사용감 적음",
  },
  {
    id: "switch-oled-bundle",
    title: "닌텐도 스위치 OLED + 인기게임 5종",
    description:
      "젤다, 마리오카트, 모동숲 등 인기 타이틀 5개 포함. 본체 상태 최상입니다. 풀박스로 드려요.",
    priceKrw: 290_000,
    category: "취미/게임",
    emoji: "🎮",
    location: "서울 송파구 잠실동",
    createdAt: minsAgo(140),
    sellerName: "도지홀더",
    sellerAddress: "0x0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f60718293",
    likes: 56,
    chats: 22,
    condition: "거의 새것",
  },
  {
    id: "stone-island-mtm",
    title: "스톤아일랜드 맨투맨 (정품, L)",
    description:
      "정품 보장합니다. 와펜 정품 확인 가능. 몇 번 안 입었어요. 사이즈 안 맞아서 정리합니다.",
    priceKrw: 180_000,
    category: "패션/잡화",
    emoji: "🧥",
    location: "부산 해운대구 우동",
    createdAt: minsAgo(220),
    sellerName: "체인러버",
    sellerAddress: "0x9f8e7d6c5b4a39281706f5e4d3c2b1a09f8e7d6c",
    likes: 18,
    chats: 6,
    condition: "사용감 적음",
  },
  {
    id: "trek-road-bike",
    title: "트렉 도마니 로드자전거 (입문용)",
    description:
      "입문용으로 타다가 업그레이드해서 내놓습니다. 정비 마쳤고 바로 탈 수 있어요. 헬멧 덤으로 드려요.",
    priceKrw: 450_000,
    category: "스포츠/레저",
    emoji: "🚲",
    location: "인천 연수구 송도동",
    createdAt: minsAgo(310),
    sellerName: "송도라이더",
    sellerAddress: "0x1122aabb3344ccdd5566eeff778899a0b1c2d3e4",
    likes: 9,
    chats: 4,
    condition: "사용감 있음",
  },
  {
    id: "jordan1-retro",
    title: "나이키 에어조던1 레트로 하이 (275mm)",
    description:
      "정품, 박스 포함. 몇 번 신지 않아 상태 좋습니다. 한정판이라 빨리 나가요!",
    priceKrw: 210_000,
    category: "패션/잡화",
    emoji: "👟",
    location: "서울 성동구 성수동",
    createdAt: minsAgo(420),
    sellerName: "성수픽업",
    sellerAddress: "0x0fedcba9876543210fedcba9876543210fedcba9",
    likes: 47,
    chats: 19,
    condition: "거의 새것",
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getRelated(product: Product, count = 4): Product[] {
  return PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category
  )
    .concat(PRODUCTS.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, count);
}
