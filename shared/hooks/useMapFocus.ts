import { useCallback } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  Location,
  mapFocusedAtom,
  naverMapAtom,
} from "@/shared/store/locationStore";

// 바텀시트가 지도 아래쪽을 가리므로 핀이 화면 위쪽에 보이도록 중심을 살짝 남쪽으로 내린다.
const SHEET_OFFSET_LAT = 0.00195;
const FOCUS_ZOOM = 17;

/** 식당 위치로 지도를 이동/확대한다. 지도가 아직 없으면 무시. */
export function useMapFocus() {
  const map = useAtomValue(naverMapAtom);
  const setFocused = useSetAtom(mapFocusedAtom);

  return useCallback(
    ({ lat, lng }: Location) => {
      if (!map) return;
      setFocused(true);
      map.setCenter(
        new window.naver.maps.LatLng(lat - SHEET_OFFSET_LAT, lng),
      );
      map.setZoom(FOCUS_ZOOM);
    },
    [map, setFocused],
  );
}
