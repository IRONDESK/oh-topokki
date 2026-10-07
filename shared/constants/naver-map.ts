// 지도 스크립트 주소. 레이아웃의 preload와 useNaverMap의 <script>가 같은 URL을 써야 캐시가 재사용된다.
export const NAVER_MAPS_ORIGIN = "https://oapi.map.naver.com";

const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

export const NAVER_MAPS_SRC = clientId
  ? `${NAVER_MAPS_ORIGIN}/openapi/v3/maps.js?ncpKeyId=${clientId}`
  : null;
