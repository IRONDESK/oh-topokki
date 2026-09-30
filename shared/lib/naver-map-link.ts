type Place = {
  name: string;
  latitude: number;
  longitude: number;
  // recommend의 { type: "naver", url } 은 naver.me 단축 코드(네이버 플레이스 상세로 리다이렉트)
  recommend?: { type: string; url: string }[];
};

const APP_FALLBACK_DELAY = 1500;

const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

/** 네이버 지도 웹 URL — 플레이스 링크가 있으면 상세, 없으면 좌표 중심 이름 검색 */
export function getNaverMapWebUrl(place: Place): string {
  const code = place.recommend?.find((r) => r.type === "naver")?.url;
  if (code) return code.startsWith("http") ? code : `https://naver.me/${code}`;

  const { name, latitude, longitude } = place;
  return `https://map.naver.com/p/search/${encodeURIComponent(name)}?c=${longitude},${latitude},17,0,0,0,dh`;
}

/**
 * 네이버 지도(앱/웹)로 장소를 연다.
 * - 데스크톱: 웹을 새 탭으로
 * - 모바일 + 플레이스 링크 있음: naver.me (앱 설치 시 앱으로 넘겨줌)
 * - 모바일 + 링크 없음: nmap:// 스킴으로 앱 실행, 앱이 없어 페이지가 그대로면 웹으로 폴백
 */
export function openNaverMap(place: Place) {
  const webUrl = getNaverMapWebUrl(place);
  const hasPlaceLink = place.recommend?.some((r) => r.type === "naver");

  if (!isMobile() || hasPlaceLink) {
    window.open(webUrl, "_blank", "noopener,noreferrer");
    return;
  }

  const appUrl =
    `nmap://place?lat=${place.latitude}&lng=${place.longitude}` +
    `&name=${encodeURIComponent(place.name)}` +
    `&appname=${encodeURIComponent(window.location.hostname)}`;

  const timer = setTimeout(() => {
    if (!document.hidden) window.location.href = webUrl;
  }, APP_FALLBACK_DELAY);
  document.addEventListener("visibilitychange", () => clearTimeout(timer), {
    once: true,
  });
  window.location.href = appUrl;
}
