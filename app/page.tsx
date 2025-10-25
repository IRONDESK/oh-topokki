"use client";

import TopokkiMap from "@/components/map/TopokkiMap";
import { useMapLocation } from "@/hooks/useMapLocation";
import { useSearchParams } from "next/navigation";
import OpenDetailPage from "@/app/OpenDetailPage";

export default function Home() {
  const { currentLocation } = useMapLocation();
  const params = useSearchParams();
  const restaurantId = params.get("restaurant");

  return (
    <>
      {restaurantId && <OpenDetailPage restaurantId={restaurantId} />}
      <TopokkiMap center={currentLocation ?? undefined} />
    </>
  );
}
