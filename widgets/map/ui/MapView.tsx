"use client";

import { useEffect, useRef } from "react";
import { useSetAtom } from "jotai";
import { useNaverMap } from "@/shared/hooks/useNaverMap";
import { useCurrentLocation } from "@/shared/hooks/useUserLocation";
import { NaverMap } from "@/shared/types/naver-maps";
import { DEFAULT_LOCATION, naverMapAtom } from "@/shared/store/locationStore";

const FALLBACK_CLS =
  "w-full h-screen flex items-center justify-center bg-[#f8f9fa]";

/** 네이버 지도 인스턴스를 만들고 naverMapAtom에 공유한다. 중심은 현재 위치를 따라간다. */
function MapView() {
  const mapRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<NaverMap | null>(null);
  const setMap = useSetAtom(naverMapAtom);
  const { naver, error } = useNaverMap();
  const location = useCurrentLocation();

  // 지도는 한 번만 생성한다. (중심 좌표가 바뀔 때마다 destroy/재생성하면
  // 위치를 받아오는 순간 지도·리스너가 통째로 교체돼 에러와 깜빡임이 생김)
  useEffect(() => {
    if (!naver || !mapRef.current) return;

    const { lat, lng } = location ?? DEFAULT_LOCATION;
    const map = new naver.Map(mapRef.current, {
      center: new naver.LatLng(lat, lng),
      zoom: 13,
      mapTypeControl: false,
      scaleControl: false,
      logoControl: true,
      mapDataControl: true,
      zoomControl: false,
      gl: true,
      customStyleId: "7599d38a-65aa-4028-901d-93cd9a712ce1",
    });
    instanceRef.current = map;
    setMap(map);

    return () => {
      instanceRef.current = null;
      setMap(null);
      map.destroy();
    };
    // location은 초기 중심으로만 사용하고, 이후 변경은 아래 effect에서 setCenter로 반영
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [naver, setMap]);

  useEffect(() => {
    if (!naver || !location || !instanceRef.current) return;
    instanceRef.current.setCenter(new naver.LatLng(location.lat, location.lng));
  }, [naver, location]);

  if (error) {
    return (
      <div className={`${FALLBACK_CLS} text-[#dc3545]`}>
        <p>지도를 불러올 수 없습니다: {error}</p>
      </div>
    );
  }

  if (!naver) {
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
