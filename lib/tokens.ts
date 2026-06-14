export type TokenSymbol = "ETH" | "USDC";

export interface Token {
  symbol: TokenSymbol;
  name: string;
  decimals: number;
  /** 네이티브 코인(ETH) 여부 — true면 sendTransaction, false면 ERC20 transfer */
  isNative: boolean;
  /** ERC20 컨트랙트 주소 (Sepolia). 네이티브는 undefined */
  address?: `0x${string}`;
  emoji: string;
  accent: string; // tailwind 그라데이션용 hex
}

/**
 * 결제 가능 토큰 목록.
 * 개발 체인은 Sepolia. 토큰을 한 곳에 모아둬 L2 전환 시 주소만 교체하면 된다.
 */
export const TOKENS: Record<TokenSymbol, Token> = {
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    isNative: true,
    emoji: "Ξ",
    accent: "#7C5CFF",
  },
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    isNative: false,
    // Circle 공식 Sepolia 테스트 USDC
    address: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238",
    emoji: "＄",
    accent: "#2775CA",
  },
};

export const TOKEN_LIST: Token[] = Object.values(TOKENS);

export const DEFAULT_TOKEN: TokenSymbol = "ETH";
