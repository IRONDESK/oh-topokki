"use client";

import { useCallback } from "react";
import { useAtom } from "jotai";
import { NaverMap } from "@/shared/types/naver-maps";
import { useNaverMap } from "@/shared/hooks/useNaverMap";
import { useRestaurantList } from "@/features/restaurant/api/use-restaurant";

import MapView from "@/app/map/MapView";
import { mapStyle } from "./map.css";
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

  // 지도 로드 시 콜백
  const handleMapLoad = useCallback((mapInstance: NaverMap) => {
    setMap(mapInstance);
  }, []);

  return (
    <div className={mapStyle.mapContainer}>
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
        <div className={mapStyle.loadingOverlay}>
          <Spinner size={42} thick={5} color="primary" />
        </div>
      )}

      {error && (
        <div className={mapStyle.errorOverlay}>
          <p>오류: {error?.message}</p>
          <button onClick={() => refetch()} className={mapStyle.refreshBtn}>
            <Icons name="refresh" w="bold" size={16} t="round" />
            재시도
          </button>
        </div>
      )}

      <div className={mapStyle.restaurantCount} data-loading={isLoading}>
        총 {restaurants?.length}개의 떡볶이 맛집
      </div>
    </div>
  );
};

export default TopokkiMap;
