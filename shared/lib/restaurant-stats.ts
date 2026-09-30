import { revalidatePath } from "next/cache";
import { prisma } from "@/shared/lib/prisma";
import { restaurantPath } from "@/shared/constants/site";

/** 리뷰 변경 후 식당의 평균 별점(별점 있는 리뷰만)·리뷰 개수(전체)를 다시 계산한다. */
export async function syncRestaurantStats(restaurantId: string) {
  const allReviews = await prisma.review.findMany({
    where: { restaurantId },
    select: { rating: true },
  });
  const ratedReviews = allReviews.filter((r) => r.rating != null);
  const averageRating =
    ratedReviews.length > 0
      ? ratedReviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) /
        ratedReviews.length
      : 0;

  await prisma.restaurant.update({
    where: { id: restaurantId },
    data: { averageRating, reviewCount: allReviews.length },
  });
  // 서버 렌더링된 상세 페이지(ISR 캐시)도 새 리뷰로 갱신
  revalidatePath(restaurantPath(restaurantId));
}
