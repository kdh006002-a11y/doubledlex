"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { baseSepolia, base } from "wagmi/chains";

// WalletConnect Cloud project id — get one free at https://cloud.walletconnect.com
const projectId =
  process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? "YOUR_WALLETCONNECT_PROJECT_ID";

export const config = getDefaultConfig({
  appName: "BTC Coupang",
  projectId,
  // baseSepolia = Base testnet (use this for development).
  // `base` (mainnet) is included so you can flip to real funds later.
  chains: [baseSepolia, base],
  ssr: true,
});

// The chain the storefront transacts on by default.
export const ACTIVE_CHAIN = baseSepolia;
