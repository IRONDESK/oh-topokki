import type { Metadata } from "next";
import { ResponseRestaurant } from "@/shared/api/model/restaurant";
import {
  RICE_TYPE,
  SAUCE_TYPE,
  TOPOKKI_TYPE,
} from "@/shared/constants/restaurant";
import { restaurantPath, SITE_NAME, SITE_URL } from "@/shared/constants/site";
import { getYoutubeIds } from "@/shared/lib/youtube";

// "부산 동구 초량로 63" → "부산 동구"
const region = (address: string) => address.split(" ").slice(0, 2).join(" ");

const labels = (values: string[], dict: Record<string, string>) =>
  values.map((v) => dict[v] ?? v).join("·");

function describe(r: ResponseRestaurant) {
  return [
    r.riceTypes.length > 0 && labels(r.riceTypes, RICE_TYPE),
    r.sauceTypes.length > 0 && `${labels(r.sauceTypes, SAUCE_TYPE)} 소스`,
    r.spiciness != null && `매운맛 ${r.spiciness}단계`,
    r.price &&
      `${r.price.toLocaleString("ko-KR")}원${(r.priceServings ?? 1) > 1 ? ` (${r.priceServings}인)` : ""}`,
    r.reviewCount > 0 && `리뷰 ${r.reviewCount}개`,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function buildRestaurantMetadata(r: ResponseRestaurant): Metadata {
  const type = TOPOKKI_TYPE[r.topokkiType] ?? "떡볶이";
  const title = `${r.name} - ${region(r.address)} ${type}`;
  const description = `${r.address} ${r.name}. ${describe(r)}`;
  const url = restaurantPath(r.id);
  // 유튜브 소개 영상이 있으면 대표 썸네일을 공유 미리보기 이미지로 사용
  const [videoId] = getYoutubeIds(r.recommend);
  const images = videoId
    ? [{ url: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`, width: 480, height: 360 }]
    : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "ko_KR",
      url,
      title,
      description,
      images,
    },
    twitter: { card: images ? "summary_large_image" : "summary", title, description },
  };
}

/** schema.org Restaurant 구조화 데이터 (검색 결과 리치 스니펫용) */
export function buildRestaurantJsonLd(r: ResponseRestaurant) {
  const rated = r.reviews.filter((review) => review.rating != null);

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE_URL}${restaurantPath(r.id)}`,
    url: `${SITE_URL}${restaurantPath(r.id)}`,
    name: r.name,
    servesCuisine: ["떡볶이", "분식"],
    address: {
      "@type": "PostalAddress",
      streetAddress: r.address,
      addressCountry: "KR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: r.latitude,
      longitude: r.longitude,
    },
    ...(r.phoneNumber && { telephone: r.phoneNumber }),
    // 세트(n인분) 가격은 1인 기준으로 환산해 시작가로 표기
    ...(r.price && {
      priceRange: `₩${Math.round(r.price / (r.priceServings || 1)).toLocaleString("ko-KR")}~`,
    }),
    ...(rated.length > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: Number(r.averageRating.toFixed(1)),
        ratingCount: rated.length,
        bestRating: 5,
        worstRating: 1,
      },
      review: rated.slice(0, 5).map((review) => ({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: review.author?.nickname ?? review.guestNickname ?? "탈퇴한 사용자",
        },
        datePublished: review.createdAt.slice(0, 10),
        reviewBody: review.content,
        reviewRating: {
          "@type": "Rating",
          ratingValue: review.rating,
          bestRating: 5,
          worstRating: 1,
        },
      })),
    }),
  };
}
