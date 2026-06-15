/** @type {import('next').NextConfig} */

// GitHub Pages는 https://<user>.github.io/<repo>/ 처럼 하위 경로로 서빙되므로
// 워크플로우가 NEXT_PUBLIC_BASE_PATH=/<repo> 를 주입한다. 로컬 dev에서는 비어 있어 / 로 동작.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  reactStrictMode: true,
  // react-leaflet / @react-leaflet/core 는 ESM 전용 → Next가 트랜스파일하도록 명시(빌드 안정성)
  transpilePackages: ["react-leaflet", "@react-leaflet/core"],
  // GitHub Pages = 정적 호스팅 → 정적 export (서버 런타임 없음)
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    // 정적 export에서는 이미지 최적화 서버가 없으므로 비활성화
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**.higgsfield.ai" },
      { protocol: "https", hostname: "**.cloudfront.net" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // 배포는 타입체크로 충분 — ESLint 미설정으로 인한 CI 실패 방지
  eslint: { ignoreDuringBuilds: true },
  // 클라이언트에서 basePath를 참조할 수 있게 노출
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
