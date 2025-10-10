"use client";

import { useEffect } from "react";
import { overlay } from "overlay-kit";
import { NaverMap, NaverMaps, NaverMarker } from "@/types/naver-maps";
import { hoverStyle } from "@/components/map/map.css";
import { ResponseRestaurant } from "@/service/model/restaurant.ts";
import RestaurantDetail from "@/components/restaurant/detail/RestaurantDetail";
import { TOPOKKI_RICE_KINDS } from "@/constants/restaurant";

interface RestaurantMarkerProps {
  map: NaverMap;
  naver: NaverMaps;
  restaurants: ResponseRestaurant[];
}

const RestaurantMarker = ({
  map,
  naver,
  restaurants,
}: RestaurantMarkerProps) => {
  useEffect(() => {
    if (!map || !naver || !restaurants.length) return;

    const markers: NaverMarker[] = [];

    restaurants.forEach((restaurant) => {
      // 커스텀 마커 아이콘 생성
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

      // 마커 클릭 이벤트
      naver.Event.addListener(marker, "click", () => {
        // 바텀시트가 40vh를 차지하므로, 위도를 약간 위쪽으로 조정
        // 줌 레벨 16에서 대략 0.002도 정도 위로 이동
        const offsetLat = 0.00195;
        const adjustedPosition = new naver.LatLng(
          restaurant.latitude - offsetLat,
          restaurant.longitude,
        );

        map.setCenter(adjustedPosition);
        map.setZoom(17);

        overlay.open((controller) => (
          <RestaurantDetail restaurant={restaurant} controller={controller} />
        ));
      });

      // 정보창 생성
      const infoWindow = new naver.InfoWindow({
        content: `
          <div style="min-width: 200px;" class="${hoverStyle.container}">
            <h3 class="${hoverStyle.title}">${restaurant.name}</h3>
            <div class="${hoverStyle.description}">
            <span class="${hoverStyle.infoTag}">${TOPOKKI_TYPE_ABBR[restaurant.topokkiType]}</span>
            ${restaurant.riceKinds.map((kind) => `<span class="${hoverStyle.infoTag}">${TOPOKKI_RICE_KINDS[kind]}</span>`)}
            <span class="${hoverStyle.infoTag}">
              <i class="fi fi-sr-pepper" style="height: 14px; display: inline-flex; align-items: center;"></i>
              ${restaurant.spiciness}단계</span>
              <span class="${hoverStyle.infoTag}" data-type="price">
                <span style="font-weight: 700">₩</span>
                ${restaurant.price.toLocaleString()}
              </span>
            </div>
            <div class="${hoverStyle.description}">
              <span>${restaurant.address.split(" ").slice(0, 2).join(" ")}</span>
              <span>(리뷰 +${restaurant.reviewCount})</span>
            </div>
          </div>
        `,
        maxWidth: 250,
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderWidth: 0,
      });

      // 마커 호버 시 정보창 표시
      naver.Event.addListener(marker, "mouseover", () => {
        infoWindow.open(map, marker);
      });

      naver.Event.addListener(marker, "mouseout", () => {
        infoWindow.close();
      });

      markers.push(marker);
    });

    // 컴포넌트 언마운트 시 마커 정리
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
