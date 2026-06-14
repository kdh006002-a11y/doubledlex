# 더블디럭스 (Double Deluxe) 🥕Ξ

> **현금화 없이, 가스비·거래소 수수료 없이.** 보유한 코인 그대로 우리 동네 중고 물건을 사고팔아요.
> 판매자는 거래소·환전 없이 코인을 **쉽고 저렴하게 바로** 받습니다.

당근마켓 스타일의 동네 중고거래 UX에 **암호화폐 결제**를 얹은 마켓플레이스입니다.
결제 위젯은 **Uniswap 인터페이스의 지갑 연결·트랜잭션 패턴**(wagmi/viem)을 참조했습니다.

---

## 왜 만들었나 (핵심 가치)

오늘날 코인으로 실생활 소비를 하려면 보통 이렇게 합니다:

> 바이낸스에서 수익 실현 → 개인 지갑 전송 → 업비트·빗썸 입금 → **가스비 + 수수료** → 원화 출금 → 그제서야 소비

더블디럭스는 이 6단계를 **단 1단계**로 줄입니다:

> **보유 코인 → 바로 결제 ✓**

- 구매자: 현금화 과정을 통째로 건너뛰고 코인 그대로 결제
- 판매자: 환전 없이 코인을 자기 지갑으로 즉시 수령

---

## 빠른 시작

> ℹ️ 이 프로젝트는 코드가 모두 작성된 상태로 전달됩니다. 아래 두 줄만 실행하면 됩니다.

```bash
npm install
npm run dev
```

→ 브라우저에서 **http://localhost:3000** 접속.

요구사항: **Node.js 18.18 이상**.

### 지갑 / 테스트넷 준비 (결제를 실제로 해보려면)

1. **MetaMask** 설치 → 네트워크를 **Sepolia 테스트넷**으로 전환
   (앱의 "지갑 연결" 후 잘못된 네트워크면 전환 버튼이 자동으로 떠요)
2. **테스트 ETH** 받기 (무료 faucet):
   - https://sepoliafaucet.com
   - https://www.alchemy.com/faucets/ethereum-sepolia
3. 상품 상세 페이지 → **코인으로 결제** 위젯에서 결제

> ⚠️ **Sepolia 테스트넷**에서 동작합니다. 실제 자산이 아닙니다.

---

## GitHub에서 실행하기

이 앱은 지갑 연결·localStorage 등 **전부 클라이언트 사이드**라 서버 없이 정적 호스팅으로 완전히 동작합니다. 그래서 **GitHub Pages**에 무료로 띄울 수 있어요. (정적 export 설정 + 자동 배포 워크플로우가 이미 들어 있습니다.)

### 방법 A — GitHub Pages (라이브 URL, 추천)

> ⚠️ 이 환경에선 git 실행이 막혀 있어 제가 push까지 못 합니다. 아래 명령은 **직접** 실행하세요.

```bash
cd C:\Users\CKIRUser\double-deluxe
git init
git add .
git commit -m "더블디럭스 초기 커밋"
git branch -M main

# 1) GitHub에 빈 저장소를 먼저 만든다 (이름: double-deluxe)
#    - 웹: github.com/new  또는
#    - gh CLI: gh repo create double-deluxe --public --source=. --remote=origin

# 2) 원격 연결 후 푸시 (<USERNAME>을 본인 계정으로)
git remote add origin https://github.com/<USERNAME>/double-deluxe.git
git push -u origin main
```

그다음 GitHub 저장소에서:

1. **Settings → Pages → Build and deployment → Source 를 "GitHub Actions"로** 설정
2. push할 때마다 `.github/workflows/deploy.yml`이 빌드·배포합니다 (Actions 탭에서 진행 확인)
3. 완료되면 주소: **`https://<USERNAME>.github.io/double-deluxe/`**

> 저장소 이름이 `double-deluxe`가 아니어도 워크플로우가 자동으로 경로(basePath)를 맞춥니다.
> 단, `<USERNAME>.github.io` 같은 **사용자 사이트** 저장소라면 워크플로우의 `NEXT_PUBLIC_BASE_PATH` 줄을 빈 값으로 바꾸세요.

### 방법 B — GitHub Codespaces (브라우저에서 dev 서버)

저장소 페이지에서 **Code ▸ Codespaces ▸ Create codespace** → 컨테이너가 뜨면(`.devcontainer` 포함) 자동으로 `npm install` 후:

