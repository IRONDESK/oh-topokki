import { overlay } from "overlay-kit";
import RestaurantDetail, {
  type RestaurantPreview,
} from "@/features/restaurant/ui/detail/RestaurantDetail";

export const DETAIL_OVERLAY_ID = "restaurant-detail";

/**
 * 식당 상세 바텀시트를 연다.
 * @param preview 목록/마커에서 이미 가진 값 — 상세 조회가 끝나기 전 헤더를 먼저 그리고 지도를 이동한다.
 * @param onUnmount 시트가 완전히 닫힌 뒤 실행 (예: URL 정리)
 */
export function openRestaurantDetail(
  restaurantId: string,
  options: { preview?: RestaurantPreview; onUnmount?: () => void } = {},
) {
  const { preview, onUnmount } = options;

  overlay.open(
    (controller) => (
      <RestaurantDetail
        restaurantId={restaurantId}
        preview={preview}
        controller={
          onUnmount
            ? {
                ...controller,
                unmount() {
                  onUnmount();
                  controller.unmount();
                },
              }
            : controller
        }
      />
    ),
    { overlayId: DETAIL_OVERLAY_ID },
  );
}
