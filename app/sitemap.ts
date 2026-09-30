import type { MetadataRoute } from "next";
import { prisma } from "@/shared/lib/prisma";
import { restaurantPath, SITE_URL } from "@/shared/constants/site";

// 요청마다 DB의 최신 식당 목록으로 생성 (빌드 시 DB 접속 불필요)
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const restaurants = await prisma.restaurant.findMany({
    select: { id: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    ...restaurants.map((r) => ({
      url: `${SITE_URL}${restaurantPath(r.id)}`,
      lastModified: r.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
