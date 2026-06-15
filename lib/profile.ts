/**
 * 사용자 프로필 (데모: 백엔드 없이 localStorage 보관).
 * 신원은 지갑 주소 → 프로필은 그 주소에 묶인다.
 * 당근마켓 레퍼런스: 닉네임 · 동네 · 매너온도(36.5°C) · 활동 배지.
 */

export interface Profile {
  /** 소문자 정규화된 지갑 주소 (식별자) */
  address: string;
  nickname: string;
  /** 인증한 동네 (lib/geo.ts 의 NEIGHBORHOODS 키) */
  neighborhood: string;
  avatarEmoji: string;
  bio?: string;
  /** 매너온도 — 가입 시 36.5에서 시작 */
  mannerTemp: number;
  badges: string[];
  createdAt: string;
}

const KEY = "dd_profiles";

/** 매너온도 시작값 (사람 체온) */
export const BASE_MANNER_TEMP = 36.5;

type ProfileMap = Record<string, Profile>;

function norm(address?: string): string {
  return (address ?? "").toLowerCase();
}

function readAll(): ProfileMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ProfileMap) : {};
  } catch {
    return {};
  }
}

function writeAll(map: ProfileMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(map));
}

/** 주소로 프로필 조회 (없으면 undefined) */
export function getProfile(address?: string): Profile | undefined {
  if (!address) return undefined;
  return readAll()[norm(address)];
}

export function hasProfile(address?: string): boolean {
  return Boolean(getProfile(address));
}

/** 프로필 저장(생성/수정). 주소는 항상 소문자로 정규화 */
export function saveProfile(profile: Profile): Profile {
  const next = { ...profile, address: norm(profile.address) };
  const map = readAll();
  map[next.address] = next;
  writeAll(map);
  return next;
}

/**
 * 새 프로필 생성용 기본값. 가입(계정 만들기) 폼의 초기 상태로 사용.
 */
export function emptyProfile(address: string): Profile {
  return {
    address: norm(address),
    nickname: "",
    neighborhood: "",
    avatarEmoji: "🥕",
    bio: "",
    mannerTemp: BASE_MANNER_TEMP,
    badges: ["첫 거래 준비중"],
    createdAt: new Date().toISOString(),
  };
}

/**
 * 시드 판매자(고정 더미)용 매너온도.
 * 백엔드가 없어 평점 데이터가 없으므로 주소 해시로 결정적으로 만들어
 * 화면이 채워져 보이게 한다. 범위: 36.5 ~ 47.3
 */
export function sellerMannerTemp(address: string): number {
  let h = 0;
  for (let i = 0; i < address.length; i++) {
    h = (h * 31 + address.charCodeAt(i)) | 0;
  }
  const span = Math.abs(h) % 109; // 0..108
  return Math.round((BASE_MANNER_TEMP + span / 10) * 10) / 10; // 36.5 ~ 47.3
}

/** 매너온도 → 표시용 색/이모지/라벨 (게이지 공용) */
export function mannerTone(temp: number): {
  label: string;
  emoji: string;
  /** 0~100 게이지 비율 (30~60°C 구간을 0~100으로 매핑) */
  ratio: number;
} {
  const ratio = Math.max(0, Math.min(100, ((temp - 30) / 30) * 100));
  let label = "보통이에요";
  let emoji = "😊";
  if (temp >= 45) {
    label = "최고예요";
    emoji = "🥰";
  } else if (temp >= 40) {
    label = "따뜻해요";
    emoji = "😄";
  } else if (temp < 36.5) {
    label = "주의가 필요해요";
    emoji = "😟";
  }
  return { label, emoji, ratio };
}
