"use client";

import { Suspense } from "react";
import { useMapLocation } from "@/hooks/useMapLocation";
import { useSearchParams } from "next/navigation";

import TopokkiMap from "@/components/map/TopokkiMap";
import OpenDetailPage from "@/app/OpenDetailPage";

function HomeContent() {
  const params = useSearchParams();
  const restaurantId = params.get("restaurant");

  if (restaurantId) {
    return <OpenDetailPage restaurantId={restaurantId} />;
  }
  return null;
}

export default function Home() {
  const { currentLocation } = useMapLocation();

  return (
    <>
      <Suspense>
        <HomeContent />
      </Suspense>
      <TopokkiMap center={currentLocation ?? undefined} />
    </>
  );
}
