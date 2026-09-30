import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/shared/constants/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} - 오늘의 떡볶이를 찾아보세요`,
    short_name: SITE_NAME,
    description: "내 취향의 떡볶이 맛집을 쉽게 찾아보세요",
    start_url: "/",
    display: "standalone",
    background_color: "#fff4ea",
    theme_color: "#fff4ea",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
