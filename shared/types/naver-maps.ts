export interface NaverMap {
  destroy(): void;
  setCenter(latlng: NaverLatLng): void;
  setZoom(zoom: number): void;
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
    addListener: (target: any, eventName: string, handler: () => void) => void;
    removeListener: (target: any, eventName: string, handler: () => void) => void;
  };
}

export interface NaverMapOptions {
  center: NaverLatLng;
  zoom: number;
  mapTypeControl?: boolean;
  scaleControl?: boolean;
  logoControl?: boolean;
  mapDataControl?: boolean;
  zoomControl?: boolean;
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
}

declare global {
  interface Window {
    naver: {
      maps: NaverMaps;
    };
  }
}