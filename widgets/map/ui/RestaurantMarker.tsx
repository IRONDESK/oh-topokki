"use client";

import { useEffect } from "react";
import { overlay } from "overlay-kit";
import { NaverMap, NaverMaps, NaverMarker } from "@/shared/types/naver-maps";
import { ResponseRestaurant } from "@/shared/api/model/restaurant";
import RestaurantDetail from "@/features/restaurant/ui/detail/RestaurantDetail";
import { RICE_TYPE } from "@/shared/constants/restaurant";

interface RestaurantMarkerProps {
  map: NaverMap;
  naver: NaverMaps;
  restaurants: ResponseRestaurant[];
}

const HOVER_CONTAINER_CLS =
  "flex flex-col items-start gap-1.5 min-w-[210px] bg-white rounded-card p-3 border-[1.5px] border-ink shadow-sticker";
const HOVER_TITLE_CLS =
  "text-[15px] font-semibold text-gray-900 tracking-[-0.02em]";
const HOVER_TYPE_CLS =
  "inline-flex items-center shrink-0 px-1.5 py-0.5 rounded-md bg-magenta-500 text-white text-xs font-medium";
const HOVER_META_CLS =
  "flex items-center gap-1 text-xs font-medium text-gray-600";
const HOVER_FOOT_CLS = "flex items-center justify-between w-full gap-2";

const RestaurantMarker = ({
  map,
  naver,
  restaurants,
}: RestaurantMarkerProps) => {
  useEffect(() => {
    if (!map || !naver || !restaurants.length) return;

    const markers: NaverMarker[] = [];

    restaurants.forEach((restaurant) => {
      const svgString = `
        <svg width="28" height="38" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.2 0 0 7.2 0 16c0 16 16 24 16 24s16-8 16-24C32 7.2 24.8 0 16 0z" fill='#F54E26'/>
          <circle cx="16" cy="16" r="8" fill="white"/>
        </svg>
      `;

      const markerIcon = {
        url:
          "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString),
        size: { width: 32, height: 40 },
        anchor: { x: 16, y: 40 },
      };

      const marker = new naver.Marker({
        position: new naver.LatLng(restaurant.latitude, restaurant.longitude),
        map: map,
        title: restaurant.name,
        icon: markerIcon,
      });

      naver.Event.addListener(marker, "click", () => {
        const offsetLat = 0.00195;
        const adjustedPosition = new naver.LatLng(
          restaurant.latitude - offsetLat,
          restaurant.longitude,
        );

        map.setCenter(adjustedPosition);
        map.setZoom(17);

        overlay.open(
          (controller) => (
            <RestaurantDetail
              restaurantId={restaurant.id}
              restaurantName={restaurant.name}
              topokkiType={restaurant.topokkiType}
              price={restaurant.price}
              address={restaurant.address}
              controller={controller}
            />
          ),
          { overlayId: "restaurant-detail" },
        );
      });

      const infoWindow = new naver.InfoWindow({
        content: `
          <div class="${HOVER_CONTAINER_CLS}">
            <div class="flex items-center gap-1.5">
              <span class="${HOVER_TYPE_CLS}">${TOPOKKI_TYPE_ABBR[restaurant.topokkiType]}</span>
              <h3 class="${HOVER_TITLE_CLS}">${restaurant.name}</h3>
            </div>
            <div class="${HOVER_META_CLS}">
              ${restaurant.riceTypes?.length ? `<span>${restaurant.riceTypes.map((kind) => RICE_TYPE[kind]).join(", ")}</span><span class="text-gray-300">·</span>` : ""}
              <span class="inline-flex items-center gap-0.5 text-primary-600"><i class="fi fi-sr-pepper" style="display:inline-flex;align-items:center;"></i>${restaurant.spiciness}단계</span>
            </div>
            <div class="${HOVER_FOOT_CLS}">
              <span class="text-xs font-normal text-gray-500">${restaurant.address.split(" ").slice(0, 2).join(" ")} · 리뷰 ${restaurant.reviewCount}</span>
              <span class="shrink-0 text-sm font-semibold text-gray-900">${restaurant.price?.toLocaleString()}원</span>
            </div>
          </div>
        `,
        maxWidth: 250,
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderWidth: 0,
        // 네이버 기본 말풍선 꼬리(세모) 제거 — 커스텀 스티커 버블만 보이게
        disableAnchor: true,
      });

      naver.Event.addListener(marker, "mouseover", () => {
        infoWindow.open(map, marker);
      });

      naver.Event.addListener(marker, "mouseout", () => {
        infoWindow.close();
      });

      markers.push(marker);
    });

    return () => {
      markers.forEach((marker) => {
        marker.setMap(null);
      });
    };
  }, [map, naver, restaurants]);

  return null;
};

const TOPOKKI_TYPE_ABBR: Record<string, string> = {
  ontable: "즉떡",
  pan: "판떡",
  soup: "국물",
};

export default RestaurantMarker;
