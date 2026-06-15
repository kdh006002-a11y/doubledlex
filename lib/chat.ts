import type { Product } from "./types";

/**
 * 1:1 상품 채팅 (데모: 백엔드 없이 localStorage 보관).
 * 당근마켓처럼 "상품 1개당 판매자와의 대화 1개"로 단순화한다.
 * thread id = product.id → 정적 라우트(app/chat/[id])와 1:1로 맞춘다.
 */

export interface ChatMessage {
  id: string;
  /** "me" = 현재 사용자(구매자), "seller" = 판매자(자동응답 시뮬레이션) */
  sender: "me" | "seller";
  text: string;
  at: string; // ISO
}

export interface ChatThread {
  id: string;
  productId: string;
  productTitle: string;
  productEmoji: string;
  productPriceKrw: number;
  sellerName: string;
  sellerAddress: string;
  messages: ChatMessage[];
  updatedAt: string; // ISO
}

const KEY = "dd_chats";

type ThreadMap = Record<string, ChatThread>;

function readAll(): ThreadMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ThreadMap) : {};
  } catch {
    return {};
  }
}

function writeAll(map: ThreadMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(map));
}

function uid(): string {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/** 최근 대화순 스레드 목록 */
export function getThreads(): ChatThread[] {
  return Object.values(readAll()).sort(
    (a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)
  );
}

export function getThread(id: string): ChatThread | undefined {
  return readAll()[id];
}

/** 상품에 대한 스레드를 가져오거나(없으면) 첫 인사 메시지와 함께 생성 */
export function getOrCreateThread(product: Product): ChatThread {
  const map = readAll();
  const existing = map[product.id];
  if (existing) return existing;

  const now = new Date().toISOString();
  const thread: ChatThread = {
    id: product.id,
    productId: product.id,
    productTitle: product.title,
    productEmoji: product.emoji,
    productPriceKrw: product.priceKrw,
    sellerName: product.sellerName,
    sellerAddress: product.sellerAddress,
    messages: [
      {
        id: uid(),
        sender: "seller",
        text: `안녕하세요! "${product.title}" 보고 연락 주셨네요 😊 코인으로 바로 결제 가능해요.`,
        at: now,
      },
    ],
    updatedAt: now,
  };
  map[product.id] = thread;
  writeAll(map);
  return thread;
}

function append(id: string, sender: ChatMessage["sender"], text: string): ChatThread | undefined {
  const map = readAll();
  const thread = map[id];
  if (!thread) return undefined;
  const now = new Date().toISOString();
  thread.messages.push({ id: uid(), sender, text, at: now });
  thread.updatedAt = now;
  writeAll(map);
  return thread;
}

/** 내(구매자) 메시지 전송 */
export function sendMessage(id: string, text: string): ChatThread | undefined {
  return append(id, "me", text);
}

/** 판매자 자동응답 추가 (컴포넌트에서 setTimeout으로 호출) */
export function appendSellerReply(id: string, text: string): ChatThread | undefined {
  return append(id, "seller", text);
}

export function removeThread(id: string): ChatThread[] {
  const map = readAll();
  delete map[id];
  writeAll(map);
  return getThreads();
}

/** 판매자 자동응답 후보 — 마지막 내 메시지에 맞춰 컴포넌트가 고른다 */
export function pickSellerReply(lastText: string): string {
  const t = lastText.toLowerCase();
  if (/네고|할인|깎|싸게/.test(lastText))
    return "조금은 조정 가능해요! 직거래로 오시면 더 신경 써드릴게요 🙏";
  if (/언제|시간|지금|약속|만나/.test(lastText))
    return "저는 오늘 저녁이나 주말 오전이 편해요. 가능하신 시간 알려주세요!";
  if (/직거래|장소|어디/.test(lastText))
    return "동네 지하철역 1번 출구 앞에서 직거래 어떠세요? 코인 결제는 만나서 바로 진행하면 돼요.";
  if (/결제|코인|eth|usdc|지갑/i.test(lastText))
    return "지갑 연결하고 결제 버튼만 누르시면 제 지갑으로 바로 들어와요. 환전 안 거쳐서 편해요 😄";
  return "네, 확인했어요! 편하게 물어봐 주세요 :)";
}
