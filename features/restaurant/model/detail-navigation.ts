import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { atom, useSetAtom, useStore } from "jotai";
import { ResponseRestaurant } from "@/shared/api/model/restaurant";
import { restaurantPath } from "@/shared/constants/site";

/** 상세 조회 전에 먼저 보여줄 수 있는 값 (마커·목록이 이미 가진 필드) */
export type RestaurantPreview = Pick<
  ResponseRestaurant,
  "name" | "address" | "price" | "topokkiType" | "latitude" | "longitude"
>;

// 라우트 이동 중(loading.tsx) 시트 헤더를 먼저 그리기 위한 미리보기 값
export const restaurantPreviewAtom = atom<Record<string, RestaurantPreview>>(
  {},
);

// 지도(앱 안)에서 상세를 열었는지 여부. 닫을 때 back / replace("/") 판단에 사용
const openedInAppAtom = atom(false);

const isDetailPath = () => window.location.pathname.startsWith("/restaurants/");

/** 식당 상세(/restaurants/[id])로 이동한다. 지도는 (map) 레이아웃에 있어 유지된다. */
export function useOpenRestaurantDetail() {
  const router = useRouter();
  const store = useStore();
  const setPreview = useSetAtom(restaurantPreviewAtom);

  return useCallback(
    (restaurantId: string, preview?: RestaurantPreview) => {
      if (preview) {
        const { name, address, price, topokkiType, latitude, longitude } =
          preview;
        setPreview((prev) => ({
          ...prev,
          [restaurantId]: { name, address, price, topokkiType, latitude, longitude },
        }));
      }
      // 상세 → 다른 상세는 replace: 닫으면 항상 지도로 돌아가도록 히스토리를 쌓지 않는다
      if (isDetailPath()) {
        router.replace(restaurantPath(restaurantId), { scroll: false });
      } else {
        store.set(openedInAppAtom, true);
        router.push(restaurantPath(restaurantId), { scroll: false });
      }
    },
    [router, store, setPreview],
  );
}

/** 상세를 닫고 지도로 돌아간다. 외부 링크로 바로 들어온 경우 history가 없으므로 replace. */
export function useCloseRestaurantDetail() {
  const router = useRouter();
  const store = useStore();

  return useCallback(() => {
    if (!isDetailPath()) return; // 이미 다른 화면으로 이동한 뒤면 무시
    if (store.get(openedInAppAtom)) {
      store.set(openedInAppAtom, false);
      router.back();
    } else {
      router.replace("/", { scroll: false });
    }
  }, [router, store]);
}
