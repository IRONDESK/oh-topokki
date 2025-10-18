'use client';

import TopokkiMap from '@/components/map/TopokkiMap';
import { useMapLocation } from '@/hooks/useMapLocation';

export default function Home() {
  const { currentLocation } = useMapLocation();

  return (
    <>
      <TopokkiMap center={currentLocation ?? undefined} />
    </>
  );
}
