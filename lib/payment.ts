// ---------------------------------------------------------------------------
// Payment system — referenced from Uniswap v3 periphery (SwapRouter02).
//
// Idea: the storefront prices everything in BTC (WBTC / cbBTC, an ERC-20 that
// is 1:1 backed by Bitcoin on an EVM chain). The merchant always wants to be
// paid in BTC. A buyer, however, may only hold ETH or a stablecoin. So at
// checkout we route the buyer's input token through Uniswap's SwapRouter and
// deliver an EXACT BTC amount to the merchant — this is `exactOutputSingle`
// from Uniswap v3-periphery's ISwapRouter.
//
// Two payment paths are supported:
//   1) PAY DIRECT  — buyer already holds BTC token -> plain ERC20.transfer
//   2) PAY VIA SWAP — buyer holds WETH/USDC -> Uniswap exactOutputSingle,
//                     recipient = merchant, amountOut = price in BTC.
//
// References:
//   - Uniswap v3-periphery ISwapRouter:        exactOutputSingle / exactInputSingle
//   - Uniswap SwapRouter02 (deployed router):  https://docs.uniswap.org/contracts/v3/reference/deployments
//   - QuoterV2:                                quoteExactOutputSingle (off-chain price)
// ---------------------------------------------------------------------------

import type { Address } from "viem";

// --- Contract addresses (override via .env.local) --------------------------
// Defaults below are Base MAINNET. For Base Sepolia testnet, set the env vars.
export const ADDRESSES = {
  // Uniswap SwapRouter02
  swapRouter: (process.env.NEXT_PUBLIC_SWAP_ROUTER ??
    "0x2626664c2603336E57B271c5C0b26F421741e481") as Address,
  // QuoterV2 (read-only price quotes)
  quoter: (process.env.NEXT_PUBLIC_QUOTER ??
    "0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a") as Address,
  // The "Bitcoin" token the merchant receives. cbBTC on Base by default.
  btc: (process.env.NEXT_PUBLIC_BTC_TOKEN ??
    "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf") as Address,
  // Tokens a buyer might pay with.
  weth: (process.env.NEXT_PUBLIC_WETH ??
    "0x4200000000000000000000000000000000000006") as Address,
  usdc: (process.env.NEXT_PUBLIC_USDC ??
    "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913") as Address,
  // Where customer payments land.
  merchant: (process.env.NEXT_PUBLIC_MERCHANT_ADDRESS ??
    "0x000000000000000000000000000000000000dEaD") as Address,
} as const;

// BTC tokens use 8 decimals (like Bitcoin). cbBTC/WBTC = 8.
export const BTC_DECIMALS = 8;

// --- Minimal ERC-20 ABI ----------------------------------------------------
export const erc20Abi = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
] as const;

// --- Uniswap SwapRouter02 ABI (subset) -------------------------------------
// Signatures copied from Uniswap v3-periphery ISwapRouter.
export const swapRouterAbi = [
  {
    type: "function",
    name: "exactOutputSingle",
    stateMutability: "payable",
    inputs: [
      {
        name: "params",
        type: "tuple",
        components: [
          { name: "tokenIn", type: "address" },
          { name: "tokenOut", type: "address" },
          { name: "fee", type: "uint24" },
          { name: "recipient", type: "address" },
          { name: "amountOut", type: "uint256" },
          { name: "amountInMaximum", type: "uint256" },
          { name: "sqrtPriceLimitX96", type: "uint160" },
        ],
      },
    ],
    outputs: [{ name: "amountIn", type: "uint256" }],
  },
  {
    type: "function",
    name: "exactInputSingle",
    stateMutability: "payable",
    inputs: [
      {
        name: "params",
        type: "tuple",
        components: [
          { name: "tokenIn", type: "address" },
          { name: "tokenOut", type: "address" },
          { name: "fee", type: "uint24" },
          { name: "recipient", type: "address" },
          { name: "amountIn", type: "uint256" },
          { name: "amountOutMinimum", type: "uint256" },
          { name: "sqrtPriceLimitX96", type: "uint160" },
        ],
      },
    ],
    outputs: [{ name: "amountOut", type: "uint256" }],
  },
] as const;

// --- QuoterV2 ABI (subset, read-only) --------------------------------------
export const quoterAbi = [
  {
    type: "function",
    name: "quoteExactOutputSingle",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "params",
        type: "tuple",
        components: [
          { name: "tokenIn", type: "address" },
          { name: "tokenOut", type: "address" },
          { name: "amount", type: "uint256" },
          { name: "fee", type: "uint24" },
          { name: "sqrtPriceLimitX96", type: "uint160" },
        ],
      },
    ],
    outputs: [
      { name: "amountIn", type: "uint256" },
      { name: "sqrtPriceX96After", type: "uint160" },
      { name: "initializedTicksCrossed", type: "uint32" },
      { name: "gasEstimate", type: "uint256" },
    ],
  },
] as const;

// Common Uniswap v3 fee tiers (in hundredths of a bip).
export const FEE_TIERS = { LOW: 500, MEDIUM: 3000, HIGH: 10000 } as const;

export type PayToken = "BTC" | "WETH" | "USDC";

export function tokenAddress(token: PayToken): Address {
  switch (token) {
    case "BTC":
      return ADDRESSES.btc;
    case "WETH":
      return ADDRESSES.weth;
    case "USDC":
      return ADDRESSES.usdc;
  }
}

/**
 * Build the `exactOutputSingle` params that pay the merchant an EXACT BTC
 * amount, sourced from the buyer's `tokenIn`. Mirrors Uniswap's ISwapRouter.
 *
 * @param tokenIn         token the buyer pays with (WETH / USDC)
 * @param amountOutBtc    exact BTC (8-dec) the merchant must receive
 * @param amountInMaximum slippage cap on the input token
 */
export function buildExactOutputParams(opts: {
  tokenIn: Address;
  amountOutBtc: bigint;
  amountInMaximum: bigint;
  recipient: Address;
  fee?: number;
}) {
  return {
    tokenIn: opts.tokenIn,
    tokenOut: ADDRESSES.btc,
    fee: opts.fee ?? FEE_TIERS.MEDIUM,
    recipient: opts.recipient,
    amountOut: opts.amountOutBtc,
    amountInMaximum: opts.amountInMaximum,
    sqrtPriceLimitX96: 0n,
  } as const;
}

/** Apply a slippage tolerance (in basis points) to a quoted input amount. */
export function withSlippage(amount: bigint, slippageBps = 50n): bigint {
  return amount + (amount * slippageBps) / 10_000n;
}
