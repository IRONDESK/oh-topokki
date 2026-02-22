"use client";

import { ComponentProps } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import type { OverlayControllerComponent } from "overlay-kit";
import { overlay } from "overlay-kit";

import { naverMapAtom } from "@/store/locationStore";
import { useNaverMap } from "@/hooks/useNaverMap";
import { getFavorites } from "@/service/restaurant";
import { ResponseFavorite } from "@/service/model/restaurant";

import ScrolledBottomSheet from "@/share/components/ScrolledBottomSheet";
import RestaurantDetail from "@/components/restaurant/detail/RestaurantDetail";
import Spinner from "@/share/components/Spinner";
import { typo } from "@/style/typo.css";
import { flexs } from "@/style/container.css";
import { favoriteStyle as style } from "@/components/favorite/favorite.css";

type Props = {
  controller: ComponentProps<OverlayControllerComponent>;
};

function FavoritesList({ controller }: Props) {
  const { naver } = useNaverMap();
  const map = useAtomValue(naverMapAtom);

  const { data: favorites, isLoading } = useQuery({
    queryKey: ["getFavorites"],
    queryFn: getFavorites,
  });

  const onClickItem = (item: ResponseFavorite) => {
    if (!map || !naver) return;

    controller.close();
    setTimeout(() => {
      controller.unmount();

      const offsetLat = 0.00195;
      const targetLocation = new naver.LatLng(
        item.latitude - offsetLat,
        item.longitude,
      );
      map.setCenter(targetLocation);
      map.setZoom(17);

      overlay.open(
        (detailController) => (
          <RestaurantDetail
            restaurantId={item.id}
            restaurantName={item.name}
            topokkiType={item.topokkiType}
            price={item.price}
            address={item.address}
            controller={detailController}
          />
        ),
        { overlayId: "restaurant-detail" },
      );
    }, 300);
  };

  return (
    <ScrolledBottomSheet controller={controller}>
      {() => (
        <div className={style.container}>
          <div className={style.header}>
            <span
              className={typo({
                size: "body2",
                weight: "semibold",
                color: "gray700",
              })}
            >
              즐겨찾기
            </span>
          </div>

          {isLoading && (
            <div
              style={{ paddingTop: "32px" }}
              className={flexs({ justify: "center", align: "center" })}
            >
              <Spinner size={32} thick={3} color="primary" />
            </div>
          )}

          {!isLoading && (!favorites || favorites.length === 0) && (
            <div className={style.empty}>
              <span
                className={typo({
                  size: "body3",
                  weight: "regular",
                  color: "gray500",
                })}
              >
                즐겨찾기한 맛집이 없어요
              </span>
            </div>
          )}

          <div>
            {favorites?.map((item) => (
              <div
                key={item.id}
                className={style.item}
                onClick={() => onClickItem(item)}
              >
                <p
                  className={flexs({
                    justify: "spb",
                    align: "center",
                    gap: "4",
                  })}
                >
                  <span
                    className={typo({
                      size: "body3",
                      weight: "medium",
                      color: "gray700",
                    })}
                  >
                    {item.name}
                  </span>
                  <span
                    className={typo({
                      size: "caption1",
                      weight: "medium",
                      color: "primary500",
                    })}
                  >
                    {TOPOKKI_TYPE[item.topokkiType]}
                  </span>
                </p>
                <p
                  className={flexs({
                    justify: "spb",
                    align: "center",
                    gap: "2",
                  })}
                >
                  <span
                    className={typo({
                      size: "body4",
                      weight: "regular",
                      color: "gray500",
                    })}
                  >
                    {item.riceType
                      .map((kind) => RICE_KINDS[kind] || kind)
                      .join(", ")}
                  </span>
                  <span
                    className={typo({
                      size: "body4",
                      weight: "regular",
                      color: "gray500",
                    })}
                  >
                    {item.price?.toLocaleString()}원
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </ScrolledBottomSheet>
  );
}

const TOPOKKI_TYPE: Record<string, string> = {
  ontable: "즉석떡볶이",
  pan: "판떡볶이",
  soup: "국물떡볶이",
};

const RICE_KINDS: Record<string, string> = {
  longrice: "가래떡",
  flour: "밀떡",
  rice: "쌀떡",
};

export default FavoritesList;
