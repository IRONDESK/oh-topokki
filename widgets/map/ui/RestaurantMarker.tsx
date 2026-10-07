"use client";

import { useEffect } from "react";
import { NaverMap, NaverMarker } from "@/shared/types/naver-maps";
import { ResponseRestaurant } from "@/shared/api/model/restaurant";
import { useOpenRestaurantDetail } from "@/features/restaurant/model/detail-navigation";
import { RICE_TYPE, TOPOKKI_TYPE_ABBR } from "@/shared/constants/restaurant";

interface RestaurantMarkerProps {
  map: NaverMap;
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

const RestaurantMarker = ({ map, restaurants }: RestaurantMarkerProps) => {
  const openDetail = useOpenRestaurantDetail();

  useEffect(() => {
    if (!restaurants.length) return;
    const naver = window.naver.maps;

    const markers: NaverMarker[] = [];

    restaurants.forEach((restaurant) => {
      // 거꾸로 된 물방울 핀 (26x36, 끝은 둥근 팁). 색상은 --color-primary-500 (data URI라 하드코딩)
      // 즐겨찾기한 식당은 머리 부분에 흰 별 표시
      const svgString = `
        <svg width="26" height="36" viewBox="0 0 32 44" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.6 42.2C10.6 34.6 2 26.8 2 16a14 14 0 1 1 28 0c0 10.8-8.6 18.6-12.6 26.2a1.75 1.75 0 0 1-2.8 0Z" fill="#FF6B43"/>
          ${
            restaurant.isFavorite
              ? '<path d="M16 8l1.94 5.33 5.67.2-4.47 3.49 1.56 5.45L16 19.3l-4.7 3.17 1.56-5.45-4.47-3.49 5.67-.2Z" fill="white" stroke="white" stroke-width="2.4" stroke-linejoin="round"/>'
              : ""
          }
        </svg>
      `;

      const markerIcon = {
        url:
          "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString),
        size: { width: 26, height: 36 },
        anchor: { x: 13, y: 36 },
      };

      const marker = new naver.Marker({
        position: new naver.LatLng(restaurant.latitude, restaurant.longitude),
        map: map,
        title: restaurant.name,
        icon: markerIcon,
      });

      // 지도 이동은 상세 시트가 preview 좌표로 처리한다
      naver.Event.addListener(marker, "click", () =>
        openDetail(restaurant.id, restaurant),
      );

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
              <span class="shrink-0 text-sm font-semibold text-gray-900">${restaurant.price?.toLocaleString()}원${(restaurant.priceServings ?? 1) > 1 ? `<span class="font-normal text-gray-500"> ${restaurant.priceServings}인</span>` : ""}</span>
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
  }, [map, restaurants, openDetail]);

  return null;
};

export default RestaurantMarker;
