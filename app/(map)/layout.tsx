import TopokkiMap from "@/widgets/map/ui/TopokkiMap";

// 홈(/)과 식당 상세(/restaurants/[id])가 지도를 공유한다.
// 레이아웃은 두 페이지 사이를 이동해도 다시 마운트되지 않아 지도·마커가 유지된다.
export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <TopokkiMap />
    </>
  );
}
