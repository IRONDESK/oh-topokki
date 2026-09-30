import { useCallback, useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  currentLocationAtom,
  getUserLocationAtom,
  userGpsLocationAtom,
} from "@/shared/store/locationStore";
import { calculateDistance, formatDistance } from "@/shared/lib/distance";

/** 지도 중심 위치. 아직 없으면 마운트 시 한 번 GPS 위치를 요청한다. */
export function useCurrentLocation() {
  const currentLocation = useAtomValue(currentLocationAtom);
  const getUserLocation = useSetAtom(getUserLocationAtom);

  useEffect(() => {
    if (!currentLocation) void getUserLocation();
  }, [currentLocation, getUserLocation]);

  return currentLocation;
}

/** 실제 GPS 위치 기준 거리 문자열 (예: "1.2km"). 위치를 모르면 null. */
export function useDistanceFromUser() {
  const gps = useAtomValue(userGpsLocationAtom);

  return useCallback(
    (lat: number, lng: number) =>
      gps ? formatDistance(calculateDistance(gps.lat, gps.lng, lat, lng)) : null,
    [gps],
  );
}
