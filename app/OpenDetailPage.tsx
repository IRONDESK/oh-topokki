"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { overlay } from "overlay-kit";

import { openRestaurantDetail } from "@/features/restaurant/ui/detail/openRestaurantDetail";

/** `/?restaurant=<id>` 딥링크로 진입하면 상세 시트를 열고, 닫히면 URL을 정리한다. */
export default function OpenDetailPage({
  restaurantId,
}: {
  restaurantId: string;
}) {
  const router = useRouter();

  useEffect(() => {
    overlay.unmountAll();
    openRestaurantDetail(restaurantId, {
      onUnmount: () => router.replace("/"),
    });

    return () => {
      router.replace("/");
    };
  }, [restaurantId, router]);

  return null;
}
