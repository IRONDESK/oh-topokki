import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_NAVER_MAP_CLIENT_ID:
      process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID,
  },
};

export default nextConfig;
