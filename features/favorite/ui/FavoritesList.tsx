"use client";

import { useFavorites } from "@/features/favorite/api/use-favorite";
import { ResponseFavorite } from "@/shared/api/model/restaurant";
import { TOPOKKI_TYPE, RICE_TYPE } from "@/shared/constants/restaurant";

import ScrolledBottomSheet, {
  closeSheet,
  type SheetController,
} from "@/shared/ui/ScrolledBottomSheet";
import { useOpenRestaurantDetail } from "@/features/restaurant/model/detail-navigation";
import Spinner from "@/shared/ui/Spinner";

type Props = {
  controller: SheetController;
};

function FavoritesList({ controller }: Props) {
  const { data: favorites, isLoading } = useFavorites();
  const openDetail = useOpenRestaurantDetail();

  // 목록 시트를 닫고 상세 시트를 연다 (지도 이동은 상세 시트가 처리)
  const onClickItem = (item: ResponseFavorite) => {
    closeSheet({
      close: controller.close,
      unmount: () => {
        controller.unmount();
        openDetail(item.id, item);
      },
    });
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
                    {item.riceTypes
                      .map((kind) => RICE_TYPE[kind] || kind)
                      .join(", ")}{" "}
                    {item.price?.toLocaleString()}원
                    {(item.priceServings ?? 1) > 1 &&
                      `(${item.priceServings}인)`}
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

export default FavoritesList;
