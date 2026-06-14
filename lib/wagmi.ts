import { http, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

/**
 * 체인/커넥터/RPC를 한 곳에 모은다.
 * - 개발: Sepolia 테스트넷.
 * - 저렴함이 핵심 가치이므로, 프로덕션에서는 여기 chains 만 저가 L2(Base/Arbitrum/Polygon)로
 *   바꾸면 결제 레이어 전체가 그대로 따라간다.
 * - 지갑 연결은 외부 키가 필요 없는 injected(MetaMask 등)만으로 동작한다.
 */
const sepoliaRpc = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;

export const config = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(sepoliaRpc && sepoliaRpc.length > 0 ? sepoliaRpc : undefined),
  },
  ssr: true,
});

export const ACTIVE_CHAIN = sepolia;

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
