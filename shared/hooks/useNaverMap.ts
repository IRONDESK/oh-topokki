import { useEffect, useState } from "react";
import { NaverMaps } from "@/shared/types/naver-maps";

// 스크립트는 앱 전체에서 한 번만 로드한다.
// (훅이 여러 곳에서 동시에 마운트되면 <script>가 중복 삽입돼 naver 네임스페이스가 재초기화됨)
let loader: Promise<NaverMaps> | null = null;

function loadNaverMaps(): Promise<NaverMaps> {
  if (window.naver?.maps) return Promise.resolve(window.naver.maps);
  if (loader) return loader;

  const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
  if (!clientId) {
    return Promise.reject(
      new Error("네이버 지도 API 클라이언트 ID가 설정되지 않았습니다."),
    );
  }

  loader = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
    script.async = true;
    script.onload = () => resolve(window.naver.maps);
    script.onerror = () => {
      loader = null; // 다음 마운트에서 재시도 가능하도록
      script.remove();
      reject(new Error("네이버 지도 API 로딩에 실패했습니다."));
    };
    document.head.appendChild(script);
  });
  return loader;
}

export const useNaverMap = () => {
  const [naver, setNaver] = useState<NaverMaps | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    loadNaverMaps()
      .then((maps) => active && setNaver(maps))
      .catch((e: Error) => active && setError(e.message));
    return () => {
      active = false;
    };
  }, []);

  return { naver, error };
};
