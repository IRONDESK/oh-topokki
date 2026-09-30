"use client";

import { useEffect, useState } from "react";
import { useAtomValue, useStore } from "jotai";
import { overlay } from "overlay-kit";
import { ResponseRestaurant } from "@/shared/api/model/restaurant";
import {
  detailPendingAtom,
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
  const store = useStore();
  // 서버 렌더링된 내용이 있거나(검색엔진·첫 화면), 임시 시트가 이미 떠 있으면(지도 내 이동)
  // 처음부터 열린 상태로 그린다 — 임시 시트를 이어받을 때 이중 슬라이드 인 방지.
  const [isOpen, setIsOpen] = useState(
    () => !!initialData || store.get(detailPendingAtom),
  );

  useEffect(() => {
    setIsOpen(true);
    store.set(detailPendingAtom, false);
    // 임시 상세 시트·검색·즐겨찾기 등 상세를 열기 전 띄워 둔 오버레이 정리
    overlay.unmountAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
