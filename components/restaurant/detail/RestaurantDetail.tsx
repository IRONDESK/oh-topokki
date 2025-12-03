import React, { useEffect } from "react";
import clsx from "clsx";
import { useAtomValue } from "jotai";
import { useNaverMap } from "@/hooks/useNaverMap";
import { useQuery } from "@tanstack/react-query";
import { useIsDesktop } from "@/hooks/useIsDesktop";

import { detailStyle as style } from "@/components/restaurant/detail/detail.css";
import { fonts, typo } from "@/style/typo.css";
import {
  NOODLE_TYPE,
  SAUCE_TYPE,
  SIDE_MENU_TYPE,
  SUNDAE_TYPE,
  TOPOKKI_RICE_KINDS,
  TOPOKKI_TYPE,
} from "@/constants/restaurant";
import Icons from "@/share/components/Icons";
import { flexs } from "@/style/container.css";
import { getRestaurantDetail } from "@/service/naver-map";
import Spinner from "@/share/components/Spinner";
import ScrolledBottomSheet from "@/share/components/ScrolledBottomSheet";
import RestaurantReview from "@/components/restaurant/detail/RestaurantReview";
import { naverMapAtom } from "@/store/locationStore";
import { useFavorite } from "@/hooks/useFavorite";

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

  const { data: restaurant, isLoading } = useQuery({
    enabled: !!restaurantId,
    queryKey: ["restaurants", restaurantId],
    queryFn: () => getRestaurantDetail({ restaurantId }),
  });
  const { addFavorite } = useFavorite();

  const onClickFav = async () => {
    await addFavorite(restaurantId);
  };
  const onClickShare = () => {};

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
        <div className={style.contents}>
          <div
            className={clsx(style.stickyArea, style.innerPadding)}
            data-sticky={isSticky}
            data-desktop={isDesktop}
          >
            <div style={{ flex: 1 }}>
              <p className={flexs({ align: "center", justify: "start" })}>
                <span className={style.topokkiType} data-sticky={isSticky}>
                  {TOPOKKI_TYPE[topokkiType || (restaurant?.topokkiType ?? "")]}
                </span>
                <span className={style.stickyAddress} data-sticky={isSticky}>
                  {((address || restaurant?.address) as string)
                    ?.split(" ")
                    .slice(0, 3)
                    .join(" ")}
                </span>
              </p>
              <h2
                style={{ transition: "font-size 0.3s" }}
                className={clsx({
                  [fonts.body1.semibold]: !isSticky,
                  [fonts.body2.medium]: isSticky,
                })}
              >
                {restaurantName || restaurant?.name}
              </h2>
              <p
                className={typo({
                  size: "caption1",
                  weight: "regular",
                  color: "gray400",
                })}
                style={{ display: isSticky ? "none" : "block" }}
              >
                {address || restaurant?.address}
              </p>
            </div>
            <div className={flexs({ gap: "12" })}>
              <button
                type="button"
                className={style.favoriteBtn}
                data-favorite={true}
                onClick={onClickFav}
              >
                <Icons name="star" w="regular" t="round" size={24} />
              </button>
              <button type="button">
                <Icons name="share" w="regular" t="round" size={24} />
              </button>
            </div>
          </div>
          <p className={clsx(style.price, style.innerPadding)}>
            <span className={fonts.head6.semibold}>
              {price
                ? price?.toLocaleString()
                : restaurant?.price.toLocaleString()}
              원
            </span>
            <span
              className={typo({
                size: "body4",
                weight: "regular",
                color: "gray600",
              })}
            >
              1인당, 기본
            </span>
          </p>
          {isLoading && (
            <div className={style.loadingContainer}>
              <Spinner size={32} thick={3} />
            </div>
          )}
          {restaurant && !isLoading && (
            <dl className={clsx(style.detailItems, style.innerPadding)}>
              <dt>떡 종류</dt>
              <dd>
                {restaurant.riceKinds.map((kind) => (
                  <span key={kind}>{TOPOKKI_RICE_KINDS[kind]}</span>
                ))}
              </dd>
              <dt>소스 종류</dt>
              <dd>
                {restaurant.sauceKinds.map((kind) => (
                  <span key={kind}>{SAUCE_TYPE[kind]}</span>
                ))}
              </dd>
              {restaurant.noodleKinds.length > 0 && (
                <>
                  <dt>면 종류</dt>
                  <dd>
                    {restaurant.noodleKinds.map((kind) => (
                      <span key={kind}>{NOODLE_TYPE[kind]}</span>
                    ))}
                  </dd>
                </>
              )}
              <dt>매운 정도</dt>
              <dd>
                <p className={flexs({ gap: "4", justify: "start" })}>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <span
                      key={index}
                      className={style.spicy}
                      data-active={restaurant.spiciness >= index}
                    >
                      <Icons name="pepper" w="solid" size={18} />
                    </span>
                  ))}
                </p>
                <p
                  className={typo({
                    size: "body4",
                    weight: "medium",
                    color: "primary500",
                  })}
                >
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
              <dd className={flexs({ gap: "6", justify: "start", wrap: true })}>
                {restaurant.sideMenus.map((menu) => (
                  <span key={menu} className={style.sidemenu}>
                    {SIDE_MENU_TYPE[menu]}
                  </span>
                ))}
              </dd>
              <dt>기타</dt>
              <dd className={flexs({ gap: "6", justify: "start", wrap: true })}>
                {restaurant.others.map((menu) => (
                  <span key={menu} className={style.sidemenu}>
                    {menu}
                  </span>
                ))}
              </dd>
            </dl>
          )}
          <div className={style.divider} />
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
