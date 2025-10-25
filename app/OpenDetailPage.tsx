"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { overlay } from "overlay-kit";

import RestaurantDetail from "@/components/restaurant/detail/RestaurantDetail";

export default function OpenDetailPage(props: { restaurantId: string }) {
  const { restaurantId } = props;
  const router = useRouter();

  useEffect(() => {
    if (restaurantId) {
      overlay.unmountAll();
      overlay.open((controller) => {
        const newController = {
          ...controller,
          unmount() {
            router.replace("/");
            controller.unmount();
          },
        };

        return (
          <RestaurantDetail
            restaurantId={restaurantId}
            controller={newController}
          />
        );
      });
    }

    return () => {
      router.replace("/");
    };
  }, [restaurantId]);

  return null;
}
