import type { NextConfig } from "next";
import pkg from "./package.json";

// 빌드(=배포) 시점의 KST 날짜. 서비스 안내 모달에 "마지막 배포일"로 표시한다.
const buildDate = new Date().toLocaleDateString("sv-SE", {
  timeZone: "Asia/Seoul",
});

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_NAVER_MAP_CLIENT_ID:
      process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID,
    NEXT_PUBLIC_APP_VERSION: pkg.version,
    NEXT_PUBLIC_BUILD_DATE: buildDate,
  },
};

export default nextConfig;
