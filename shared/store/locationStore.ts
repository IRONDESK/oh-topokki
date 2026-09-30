import { atom } from "jotai";
import { NaverMap } from "@/shared/types/naver-maps";

export interface Location {
  lat: number;
  lng: number;
}

// 위치를 못 가져올 때 쓰는 기본 위치 (서울시청)
export const DEFAULT_LOCATION: Location = { lat: 37.5665, lng: 126.978 };

// 네이버 지도 instance
export const naverMapAtom = atom<NaverMap | null>(null);

// 식당 등으로 지도를 직접 이동했는지 여부. true면 늦게 도착한 GPS 위치로 중심을 덮어쓰지 않는다.
export const mapFocusedAtom = atom(false);

// 현재 위치 atom (지도 중심점)
export const currentLocationAtom = atom<Location | null>(null);

// 실제 GPS 위치 atom (거리 계산용, 실패 시 null)
export const userGpsLocationAtom = atom<Location | null>(null);

const requestPosition = (options: PositionOptions) =>
  new Promise<GeolocationPosition>((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, options),
  );

// 여러 곳에서 동시에 호출돼도(StrictMode 이중 effect 등) 요청은 한 번만 보낸다.
let pending: Promise<void> | null = null;

// 위치 정보 가져오기 action atom
export const getUserLocationAtom = atom(null, (_get, set) => {
  if (pending) return pending;

  pending = (async () => {
    try {
      if (!("geolocation" in navigator)) {
        throw new Error("위치 서비스가 지원되지 않습니다.");
      }
      // enableHighAccuracy는 데스크톱/실내에서 타임아웃·POSITION_UNAVAILABLE이 잦아
      // 먼저 저정밀(와이파이/IP 기반, 빠름)로 받는다. 지도 초기 중심에는 충분.
      const { coords } = await requestPosition({
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 5 * 60_000,
      });
      const location = { lat: coords.latitude, lng: coords.longitude };
      set(currentLocationAtom, location);
      set(userGpsLocationAtom, location);
    } catch (error) {
      // 권한 거부(1)·위치 불가(2)·타임아웃(3)·비보안 출처(http)는 정상 시나리오라
      // console.error(dev 에러 오버레이 유발) 대신 warn으로 남기고 기본 위치로 폴백.
      // GeolocationPositionError는 속성이 non-enumerable라 code/message를 직접 찍는다.
      const { code, message } = error as Partial<GeolocationPositionError>;
      console.warn(`위치 정보 가져오기 실패 (code=${code ?? "-"}): ${message}`);
      set(currentLocationAtom, DEFAULT_LOCATION);
    } finally {
      pending = null;
    }
  })();

  return pending;
});
