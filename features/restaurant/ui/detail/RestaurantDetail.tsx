import { useEffect } from "react";
import { useMapFocus } from "@/shared/hooks/useMapFocus";
import { useRestaurantDetail } from "@/features/restaurant/api/use-restaurant";
import { ResponseRestaurant } from "@/shared/api/model/restaurant";
import { TOPOKKI_TYPE } from "@/shared/constants/restaurant";
import { getYoutubeIds } from "@/shared/lib/youtube";

import Icons from "@/shared/ui/Icons";
import Spinner from "@/shared/ui/Spinner";
import NaverMapButton from "@/shared/ui/NaverMapButton";
import ScrolledBottomSheet, {
  closeSheet,
  type SheetController,
} from "@/shared/ui/ScrolledBottomSheet";
import DetailHeader from "@/features/restaurant/ui/detail/DetailHeader";
import DetailInfo from "@/features/restaurant/ui/detail/DetailInfo";
import InfluencerSection from "@/features/restaurant/ui/detail/InfluencerSection";
import RestaurantReview from "@/features/restaurant/ui/detail/RestaurantReview";

/** 상세 조회 전에 먼저 보여줄 수 있는 값 (마커·즐겨찾기 목록이 이미 가진 필드) */
export type RestaurantPreview = Pick<
  ResponseRestaurant,
  "name" | "address" | "price" | "topokkiType" | "latitude" | "longitude"
>;

type Props = {
  restaurantId: string;
  preview?: RestaurantPreview;
  controller: SheetController;
};

const DIVIDER_CLS = "shrink-0 mt-6 mb-[18px] w-full h-2 bg-gray-100";

function RestaurantDetail({ restaurantId, preview, controller }: Props) {
  const { data: restaurant, isLoading } = useRestaurantDetail(restaurantId);
  const focusMap = useMapFocus();

  // 조회 전엔 preview 값으로 먼저 그린다
  const summary = restaurant ?? preview;
  const lat = summary?.latitude;
  const lng = summary?.longitude;
  const videoIds = restaurant ? getYoutubeIds(restaurant.recommend) : [];

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
            address={summary?.address}
            restaurant={restaurant}
            isSticky={isSticky}
            onClose={() => closeSheet(controller)}
          />
          <p className="mb-4 pt-4 px-5 flex items-center gap-1.5 border-t border-gray-200">
            <span className="text-2xl font-semibold text-gray-700">
              {summary?.price?.toLocaleString()}원
            </span>
            <span className="text-sm font-normal text-gray-600/90">
              1인당, 기본
            </span>
          </p>
          <div className="px-5 mt-2 mb-3 flex items-center justify-between text-lg text-gray-500 font-medium">
            {summary && TOPOKKI_TYPE[summary.topokkiType]}
            {restaurant && (
              <span className="flex items-center gap-1 text-sm font-normal text-gray-400">
                <Icons name="eye" w="regular" size={14} />
                조회 {restaurant.viewCount.toLocaleString()}
              </span>
            )}
          </div>

          {isLoading && (
            <div className="flex justify-center my-12 mx-auto">
              <Spinner size={32} thick={3} />
            </div>
          )}

          {restaurant && (
            <>
              <DetailInfo restaurant={restaurant} />
              <div className="px-5 mt-6 flex">
                <NaverMapButton place={restaurant} label="지도앱에서 보기" />
              </div>
              <div className={DIVIDER_CLS} />
              {/* 유튜브 소개 영상이 있을 때만 리뷰 위에 노출 */}
              {videoIds.length > 0 && (
                <>
                  <InfluencerSection videoIds={videoIds} />
                  <div className={DIVIDER_CLS} />
                </>
              )}
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
