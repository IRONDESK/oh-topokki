"use client";

import { useParams } from "next/navigation";
import RestaurantDetailRoute from "@/features/restaurant/ui/detail/RestaurantDetailRoute";

// 지도에서 이동할 때 서버 응답을 기다리지 않고 미리보기 값으로 시트를 먼저 띄운다.
export default function Loading() {
  const { id } = useParams<{ id: string }>();
  return <RestaurantDetailRoute key={id} restaurantId={id} />;
}
