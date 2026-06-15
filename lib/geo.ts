/**
 * 동네 좌표 (내 근처 / 지도용).
 * 백엔드·지오코딩 API 없이 동작하도록, 시드 상품의 location 문자열을
 * 미리 정의한 동네 좌표에 매칭한다. 상품 데이터(lib/products.ts)는 건드리지 않는다.
 */

export interface Neighborhood {
  /** location 문자열에서 부분일치로 찾을 키워드 */
  key: string;
  label: string;
  lat: number;
  lng: number;
}

/** 지도 기본 중심 (서울시청) */
export const DEFAULT_CENTER = { lat: 37.5663, lng: 126.9779 };

/** 시드 데이터에 등장하는 동네 + 좌표 */
export const NEIGHBORHOODS: Neighborhood[] = [
  { key: "역삼", label: "서울 강남구 역삼동", lat: 37.5006, lng: 127.0364 },
  { key: "한남", label: "서울 용산구 한남동", lat: 37.534, lng: 127.0026 },
  { key: "연남", label: "서울 마포구 연남동", lat: 37.563, lng: 126.925 },
  { key: "분당", label: "경기 성남시 분당구", lat: 37.3595, lng: 127.1052 },
  { key: "잠실", label: "서울 송파구 잠실동", lat: 37.5132, lng: 127.1001 },
  { key: "해운대", label: "부산 해운대구 우동", lat: 35.1631, lng: 129.1635 },
  { key: "송도", label: "인천 연수구 송도동", lat: 37.3895, lng: 126.643 },
  { key: "성수", label: "서울 성동구 성수동", lat: 37.5443, lng: 127.0557 },
];

/** 프로필 동네 선택용 옵션 (label 사용) */
export const NEIGHBORHOOD_LABELS = NEIGHBORHOODS.map((n) => n.label);

/** ProductImage 와 동일한 결정적 해시 */
function hash(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** location 문자열에 매칭되는 동네 (없으면 undefined) */
export function matchNeighborhood(location: string): Neighborhood | undefined {
  return NEIGHBORHOODS.find((n) => location.includes(n.key));
}

/**
 * 상품/위치의 지도 좌표.
 * 같은 동네라도 마커가 겹치지 않도록 seed(상품 id 등) 해시로 ±0.004° 미세 오프셋.
 */
export function coordsForLocation(
  location: string,
  seed: string
): { lat: number; lng: number } {
  const n = matchNeighborhood(location);
  const base = n ?? DEFAULT_CENTER;
  const h = hash(seed);
  const dLat = ((h % 1000) / 1000 - 0.5) * 0.008; // ±0.004
  const dLng = (((h >> 10) % 1000) / 1000 - 0.5) * 0.008;
  return { lat: base.lat + dLat, lng: base.lng + dLng };
}
