"use client";

import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import {
  useRestaurantCount,
  useRestaurantList,
} from "@/features/restaurant/api/use-restaurant";

import MapView from "./MapView";
import RestaurantMarker from "./RestaurantMarker";
import Spinner from "@/shared/ui/Spinner";
import MapHeader from "@/shared/layouts/headers/MapHeader";
import Icons from "@/shared/ui/Icons";
import { naverMapAtom } from "@/shared/store/locationStore";
import { mapFilterAtom } from "@/shared/store/filterStore";

const TopokkiMap = () => {
  const map = useAtomValue(naverMapAtom);
  const filters = useAtomValue(mapFilterAtom);

  // 지도 이동이 끝날 때마다(idle) 화면 영역에 맞는 중심좌표/반경을 갱신해 다시 조회한다.
  const [viewport, setViewport] = useState<{
    lat: number;
    lng: number;
    radius: number;
  } | null>(null);

  useEffect(() => {
    if (!map) return;
    const { Event } = window.naver.maps;

    const syncViewport = () => {
      const c = map.getCenter();
      const bounds = map.getBounds();
      const ne = bounds.getNE();
      const sw = bounds.getSW();

      // 화면 반경 = 중심에서 모서리까지 거리(대각선 절반) + 20% 여유.
      // 줌 레벨과 무관하게 화면에 보이는 식당은 항상 조회 범위에 들어온다.
      const halfLatM = ((ne.lat() - sw.lat()) / 2) * 111320;
      const halfLngM =
        ((ne.lng() - sw.lng()) / 2) *
        111320 *
        Math.cos((c.lat() * Math.PI) / 180);
      const radius =
        Math.ceil((Math.hypot(halfLatM, halfLngM) * 1.2) / 1000) * 1000;

      setViewport({
        // 소수 3자리(약 100m)로 반올림 — 미세한 이동으로 queryKey가 바뀌는 것을 방지
        lat: Number(c.lat().toFixed(3)),
        lng: Number(c.lng().toFixed(3)),
        radius,
      });
    };

    syncViewport(); // 초기 로드 시 1회
    const listener = Event.addListener(map, "idle", syncViewport);
    return () => Event.removeListener(listener);
  }, [map]);

  const queryParams = {
    lat: viewport?.lat,
    lng: viewport?.lng,
    radius: viewport?.radius ?? 10000,
    ...filters,
  };

  const {
    data: restaurants,
    isLoading,
    error,
    refetch,
  } = useRestaurantList(queryParams, { enabled: !!map && !!viewport });
  const { data: totalCount } = useRestaurantCount();

  return (
    <div className="relative w-full h-[calc(100vh-1px)] overflow-hidden">
      <MapHeader />
      <MapView />

      {map && restaurants && restaurants.length > 0 && (
        <RestaurantMarker map={map} restaurants={restaurants} />
      )}

      {/* 지도를 가리지 않도록 하단 배지 자리에 작게 표시 (로딩 중엔 배지가 내려가 숨는다) */}
      {isLoading && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-[calc(env(safe-area-inset-bottom)+52px)] mb-6 p-2 bg-black/40 backdrop-blur-[4px] rounded-full shadow-sm z-[1000]">
          <Spinner size={18} thick={2.5} color="white" />
        </div>
      )}

      {error && (
        <div className="absolute flex items-center justify-between gap-3 top-5 left-4 right-4 text-white bg-red-500 px-4 py-3 rounded-[14px] shadow-md max-w-[520px] z-[1000] mt-[env(safe-area-inset-top)] backdrop-blur-[5px] text-base font-normal">
          <p>오류: {error?.message}</p>
          <button
            onClick={() => refetch()}
            className="cursor-pointer flex items-center gap-1 text-sm font-medium"
          >
            <Icons name="refresh" w="bold" size={16} t="round" />
            재시도
          </button>
        </div>
      )}

      <div
        data-loading={isLoading}
        className="fixed px-3 py-1 left-1/2 bottom-[calc(env(safe-area-inset-bottom)+52px)] mb-6 bg-black/40 text-white backdrop-blur-[4px] rounded-[20px] shadow-sm z-[1000] tracking-[-0.05rem] [transition:transform_0.35s,opacity_0.3s] [transition-delay:0.15s] text-base font-normal data-[loading=true]:[transform:translate3d(-50%,100%,0)] data-[loading=true]:opacity-0 data-[loading=false]:[transform:translate3d(-50%,0,0)] data-[loading=false]:opacity-100"
      >
        총 {totalCount?.count ?? 0}개의 떡볶이 맛집
      </div>
    </div>
  );
};

export default TopokkiMap;
