"use client";

import { useState, useCallback } from "react";
import MapView from "@/app/map/MapView";
import RestaurantMarker from "./RestaurantMarker";
import { NaverMap } from "@/types/naver-maps";
import { useNaverMap } from "@/hooks/useNaverMap";
import { mapStyle } from "./map.css";
import { ResponseRestaurant } from "@/service/model/restaurant.ts";
import Spinner from "@/share/components/Spinner";
import MapHeader from "@/share/layouts/headers/MapHeader";

interface TteokbokkiMapProps {
  center?: {
    lat: number;
    lng: number;
  };
}

const TopokkiMap = ({ center }: TteokbokkiMapProps) => {
  const [map, setMap] = useState<NaverMap | null>(null);
  const [restaurants, setRestaurants] = useState<ResponseRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { naver } = useNaverMap();

  // 맛집 데이터 로드
  const loadRestaurants = useCallback(async (lat?: number, lng?: number) => {
    try {
      setLoading(true);
      setError(null);

      let url = "/api/restaurants";
      if (lat && lng) {
        url += `?lat=${lat}&lng=${lng}&radius=10000`; // 10km 반경
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("맛집 데이터를 불러올 수 없습니다.");
      }

      const data = await response.json();
      setRestaurants(data);
    } catch (err) {
      console.error("맛집 로딩 오류:", err);
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // 지도 로드 시 콜백
  const handleMapLoad = useCallback(
    (mapInstance: NaverMap) => {
      setMap(mapInstance);

      // 초기 맛집 데이터 로드
      if (center) {
        loadRestaurants(center.lat, center.lng);
      } else {
        loadRestaurants();
      }
    },
    [center, loadRestaurants],
  );

  return (
    <div className={mapStyle.mapContainer}>
      <MapHeader />
      <MapView center={center} onMapLoad={handleMapLoad} />

      {map && naver && restaurants.length > 0 && (
        <RestaurantMarker map={map} naver={naver} restaurants={restaurants} />
      )}

      {loading && (
        <div className={mapStyle.loadingOverlay}>
          <Spinner size={42} thick={5} color="primary" />
        </div>
      )}

      {error && (
        <div className={mapStyle.errorOverlay}>
          <p>오류: {error}</p>
          <button onClick={() => loadRestaurants()}>다시 시도</button>
        </div>
      )}

      <div className={mapStyle.restaurantCount} data-loading={loading}>
        총 {restaurants.length}개의 떡볶이 맛집
      </div>
    </div>
  );
};

export default TopokkiMap;
