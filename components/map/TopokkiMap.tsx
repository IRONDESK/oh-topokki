"use client";

import { useState, useEffect, useCallback } from "react";
import MapView from "@/app/map/MapView";
import RestaurantMarker from "./RestaurantMarker";
import { NaverMap } from "@/types/naver-maps";
import { useNaverMap } from "@/hooks/useNaverMap";
import * as styles from "./map.css";

interface Restaurant {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  averageRating: number;
  reviewCount: number;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface TteokbokkiMapProps {
  onRestaurantClick?: (restaurant: Restaurant) => void;
  center?: {
    lat: number;
    lng: number;
  };
}

const TopokkiMap = ({ onRestaurantClick, center }: TteokbokkiMapProps) => {
  const [map, setMap] = useState<NaverMap | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
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

  // 마커 클릭 핸들러
  const handleMarkerClick = useCallback(
    (restaurant: Restaurant) => {
      if (onRestaurantClick) {
        onRestaurantClick(restaurant);
      }
    },
    [onRestaurantClick],
  );

  return (
    <div className={styles.container}>
      <MapView center={center} onMapLoad={handleMapLoad} />

      {map && naver && restaurants.length > 0 && (
        <RestaurantMarker
          map={map}
          naver={naver}
          restaurants={restaurants}
          onMarkerClick={handleMarkerClick}
        />
      )}

      {loading && (
        <div className={styles.loadingOverlay}>
          <p>맛집 정보를 불러오는 중...</p>
        </div>
      )}

      {error && (
        <div className={styles.errorOverlay}>
          <p>오류: {error}</p>
          <button onClick={() => loadRestaurants()}>다시 시도</button>
        </div>
      )}

      <div className={styles.restaurantCount}>
        총 {restaurants.length}개의 떡볶이 맛집
      </div>
    </div>
  );
};

export default TopokkiMap;
