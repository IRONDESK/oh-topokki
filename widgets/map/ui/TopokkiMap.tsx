"use client";

import { useCallback } from "react";
import { useAtom } from "jotai";
import { NaverMap } from "@/shared/types/naver-maps";
import { useNaverMap } from "@/shared/hooks/useNaverMap";
import { useRestaurantList } from "@/features/restaurant/api/use-restaurant";

import MapView from "@/app/map/MapView";
import RestaurantMarker from "./RestaurantMarker";
import Spinner from "@/shared/ui/Spinner";
import MapHeader from "@/shared/layouts/headers/MapHeader";
import Icons from "@/shared/ui/Icons";
import { naverMapAtom } from "@/shared/store/locationStore";
import { mapFilterAtom } from "@/shared/store/filterStore";

interface TteokbokkiMapProps {
  center?: {
    lat: number;
    lng: number;
  };
}

const TopokkiMap = ({ center }: TteokbokkiMapProps) => {
  const [map, setMap] = useAtom(naverMapAtom);
  const [filters] = useAtom(mapFilterAtom);
  const { naver } = useNaverMap();

  const queryParams = {
    lat: center?.lat,
    lng: center?.lng,
    radius: 10000,
    ...filters,
  };

  const {
    data: restaurants,
    isLoading,
    error,
    refetch,
  } = useRestaurantList(queryParams, { enabled: !!map });

  const handleMapLoad = useCallback(
    (mapInstance: NaverMap) => {
      setMap(mapInstance);
    },
    [setMap],
  );

  return (
    <div className="relative w-full h-[calc(100vh-1px)] overflow-hidden">
      <MapHeader />
      <MapView center={center} onMapLoad={handleMapLoad} />

      {map && naver && restaurants && restaurants?.length > 0 && (
        <RestaurantMarker
          map={map}
          naver={naver}
          restaurants={restaurants ?? []}
        />
      )}

      {isLoading && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-50">
          <Spinner size={42} thick={5} color="primary" />
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
        총 {restaurants?.length}개의 떡볶이 맛집
      </div>
    </div>
  );
};

export default TopokkiMap;
