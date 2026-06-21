"use client";

import { useEffect, useRef } from "react";
import { useNaverMap } from "@/shared/hooks/useNaverMap";
import { NaverMap } from "@/shared/types/naver-maps";

interface MapViewProps {
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  onMapLoad?: (map: NaverMap) => void;
}

const FALLBACK_CLS =
  "w-full h-screen flex items-center justify-center bg-[#f8f9fa]";

function MapView({
  center = { lat: 37.5665, lng: 126.978 },
  zoom = 13,
  onMapLoad,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<NaverMap | null>(null);
  const { isLoaded, error, naver } = useNaverMap();

  useEffect(() => {
    if (!isLoaded || !naver || !mapRef.current) return;

    const mapOptions = {
      center: new naver.LatLng(center.lat, center.lng),
      zoom: zoom,
      mapTypeControl: false,
      scaleControl: false,
      logoControl: true,
      mapDataControl: true,
      zoomControl: false,
      gl: true,
      customStyleId: "7599d38a-65aa-4028-901d-93cd9a712ce1",
    };

    const map = new naver.Map(mapRef.current, mapOptions);
    mapInstanceRef.current = map;

    if (onMapLoad) {
      onMapLoad(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
      }
    };
  }, [isLoaded, naver, center.lat, center.lng, zoom, onMapLoad]);

  if (error) {
    return (
      <div className={`${FALLBACK_CLS} text-[#dc3545]`}>
        <p>지도를 불러올 수 없습니다: {error}</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`${FALLBACK_CLS} text-[#6c757d]`}>
        <p>지도를 로딩 중입니다...</p>
      </div>
    );
  }

  return (
    <div ref={mapRef} className="w-full h-screen relative overflow-hidden" />
  );
}

export default MapView;
