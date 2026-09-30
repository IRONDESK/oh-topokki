import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findRestaurantDetail } from "@/features/restaurant/api/restaurant-detail.server";
import {
  buildRestaurantJsonLd,
  buildRestaurantMetadata,
} from "@/features/restaurant/lib/restaurant-seo";
import { ResponseRestaurant } from "@/shared/api/model/restaurant";
import RestaurantDetailRoute from "@/features/restaurant/ui/detail/RestaurantDetailRoute";

// 첫 방문 시 렌더링해 5분간 캐시(ISR). 맛집·리뷰 변경 시 revalidatePath로 즉시 갱신.
// 빌드 시점에는 미리 만들지 않는다(빈 배열) — 빌드에 DB가 필요 없고 새 식당도 바로 열린다.
export const revalidate = 300;
export async function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ id: string }> };

// API 응답과 같은 형태(날짜는 ISO 문자열)로 직렬화. 즐겨찾기 여부는 클라이언트 재조회로 채운다.
async function getRestaurant(id: string): Promise<ResponseRestaurant | null> {
  const restaurant = await findRestaurantDetail(id);
  if (!restaurant) return null;
  return JSON.parse(JSON.stringify({ ...restaurant, isFavorite: null }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const restaurant = await getRestaurant((await params).id);
  if (!restaurant) return { title: "맛집을 찾을 수 없어요", robots: { index: false } };
  return buildRestaurantMetadata(restaurant);
}

export default async function RestaurantPage({ params }: Props) {
  const { id } = await params;
  const restaurant = await getRestaurant(id);
  if (!restaurant) notFound();

  const jsonLd = JSON.stringify(buildRestaurantJsonLd(restaurant)).replace(
    /</g,
    "\\u003c",
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <RestaurantDetailRoute
        key={id}
        restaurantId={id}
        initialData={restaurant}
      />
    </>
  );
}
