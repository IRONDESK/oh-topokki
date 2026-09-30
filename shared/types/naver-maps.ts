export interface NaverMap {
  destroy(): void;
  getCenter(): NaverLatLng;
  getBounds(): NaverLatLngBounds;
  setCenter(latlng: NaverLatLng): void;
  setZoom(zoom: number): void;
}

export interface NaverLatLngBounds {
  getSW(): NaverLatLng;
  getNE(): NaverLatLng;
}

export interface NaverLatLng {
  lat(): number;
  lng(): number;
}

export interface NaverMaps {
  LatLng: new (lat: number, lng: number) => NaverLatLng;
  Map: new (element: HTMLElement, options: NaverMapOptions) => NaverMap;
  Marker: new (options: NaverMarkerOptions) => NaverMarker;
  InfoWindow: new (options: NaverInfoWindowOptions) => NaverInfoWindow;
  Event: {
    addListener: (
      target: object,
      eventName: string,
      handler: () => void,
    ) => NaverMapEventListener;
    // 네이버 API는 (target, event, handler)가 아니라 addListener가 반환한 리스너 객체를 받는다.
    removeListener: (
      listener: NaverMapEventListener | NaverMapEventListener[],
    ) => void;
  };
}

// addListener 반환값 (removeListener에 그대로 넘긴다)
export type NaverMapEventListener = { readonly __brand: "NaverMapEventListener" };

export interface NaverMapOptions {
  center: NaverLatLng;
  zoom: number;
  mapTypeControl?: boolean;
  scaleControl?: boolean;
  logoControl?: boolean;
  mapDataControl?: boolean;
  zoomControl?: boolean;
  gl?: boolean;
  customStyleId?: string;
}

export interface NaverMarker {
  setMap(map: NaverMap | null): void;
  getPosition(): NaverLatLng;
  setPosition(position: NaverLatLng): void;
}

export interface NaverMarkerOptions {
  position: NaverLatLng;
  map?: NaverMap;
  title?: string;
  icon?: string | {
    url: string;
    size: { width: number; height: number };
    anchor: { x: number; y: number };
  };
}

export interface NaverInfoWindow {
  open(map: NaverMap, anchor: NaverMarker): void;
  close(): void;
  setContent(content: string): void;
}

export interface NaverInfoWindowOptions {
  content: string;
  maxWidth?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  anchorSize?: {
    width: number;
    height: number;
  };
  anchorColor?: string;
  disableAnchor?: boolean;
  pixelOffset?: { x: number; y: number };
}

declare global {
  interface Window {
    naver: {
      maps: NaverMaps;
    };
  }
}