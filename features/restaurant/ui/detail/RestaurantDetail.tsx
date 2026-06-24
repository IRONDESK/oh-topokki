import React, { useEffect } from "react";
import clsx from "clsx";
import { useAtomValue } from "jotai";
import { useNaverMap } from "@/shared/hooks/useNaverMap";
import { useIsDesktop } from "@/shared/hooks/useIsDesktop";
import { useFavorite } from "@/features/favorite/api/use-favorite";
import { useNativeShare } from "@/shared/hooks/useNativeShare";
import { useRestaurantDetail } from "@/features/restaurant/api/use-restaurant";

import {
  NOODLE_TYPE,
  SAUCE_TYPE,
  SIDE_MENU_TYPE,
  SUNDAE_TYPE,
  RICE_TYPE,
  TOPOKKI_TYPE,
} from "@/shared/constants/restaurant";
import Icons from "@/shared/ui/Icons";
import Tag from "@/shared/ui/Tag";
import Spinner from "@/shared/ui/Spinner";
import ScrolledBottomSheet from "@/shared/ui/ScrolledBottomSheet";
import RestaurantReview from "@/features/restaurant/ui/detail/RestaurantReview";
import { naverMapAtom } from "@/shared/store/locationStore";

type Props = {
  restaurantId: string;
  restaurantName?: string;
  topokkiType?: string;
  price?: number;
  address?: string;
  controller: {
    close: () => void;
    isOpen: boolean;
    unmount: () => void;
  };
};

const INNER_PADDING = "px-5";
const STICKY_AREA_CLS =
  "sticky flex items-center px-4 pb-4 bg-white top-0 data-[sticky=true]:gap-1 data-[sticky=true]:px-4 data-[sticky=true]:pt-2.5 data-[sticky=true]:pb-3 data-[sticky=true]:shadow-lg data-[sticky=true]:z-10 data-[desktop=true]:px-4 data-[desktop=true]:pb-4 data-[desktop=true][data-sticky=true]:px-4 data-[desktop=true][data-sticky=true]:pt-4 data-[desktop=true][data-sticky=true]:pb-9 data-[desktop=true][data-sticky=true]:shadow-none data-[desktop=true][data-sticky=true]:[background:linear-gradient(to_bottom,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_70%,rgba(255,255,255,0)_100%)]";

const TOPOKKI_TYPE_CLS =
  "inline-flex text-sm font-medium text-primary-500 data-[sticky=true]:text-primary-600";

const STICKY_ADDRESS_CLS =
  "text-xs font-normal text-gray-400 opacity-0 inline-flex ml-1 -translate-x-4 [transition:opacity_0.2s,transform_0.3s] data-[sticky=true]:opacity-100 data-[sticky=true]:translate-x-0";

const DETAIL_ITEMS_CLS =
  "grid grid-cols-[min(30%,100px)_1fr] gap-x-1.5 gap-y-3 text-base font-normal [&>dt]:font-semibold [&>dt]:text-gray-600";

const PRICE_CLS =
  "mb-4 pt-4 flex items-center gap-1.5 border-t border-gray-200";

const DIVIDER_CLS = "shrink-0 mt-6 mb-[18px] w-full h-2 bg-gray-100";

