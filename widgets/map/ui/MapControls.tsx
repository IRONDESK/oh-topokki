"use client";

import { useState } from "react";
import { useAtomValue, useSetAtom, useStore } from "jotai";
import { toast } from "sonner";
import Icons from "@/shared/ui/Icons";
import Spinner from "@/shared/ui/Spinner";
import {
  getUserLocationAtom,
  naverMapAtom,
  userGpsLocationAtom,
} from "@/shared/store/locationStore";

const GROUP_CLS =
  "flex flex-col bg-white shadow-sticker-sm rounded-btn overflow-hidden";
const BUTTON_CLS =
  "cursor-pointer size-10 flex items-center justify-center text-gray-700 active:bg-gray-100 disabled:text-gray-300";

/** 지도 우측 중앙의 내 위치 / 확대 / 축소 버튼 */
export default function MapControls() {
  const map = useAtomValue(naverMapAtom);
  const getUserLocation = useSetAtom(getUserLocationAtom);
  const store = useStore();
  const [locating, setLocating] = useState(false);

  if (!map) return null;

  const zoomBy = (delta: number) => map.setZoom(map.getZoom() + delta, true);

  const moveToMyLocation = async () => {
    setLocating(true);
    try {
      // 실패 시 getUserLocationAtom은 GPS 위치를 비워 두고 기본 위치로 폴백한다
      await getUserLocation();
      const gps = store.get(userGpsLocationAtom);
      if (!gps) {
        toast.error("위치 정보를 가져올 수 없어요. 위치 권한을 확인해 주세요.");
        return;
      }
      map.panTo(new window.naver.maps.LatLng(gps.lat, gps.lng));
    } finally {
      setLocating(false);
    }
  };

  return (
    <div className="fixed right-2.5 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-100">
      <div className={GROUP_CLS}>
        <button
          type="button"
          aria-label="내 위치로 이동"
          className={BUTTON_CLS}
          disabled={locating}
          onClick={moveToMyLocation}
        >
          {locating ? (
            <Spinner size={16} thick={2} color="gray" />
          ) : (
            <Icons name="location-crosshairs" w="bold" size={17} />
          )}
        </button>
      </div>
      <div className={`${GROUP_CLS} divide-y divide-gray-100`}>
        <button
          type="button"
          aria-label="확대"
          className={BUTTON_CLS}
          onClick={() => zoomBy(1)}
        >
          <Icons name="plus" w="bold" size={15} />
        </button>
        <button
          type="button"
          aria-label="축소"
          className={BUTTON_CLS}
          onClick={() => zoomBy(-1)}
        >
          <Icons name="minus" w="bold" size={15} />
        </button>
      </div>
    </div>
  );
}