```bash
npm run dev
```

→ 포트 3000이 자동 포워딩되어 브라우저 미리보기로 바로 확인됩니다.

---

## 주요 기능

| 화면 | 설명 |
| --- | --- |
| **홈** `/` | 가치제안 히어로(기존 6단계 vs 더블디럭스 1단계 시각화), 카테고리 필터, 상품 그리드 |
| **상품 상세** `/products/[id]` | 상품 정보 + **Uniswap식 결제 위젯** + **수수료 절약 비교 카드** |
| **판매하기** `/sell` | 등록 폼 (원화 입력 → 코인 가격 자동 환산, 수취 지갑 자동 채움) |
| **내 지갑** `/me` | 받은 코인 잔액(ETH·USDC) + 판매 중인 상품 |

- **가격은 코인 + 원화 동시 표기** — 가치를 직관적으로
- **수수료 투명성** — 거래소 출금 대비 절약 금액을 결제 화면에서 바로 표시

---

## 기술 스택

- **Next.js 14 (App Router) + TypeScript**
- **Tailwind CSS** — 디자인 토큰/시스템
- **wagmi v2 + viem** — 지갑·체인·트랜잭션 (Uniswap이 쓰는 스택)
- **@tanstack/react-query** — wagmi 데이터 레이어
- 지갑 연결: **injected(MetaMask)** — 외부 API 키 불필요

### 결제 동작 (Uniswap 참조)

`components/PaymentWidget.tsx`의 단일 버튼 상태머신:

```
지갑 연결 → (Sepolia 전환) → (잔액 부족) → 결제하기
        → 지갑에서 승인 → 결제 확인 중 → 결제 완료 ✓ (Etherscan 링크)
```

- 네이티브 **ETH**: `useSendTransaction` → 판매자 주소로 직접 송금
- **USDC(ERC20)**: `useWriteContract` → `transfer(판매자, 금액)`
- `useWaitForTransactionReceipt`로 컨펌 대기

---

## 프로젝트 구조

```
double-deluxe/
├─ app/
│  ├─ layout.tsx · providers.tsx · globals.css
│  ├─ page.tsx                 # 홈 (Hero + ValueProps + Marketplace)
│  ├─ products/[id]/page.tsx   # 상품 상세 + 결제
│  ├─ sell/page.tsx            # 판매 등록
│  └─ me/page.tsx              # 판매자 대시보드
├─ components/                 # Header, PaymentWidget, ProductCard, ...
├─ lib/
│  ├─ wagmi.ts                 # 체인/커넥터 (여기만 바꾸면 L2 전환)
│  ├─ tokens.ts · price.ts · payment.ts · format.ts
│  └─ products.ts              # 목업 상품 데이터
└─ design-system/              # claude.ai/design 동기화용 프리뷰 카드
```

---

## 디자인

- **로고**: 직접 제작한 SVG (`components/Logo.tsx`) — 두 개의 겹친 다이아몬드(=Double Deluxe), 오렌지→보라 그라데이션
- **상품 이미지**: 카테고리별 그라데이션 + 이모지로 **우아하게 폴백**하도록 설계.
  실제 이미지를 넣으려면 `lib/products.ts`의 각 상품 `image`에 URL을 채우면 됩니다.
  (`next.config.mjs`의 `images.remotePatterns`에 일반 CDN이 이미 허용돼 있어요.)
- **claude.ai/design**: 브랜드·타이포·버튼·상품카드·결제위젯 프리뷰를
  "더블디럭스 Design System" 프로젝트로 동기화했습니다 (`design-system/`).

> 참고: 이미지 자동 생성(Higgsfield MCP)은 작성 시점 환경에서 연동이 일시적으로 막혀 있어,
> 위와 같이 원격 URL을 받을 수 있는 구조로 배선해두고 폴백 비주얼로 완성했습니다.

---

## 프로덕션으로 갈 때 (낮은 수수료가 핵심 가치)

`lib/wagmi.ts`의 `chains`만 저가 L2(**Base / Arbitrum / Polygon**)로 바꾸면
결제 레이어 전체가 그대로 따라갑니다. `lib/tokens.ts`의 토큰 주소도 해당 체인 기준으로 교체하세요.

다음 단계 후보: 에스크로 컨트랙트(거래 보호), 가격 오라클(`lib/price.ts` 환율 대체), 백엔드 연동(현재 등록 상품은 localStorage 데모).
