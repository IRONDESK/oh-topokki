import { cache } from "react";
import { prisma } from "@/shared/lib/prisma";

const AUTHOR_SELECT = { id: true, nickname: true, image: true } as const;

/**
 * 식당 상세 조회 (서버 전용). 조회수 증가·즐겨찾기 여부는 호출하는 쪽에서 처리한다.
 * React cache로 감싸 한 요청 안에서 generateMetadata와 page가 같은 결과를 공유한다.
 */
export const findRestaurantDetail = cache(async (id: string) => {
  const restaurant = await prisma.restaurant.findUnique({ where: { id } });
  if (!restaurant) return null;

  const [author, reviews, favoriteCnt] = await Promise.all([
    // 탈퇴한 작성자는 authorId가 null
    restaurant.authorId
      ? prisma.user.findUnique({
          where: { id: restaurant.authorId },
          select: AUTHOR_SELECT,
        })
      : null,
    prisma.review.findMany({
      where: { restaurantId: id },
      include: { author: { select: AUTHOR_SELECT } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.favorite.count({ where: { restaurantId: id } }),
  ]);

  return {
    ...restaurant,
    author: author ?? null,
    reviews,
    favoriteCnt,
    _count: { reviews: reviews.length },
  };
});
