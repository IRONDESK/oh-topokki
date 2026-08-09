import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

const RANKING_SIZE = 10;

// 인기 랭킹: 조회수 → 찜 수 → 리뷰 수 순으로 정렬해 최대 10곳.
// 활동(조회/찜/리뷰)이 하나도 없는 식당은 순위에 넣지 않고,
// 빈 자리는 최근 등록된 식당으로 채우되 unrank: true로 구분한다.
export async function GET() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      select: {
        id: true,
        name: true,
        viewCount: true,
        createdAt: true,
        _count: { select: { favorites: true, reviews: true } },
      },
    });

    const items = restaurants.map((r) => ({
      id: r.id,
      name: r.name,
      viewCount: r.viewCount,
      favoriteCnt: r._count.favorites,
      reviewCnt: r._count.reviews,
      createdAt: r.createdAt,
    }));

    const ranked = items
      .filter((r) => r.viewCount > 0 || r.favoriteCnt > 0 || r.reviewCnt > 0)
      .sort(
        (a, b) =>
          b.viewCount - a.viewCount ||
          b.favoriteCnt - a.favoriteCnt ||
          b.reviewCnt - a.reviewCnt,
      )
      .slice(0, RANKING_SIZE);

    const rankedIds = new Set(ranked.map((r) => r.id));
    const fillers = items
      .filter((r) => !rankedIds.has(r.id))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, RANKING_SIZE - ranked.length);

    const result = [
      ...ranked.map(({ createdAt: _, ...r }) => ({ ...r, unrank: false })),
      ...fillers.map(({ createdAt: _, ...r }) => ({ ...r, unrank: true })),
    ];

    return NextResponse.json(result);
  } catch (error) {
    console.error("랭킹 조회 오류:", error);
    return NextResponse.json(
      { message: "랭킹 조회에 실패했습니다." },
      { status: 500 },
    );
  }
}
