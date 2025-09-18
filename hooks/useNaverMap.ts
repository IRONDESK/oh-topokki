import { useEffect, useState } from "react";
import { NaverMaps } from "@/types/naver-maps";

export const useNaverMap = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.naver) {
      setIsLoaded(true);
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
    if (!clientId) {
      setError("네이버 지도 API 클라이언트 ID가 설정되지 않았습니다.");
      return;
    }

    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
    script.async = true;

    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      setError("네이버 지도 API 로딩에 실패했습니다.");
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return {
    isLoaded,
    error,
    naver: typeof window !== "undefined" ? window.naver?.maps : null,
  } as {
    isLoaded: boolean;
    error: string | null;
    naver: NaverMaps | null;
  };
};
