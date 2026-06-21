"use client";

import { ComponentProps } from "react";
import { useAtomValue } from "jotai";
import type { OverlayControllerComponent } from "overlay-kit";
import { overlay } from "overlay-kit";

import { naverMapAtom } from "@/shared/store/locationStore";
import { useNaverMap } from "@/shared/hooks/useNaverMap";
import { useFavorites } from "@/features/favorite/api/use-favorite";
import { ResponseFavorite } from "@/shared/api/model/restaurant";

import ScrolledBottomSheet from "@/shared/ui/ScrolledBottomSheet";
import RestaurantDetail from "@/features/restaurant/ui/detail/RestaurantDetail";
import Spinner from "@/shared/ui/Spinner";

type Props = {
  controller: ComponentProps<OverlayControllerComponent>;
};

function FavoritesList({ controller }: Props) {
  const { naver } = useNaverMap();
  const map = useAtomValue(naverMapAtom);

  const { data: favorites, isLoading } = useFavorites();

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
        <div className="px-4">
          <div className="px-0.5 py-1 pb-3.5 mb-2.5 border-b border-gray-200">
            <span className="text-lg font-semibold text-gray-700">
              즐겨찾기
            </span>
          </div>

          {isLoading && (
            <div className="flex justify-center items-center pt-8">
              <Spinner size={32} thick={3} color="primary" />
            </div>
          )}

          {!isLoading && (!favorites || favorites.length === 0) && (
            <div className="py-12 text-center">
              <span className="text-base font-normal text-gray-500">
                즐겨찾기한 맛집이 없어요
              </span>
            </div>
          )}

          <div>
            {favorites?.map((item) => (
              <div
                key={item.id}
                className="cursor-pointer w-full px-1 py-3 border-b border-gray-100 last-of-type:border-b-0"
                onClick={() => onClickItem(item)}
              >
                <p className="flex justify-between items-center gap-1">
                  <span className="text-base font-medium text-gray-700">
                    {item.name}
                  </span>
                  <span className="text-xs font-medium text-primary-400">
                    {TOPOKKI_TYPE[item.topokkiType]}
                  </span>
                </p>
                <p className="flex justify-between items-center gap-1">
                  <span className="text-sm font-normal text-gray-500">
                    {item.address.split(" ").slice(0, 2).join(" ")}
                  </span>
                  <span className="text-sm font-normal text-primary-500">
                    {item.riceType
                      .map((kind) => RICE_KINDS[kind] || kind)
                      .join(", ")}{" "}
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