function RestaurantDetail(props: Props) {
  const {
    restaurantId,
    restaurantName,
    price,
    address,
    topokkiType,
    controller,
  } = props;

  const { naver } = useNaverMap();
  const map = useAtomValue(naverMapAtom);
  const isDesktop = useIsDesktop();

  const { data: restaurant, isLoading } = useRestaurantDetail(restaurantId);
  const { handleFavorite } = useFavorite();
  const { share } = useNativeShare();

  const onClickFav = async () => {
    await handleFavorite(restaurantId);
  };

  const onClickShare = async () => {
    const shareData = {
      title: `${restaurantName || restaurant?.name} - 오늘의떡볶이`,
      text: `${restaurantName || restaurant?.name}의 떡볶이 정보를 확인해보세요!`,
      url: window.location.href,
    };

    await share(shareData);
  };

  useEffect(() => {
    if (!map || !naver || !restaurant) return;
    const offsetLat = 0.00195;
    const adjustedPosition = new naver.LatLng(
      restaurant.latitude - offsetLat,
      restaurant.longitude,
    );

    map.setCenter(adjustedPosition);
    map.setZoom(17);
  }, [restaurant]);

  return (
    <ScrolledBottomSheet controller={controller}>
      {({ isSticky }) => (
        <div className="h-full flex flex-col">
          <div
            data-sticky={isSticky}
            data-desktop={isDesktop}
            className={clsx(STICKY_AREA_CLS, INNER_PADDING)}
          >
            <div style={{ flex: 1 }}>
              <p className="flex items-center justify-start">
                <span data-sticky={isSticky} className={TOPOKKI_TYPE_CLS}>
                  {TOPOKKI_TYPE[topokkiType || (restaurant?.topokkiType ?? "")]}
                </span>
                <span data-sticky={isSticky} className={STICKY_ADDRESS_CLS}>
                  {((address || restaurant?.address) as string)
                    ?.split(" ")
                    .slice(0, 3)
                    .join(" ")}
                </span>
              </p>
              <h2
                style={{ transition: "font-size 0.3s" }}
                className={
                  isSticky
                    ? "text-lg font-medium"
                    : "text-xl font-semibold"
                }
              >
                {restaurantName || restaurant?.name}
              </h2>
              <p
                style={{ display: isSticky ? "none" : "block" }}
                className="text-xs font-normal text-gray-400"
              >
                {address || restaurant?.address}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                data-favorite={true}
                onClick={onClickFav}
                className="cursor-pointer data-[favorite=true]:text-primary-600"
              >
                <Icons
                  name="star"
                  w={restaurant?.isFavorite ? "solid" : "regular"}
                  t="round"
                  size={24}
                />
              </button>
              <button type="button" onClick={onClickShare}>
                <Icons name="share" w="regular" t="round" size={24} />
              </button>
            </div>
          </div>
          <p className={clsx(PRICE_CLS, INNER_PADDING)}>
            <span className="text-2xl font-semibold">
              {price
                ? price?.toLocaleString()
                : restaurant?.price.toLocaleString()}
              원
            </span>
            <span className="text-sm font-normal text-gray-600">
              1인당, 기본
            </span>
          </p>
          {isLoading && (
            <div className="flex justify-center my-12 mx-auto">
              <Spinner size={32} thick={3} />
            </div>
          )}
          {restaurant && !isLoading && (
            <dl className={clsx(DETAIL_ITEMS_CLS, INNER_PADDING)}>
              <dt>떡 종류</dt>
              <dd>
                {restaurant.riceTypes
                  .map((kind) => RICE_TYPE[kind])
                  .join(", ")}
              </dd>
              <dt>소스 종류</dt>
              <dd>
                {restaurant.sauceTypes
                  .map((kind) => SAUCE_TYPE[kind])
                  .join(", ")}
              </dd>
              {restaurant.noodleTypes.length > 0 && (
                <>
                  <dt>면 종류</dt>
                  <dd>
                    {restaurant.noodleTypes
                      .map((kind) => NOODLE_TYPE[kind])
                      .join(", ")}
                  </dd>
                </>
              )}
              <dt>매운 정도</dt>
              <dd>
                <p className="flex gap-1 justify-start items-center">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <span
                      key={index}
                      data-active={restaurant.spiciness >= index}
                      className="text-primary-200 data-[active=true]:text-primary-600"
                    >
                      <Icons name="pepper" w="solid" size={18} />
                    </span>
                  ))}
                </p>
                <p className="text-sm font-medium text-primary-500">
                  {SPICINESS_DESCRIPTION[restaurant.spiciness]}
                </p>
              </dd>
              <dt>순대</dt>
              <dd>
                {restaurant.sundaeType
                  ? SUNDAE_TYPE[restaurant.sundaeType]
                  : "순대는 없어요"}
              </dd>
              <dt>사이드메뉴</dt>
              <dd className="flex gap-1.5 justify-start items-center flex-wrap">
                {restaurant.sideMenus.map((menu) => (
                  <Tag key={menu} fill="gray">
                    {SIDE_MENU_TYPE[menu]}
                  </Tag>
                ))}
              </dd>
              <dt>기타</dt>
              <dd className="flex gap-1.5 justify-start items-center flex-wrap">
                {restaurant.others.map((menu) => (
                  <Tag key={menu} fill="gray">
                    {menu}
                  </Tag>
                ))}
              </dd>
            </dl>
          )}
          <div className={DIVIDER_CLS} />
          {restaurant && (
            <RestaurantReview
              restaurantId={restaurant?.id}
              initialReviews={restaurant?.reviews}
              initial={{
                createAt: restaurant.createdAt,
                authorId: restaurant.authorId,
              }}
            />
          )}
        </div>
      )}
    </ScrolledBottomSheet>
  );
}

const SPICINESS_DESCRIPTION: Record<string, string> = {
  0: "외국인도 누구나 즐겨요",
  1: "진라면 정도로 매워요",
  2: "신라면 정도로 매워요",
  3: "신라면보다 약간 더 매워요",
  4: "불닭볶음면 정도로 매워요",
  5: "불닭보다 훨씬 매워요",
};

export default RestaurantDetail;
