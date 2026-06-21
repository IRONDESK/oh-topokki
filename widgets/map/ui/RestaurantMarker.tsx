"use client";

import { useEffect } from "react";
import { overlay } from "overlay-kit";
import { NaverMap, NaverMaps, NaverMarker } from "@/shared/types/naver-maps";
import { ResponseRestaurant } from "@/shared/api/model/restaurant";
import RestaurantDetail from "@/features/restaurant/ui/detail/RestaurantDetail";
import { TOPOKKI_RICE_KINDS } from "@/shared/constants/restaurant";

interface RestaurantMarkerProps {
  map: NaverMap;
  naver: NaverMaps;
  restaurants: ResponseRestaurant[];
}

const HOVER_CONTAINER_CLS =
  "flex flex-col items-start gap-1 bg-white/60 rounded-[18px] p-3 backdrop-blur-[4px] border-t border-l border-white shadow-lg";
const HOVER_TITLE_CLS = "text-base font-semibold text-gray-700";
const HOVER_DESC_CLS = "flex items-center gap-[3px] text-xs font-normal text-gray-600";
const HOVER_TAG_CLS =
  "inline-flex items-center px-1.5 py-[1px] bg-primary-50 text-primary-500 rounded-[3px] gap-0.5 text-xs font-medium data-[type=price]:bg-transparent data-[type=price]:p-px data-[type=price]:text-gray-600";

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
          <div style="min-width: 200px;" class="${HOVER_CONTAINER_CLS}">
            <h3 class="${HOVER_TITLE_CLS}">${restaurant.name}</h3>
            <div class="${HOVER_DESC_CLS}">
            <span class="${HOVER_TAG_CLS}">${TOPOKKI_TYPE_ABBR[restaurant.topokkiType]}</span>
            ${restaurant.riceKinds?.map((kind) => `<span class="${HOVER_TAG_CLS}">${TOPOKKI_RICE_KINDS[kind]}</span>`).join("")}
            <span class="${HOVER_TAG_CLS}">
              <i class="fi fi-sr-pepper" style="height: 14px; display: inline-flex; align-items: center;"></i>
              ${restaurant.spiciness}단계</span>
              <span class="${HOVER_TAG_CLS}" data-type="price">
                <span style="font-weight: 700">₩</span>
                ${restaurant.price?.toLocaleString()}
              </span>
            </div>
            <div class="${HOVER_DESC_CLS}">
              <span>${restaurant.address.split(" ").slice(0, 2).join(" ")}</span>
              <span>(리뷰 ${restaurant.reviewCount})</span>
            </div>
          </div>
        `,
        maxWidth: 250,
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderWidth: 0,
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
