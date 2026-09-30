import { useEffect } from "react";
import { useMapFocus } from "@/shared/hooks/useMapFocus";
import { useRestaurantDetail } from "@/features/restaurant/api/use-restaurant";
import { ResponseRestaurant } from "@/shared/api/model/restaurant";
import { TOPOKKI_TYPE } from "@/shared/constants/restaurant";
import type { RestaurantPreview } from "@/features/restaurant/model/detail-navigation";
import { getYoutubeIds } from "@/shared/lib/youtube";

import Spinner from "@/shared/ui/Spinner";
import ScrolledBottomSheet, {
  closeSheet,
  type SheetController,
} from "@/shared/ui/ScrolledBottomSheet";
import DetailHeader from "@/features/restaurant/ui/detail/DetailHeader";
import DetailInfo from "@/features/restaurant/ui/detail/DetailInfo";
import AuthorActions from "@/features/restaurant/ui/detail/AuthorActions";
import InfluencerSection from "@/features/restaurant/ui/detail/InfluencerSection";
import RestaurantReview from "@/features/restaurant/ui/detail/RestaurantReview";

type Props = {
  restaurantId: string;
  preview?: RestaurantPreview;
  initialData?: ResponseRestaurant; // 서버 렌더링 데이터
  controller: SheetController;
};

// 섹션 사이 구분 (두꺼운 회색 띠)
const DIVIDER_CLS = "shrink-0 h-2 bg-gray-100";

// "판떡볶이 · 리뷰 3 · 조회 12"
function buildMeta(
  summary: RestaurantPreview,
  restaurant?: ResponseRestaurant,
) {
  return [
    TOPOKKI_TYPE[summary.topokkiType],
    restaurant && restaurant.reviewCount > 0 && `리뷰 ${restaurant.reviewCount}`,
    restaurant && `조회 ${restaurant.viewCount.toLocaleString()}`,
  ]
    .filter(Boolean)
    .join(" · ");
}

function RestaurantDetail({
  restaurantId,
  preview,
  initialData,
  controller,
}: Props) {
  const { data: restaurant, isLoading } = useRestaurantDetail(
    restaurantId,
    initialData,
  );
  const focusMap = useMapFocus();

  // 조회 전엔 preview 값으로 먼저 그린다
  const summary = restaurant ?? preview;
  const lat = summary?.latitude;
  const lng = summary?.longitude;
  const videoIds = restaurant ? getYoutubeIds(restaurant.recommend) : [];
  const onClose = () => closeSheet(controller);

  useEffect(() => {
    if (lat != null && lng != null) focusMap({ lat, lng });
  }, [lat, lng, focusMap]);

  return (
    <ScrolledBottomSheet controller={controller}>
      {({ isSticky }) => (
        <div className="h-full flex flex-col">
          <DetailHeader
            restaurantId={restaurantId}
            name={summary?.name}
            meta={summary && buildMeta(summary, restaurant)}
            isFavorite={restaurant?.isFavorite}
            isSticky={isSticky}
          />
          {summary?.price != null && (
            <p className="px-5 pt-3 pb-5 flex items-baseline gap-1.5">
              <span className="text-lg font-semibold text-gray-900">
                {summary.price.toLocaleString()}원
              </span>
              <span className="text-sm text-gray-500">
                {(summary.priceServings ?? 1) > 1
                  ? `${summary.priceServings}인 기준`
                  : "1인 기본"}
              </span>
            </p>
          )}

          {isLoading && (
            <div className="flex justify-center py-12">
              <Spinner size={32} thick={3} />
            </div>
          )}

          {restaurant && (
            <>
              <div className={DIVIDER_CLS} />
              <section className="px-5 py-6 flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-gray-900">정보</h3>
                <DetailInfo restaurant={restaurant} />
                <AuthorActions restaurant={restaurant} onClose={onClose} />
              </section>
              {/* 유튜브 소개 영상이 있을 때만 리뷰 위에 노출 */}
              {videoIds.length > 0 && (
                <>
                  <div className={DIVIDER_CLS} />
                  <InfluencerSection videoIds={videoIds} />
                </>
              )}
              <div className={DIVIDER_CLS} />
              <RestaurantReview
                restaurantId={restaurant.id}
                initialReviews={restaurant.reviews}
                restaurantAuthorId={restaurant.authorId}
              />
            </>
          )}
        </div>
      )}
    </ScrolledBottomSheet>
  );
}

export default RestaurantDetail;
