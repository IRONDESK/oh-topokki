import { atom } from "jotai";
import { NaverMap } from "@/types/naver-maps";

export interface Location {
  lat: number;
  lng: number;
}

// 네이버 지도 instance
export const naverMapAtom = atom<NaverMap | null>(null);

// 현재 위치 atom (지도 중심점)
export const currentLocationAtom = atom<Location | null>(null);

// 실제 GPS 위치 atom
export const userGpsLocationAtom = atom<Location | null>(null);

// 위치 로딩 상태 atom
export const isLocationLoadingAtom = atom(false);

// 위치 에러 상태 atom
export const locationErrorAtom = atom<string | null>(null);

// 위치 정보 가져오기 action atom
export const getUserLocationAtom = atom(
  null,
  async (get, set) => {
    if (!navigator.geolocation) {
      set(locationErrorAtom, "위치 서비스가 지원되지 않습니다.");
      return;
    }

    set(isLocationLoadingAtom, true);
    set(locationErrorAtom, null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5분 캐시
        });
      });

      const newLocation: Location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      set(currentLocationAtom, newLocation);
      set(userGpsLocationAtom, newLocation);
    } catch (error) {
      console.error("위치 정보 가져오기 실패:", error);
      set(locationErrorAtom, "위치 정보를 가져올 수 없습니다.");
      // 기본 위치 (서울시청)으로 설정
      set(currentLocationAtom, { lat: 37.5665, lng: 126.978 });
      set(userGpsLocationAtom, { lat: 37.5665, lng: 126.978 });
    } finally {
      set(isLocationLoadingAtom, false);
    }
  }
);