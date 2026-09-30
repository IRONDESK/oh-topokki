"use client";

import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { overlay } from "overlay-kit";
import { ResponseRestaurant } from "@/shared/api/model/restaurant";
import {
  restaurantPreviewAtom,
  useCloseRestaurantDetail,
} from "@/features/restaurant/model/detail-navigation";
import RestaurantDetail from "@/features/restaurant/ui/detail/RestaurantDetail";

type Props = {
  restaurantId: string;
  // 서버에서 조회한 데이터 (page.tsx). 없으면 loading 상태로 preview만 먼저 그린다.
  initialData?: ResponseRestaurant;
};

/** /restaurants/[id] 라우트의 상세 바텀시트. 닫히면 지도(/)로 돌아간다. */
export default function RestaurantDetailRoute({
  restaurantId,
  initialData,
}: Props) {
  const preview = useAtomValue(restaurantPreviewAtom)[restaurantId];
  const closeRoute = useCloseRestaurantDetail();
  // 서버 렌더링된 내용이 있으면 처음부터 열린 상태로 그린다 (검색엔진·첫 화면에 바로 노출).
  // 클라이언트 이동(loading)일 때만 닫힌 상태에서 슬라이드 인.
  const [isOpen, setIsOpen] = useState(!!initialData);

  useEffect(() => {
    setIsOpen(true);
    // 검색·즐겨찾기 등 상세를 열기 전 띄워 둔 오버레이 정리
    overlay.unmountAll();
  }, []);

  return (
    <RestaurantDetail
      restaurantId={restaurantId}
      preview={preview}
      initialData={initialData}
      controller={{
        isOpen,
        close: () => setIsOpen(false),
        unmount: closeRoute,
      }}
    />
  );
}
