import { preconnect, preload } from "react-dom";
import TopokkiMap from "@/widgets/map/ui/TopokkiMap";
import { NAVER_MAPS_ORIGIN, NAVER_MAPS_SRC } from "@/shared/constants/naver-map";

// 홈(/)과 식당 상세(/restaurants/[id])가 지도를 공유한다.
// 레이아웃은 두 페이지 사이를 이동해도 다시 마운트되지 않아 지도·마커가 유지된다.
export default function MapLayout({ children }: { children: React.ReactNode }) {
  // 지도 스크립트는 하이드레이션 후 useNaverMap에서 삽입되므로,
  // HTML 단계에서 미리 받아두면 JS 실행을 기다리는 동안 다운로드가 끝난다.
  preconnect(NAVER_MAPS_ORIGIN);
  if (NAVER_MAPS_SRC) preload(NAVER_MAPS_SRC, { as: "script" });

  return (
    <>
      {children}
      <TopokkiMap />
    </>
  );
}
