# BTC 당근 — 동네 비트코인 중고거래 (데모)

당근마켓 스타일의 동네 기반 중고거래 웹앱입니다. 지갑을 연결해 **계정**을 만들고,
**사진을 올려 글을 쓰고**, 판매자와 **채팅**하고, **지도**에서 거래 위치를 확인합니다.
가격은 **BTC**로 표시되고, 결제는 Uniswap 라우터를 통해 판매자 지갑으로 전달됩니다.

> 학습/데모용 프로젝트입니다. 백엔드 없이 **브라우저(localStorage + IndexedDB)** 에만
> 데이터를 저장합니다. 따라서 데이터는 기기/브라우저별로만 유지되고, 채팅은 한 브라우저
> 안에서 동작하는 **로컬 시뮬레이션**입니다(실서비스는 서버가 필요 — 아래 "한계" 참고).

## 주요 기능

- 🥕 **계정 = 지갑 연결** — RainbowKit으로 지갑을 연결하면 그 주소가 계정. 닉네임·동네·아바타·매너온도 프로필.
- 🛒 **중고거래 피드** — 동네 물건 목록, 카테고리 필터, 검색, 판매중/예약중/거래완료 상태, 끌어올리기(끌올), 찜(관심).
- 📷 **사진 업로드** — 여러 장 업로드(자동 리사이즈), 대표 이미지 지정. IndexedDB에 저장.
- 🗺️ **지도** — Leaflet + OpenStreetMap(무료, API 키 불필요). 피드 지도 보기 + 글쓰기 시 거래 위치 선택 + 현재 위치.
- 💬 **채팅** — 물건별 1:1 대화. (데모라 상대방 응답은 자동 시뮬레이션)
- ₿ **BTC 결제** — 구매 시 판매자 지갑으로 송금. ETH/USDC 보유자는 Uniswap `exactOutputSingle`로 정확한 BTC를 스왑해 전달.

## 기술 스택

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS**
- **wagmi v2 + viem v2 + RainbowKit** — 지갑 연결 / 트랜잭션
- **zustand (+persist)** — 프로필 / 리스팅 / 채팅 상태 (localStorage)
- **IndexedDB** — 업로드 사진 저장 (`lib/idb.ts`)
- **Leaflet + OpenStreetMap** — 지도 (`components/MapView.tsx`, `MapPicker.tsx`)
- **Uniswap v3 SwapRouter02 / QuoterV2** — BTC 결제 라우팅 (`lib/payment.ts`)

## 실행 방법

> ⚠️ 의존성 설치/실행은 **직접** 터미널에서 하세요. (`leaflet`이 추가되었습니다)

```powershell
cd C:\path\to\btc-coupang
npm install
copy .env.local.example .env.local   # 그리고 값 채우기
npm run dev
```

브라우저에서 http://localhost:3000 접속 → 우측 상단 지갑 연결 → `나의 당근`에서 프로필 생성 →
`글쓰기`로 물건 등록(사진/지도) → 다른 물건에서 `채팅하기` / `구매`.

## 설정해야 할 값 (`.env.local`)

| 변수 | 설명 |
|------|------|
| `NEXT_PUBLIC_WC_PROJECT_ID` | WalletConnect Cloud 무료 프로젝트 ID |
| `NEXT_PUBLIC_BTC_TOKEN` | WBTC/cbBTC 토큰 주소 (8 decimals) |
| `NEXT_PUBLIC_SWAP_ROUTER` / `NEXT_PUBLIC_QUOTER` | Uniswap 라우터/쿼터 주소 |
| `NEXT_PUBLIC_WETH` / `NEXT_PUBLIC_USDC` | 결제용 입력 토큰 주소 |
| `NEXT_PUBLIC_MERCHANT_ADDRESS` | (선택) 기본 수취 주소. 글쓰기 거래는 판매자 지갑으로 가지만, 미지정 시 폴백 |

`lib/payment.ts`의 기본값은 **Base 메인넷** 주소입니다. 개발은 **Base Sepolia 테스트넷**을
권장하며, 위 환경변수로 덮어쓰면 됩니다.

## ⚠️ 주의

- **반드시 테스트넷(Base Sepolia)부터** 시작하세요. 실제 자금 손실 위험.
- **시드(데모) 물건**의 판매자는 가짜 주소(`0x1111…`, `0x2222…`)입니다. 이 물건을 "구매"하면
  해당 주소로 실제 송금되니, 결제 흐름은 **내가 직접 올린 글**이나 테스트넷에서만 시험하세요.
- 채팅/계정/사진은 **브라우저에만** 저장됩니다. 캐시 삭제 시 사라집니다.
- 프로덕션 전 스마트컨트랙트 상호작용/슬리피지/승인 한도 **보안 검토** 필요.

## 폴더 구조

```
app/
  layout.tsx              앱 셸 (Providers + Header + BottomNav)
  page.tsx                홈 피드 (목록/지도 토글, 검색, 카테고리)
  new/page.tsx            글쓰기 (사진 업로드 + 지도 위치)
  listing/[id]/page.tsx   상품 상세 (갤러리·판매자·지도·찜·채팅·구매)
  chat/page.tsx           채팅 (대화 목록 + 대화방)
  profile/page.tsx        나의 당근 (프로필/동네 설정 + 판매내역)
  providers.tsx           wagmi / RainbowKit / react-query
components/
  Header.tsx, BottomNav.tsx
  ListingCard.tsx, MannerTemp.tsx
  PhotoUploader.tsx, Photo.tsx        사진 업로드/표시 (IndexedDB)
  MapView.tsx, MapPicker.tsx          Leaflet 지도
  ChatPanel.tsx                       채팅 UI
  CheckoutButton.tsx                  BTC 결제 (판매자에게 송금)
lib/
  types.ts                도메인 타입
  idb.ts                  IndexedDB 사진 저장
  profileStore.ts         계정/프로필 (zustand)
  listingStore.ts         중고거래 글 (zustand)
  chatStore.ts            채팅 (zustand)
  seed.ts                 데모 데이터 / 카테고리 / 기본 동네
  geo.ts, time.ts, useMounted.ts      유틸
  wagmi.ts, payment.ts    체인 설정 / Uniswap 결제
```

### 레거시 파일 (삭제 가능)

기존 "BTC 쿠팡(장바구니 쇼핑몰)" 잔재로, 현재 앱에서는 **사용하지 않습니다**.
원하면 삭제하세요(빌드에는 영향 없음):

```powershell
git rm components/CartDrawer.tsx components/ProductGrid.tsx components/ProductCard.tsx lib/store.ts lib/products.ts
```

## 한계 (데모이기 때문)

- 백엔드가 없어 **여러 기기/사용자 간 데이터 공유 불가**. 채팅 상대 응답은 자동 시뮬레이션.
- 실제 멀티유저 서비스로 만들려면 인증·DB·실시간 채팅·사진 스토리지(예: Supabase/Firebase)가 필요합니다.

## 다음 단계 (로드맵)

1. 백엔드 연동(Supabase 등) — 실제 회원/실시간 채팅/사진 영속화
2. 동네 인증 / 반경 기반 "내 근처" 정렬 강화
3. 리뷰·매너온도 실제 반영, 거래 후기
4. 가격 오라클 연동 (BTC↔법정화폐 표기)
5. 스마트컨트랙트 보안 검토 후 메인넷 전환
```
