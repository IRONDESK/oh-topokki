import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";
import {
  currentLocationAtom,
  userGpsLocationAtom,
  getUserLocationAtom,
  isLocationLoadingAtom,
  locationErrorAtom,
  Location,
} from "@/store/locationStore";
import { calculateDistance, formatDistance } from "@/lib/distance";

export const useMapLocation = () => {
  const [currentLocation, setCurrLocation] = useAtom(currentLocationAtom);
  const [userGpsLocation] = useAtom(userGpsLocationAtom);
  const [isLocationLoading] = useAtom(isLocationLoadingAtom);
  const [locationError] = useAtom(locationErrorAtom);
  const getUserLocation = useSetAtom(getUserLocationAtom);

  // 컴포넌트 마운트 시 위치 정보 자동 가져오기
  useEffect(() => {
    if (!currentLocation) {
      getUserLocation();
    }
  }, [currentLocation, getUserLocation]);

  /**
   * 실제 GPS 위치와 대상 위치 간의 거리를 계산합니다
   * @param targetLat 대상 위치의 위도
   * @param targetLng 대상 위치의 경도
   * @returns 거리 (미터 단위) 또는 null (GPS 위치를 알 수 없는 경우)
   */
  const getDistanceFromCurrent = (
    targetLat: number,
    targetLng: number,
  ): number | null => {
    if (!userGpsLocation) {
      return null;
    }
    return calculateDistance(
      userGpsLocation.lat,
      userGpsLocation.lng,
      targetLat,
      targetLng,
    );
  };

  /**
   * 실제 GPS 위치와 대상 위치 간의 거리를 포맷팅된 문자열로 반환합니다
   * @param targetLat 대상 위치의 위도
   * @param targetLng 대상 위치의 경도
   * @returns 포맷팅된 거리 문자열 (예: "1.2km", "500m") 또는 null
   */
  const getFormattedDistanceFromCurrent = (
    targetLat: number,
    targetLng: number,
  ): string | null => {
    const distance = getDistanceFromCurrent(targetLat, targetLng);
    return distance !== null ? formatDistance(distance) : null;
  };

  /**
   * 두 지점 간의 거리를 계산합니다
   * @param lat1 첫 번째 지점의 위도
   * @param lng1 첫 번째 지점의 경도
   * @param lat2 두 번째 지점의 위도
   * @param lng2 두 번째 지점의 경도
   * @returns 거리 (미터 단위)
   */
  const getDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number => {
    return calculateDistance(lat1, lng1, lat2, lng2);
  };

  /**
   * 두 지점 간의 거리를 포맷팅된 문자열로 반환합니다
   * @param lat1 첫 번째 지점의 위도
   * @param lng1 첫 번째 지점의 경도
   * @param lat2 두 번째 지점의 위도
   * @param lng2 두 번째 지점의 경도
   * @returns 포맷팅된 거리 문자열
   */
  const getFormattedDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): string => {
    const distance = getDistance(lat1, lng1, lat2, lng2);
    return formatDistance(distance);
  };

  const setLocation = (location: Location) => {
    const offsetLat = 0.00195;
    setCurrLocation({
      lat: location.lat - offsetLat,
      lng: location.lng,
    });
  };

  return {
    // 현재 위치 정보
    currentLocation,
    setLocation,
    isLocationLoading,
    locationError,

    // 위치 관련 액션
    getUserLocation,

    // 거리 계산 함수들
    getDistanceFromCurrent,
    getFormattedDistanceFromCurrent,
    getDistance,
    getFormattedDistance,
  };
};
