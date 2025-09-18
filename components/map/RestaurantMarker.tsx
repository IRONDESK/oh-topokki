'use client';

import { useEffect } from 'react';
import { NaverMap, NaverMaps, NaverMarker } from '@/types/naver-maps';

interface Restaurant {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  averageRating: number;
  reviewCount: number;
}

interface RestaurantMarkerProps {
  map: NaverMap;
  naver: NaverMaps;
  restaurants: Restaurant[];
  onMarkerClick?: (restaurant: Restaurant) => void;
}

const RestaurantMarker = ({
  map,
  naver,
  restaurants,
  onMarkerClick,
}: RestaurantMarkerProps) => {
  useEffect(() => {
    if (!map || !naver || !restaurants.length) return;

    const markers: NaverMarker[] = [];

    restaurants.forEach((restaurant) => {
      // 커스텀 마커 아이콘 생성
      const markerIcon = {
        url: 'data:image/svg+xml;base64,' + btoa(`
          <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.2 0 0 7.2 0 16c0 16 16 24 16 24s16-8 16-24C32 7.2 24.8 0 16 0z" fill="#F54E26"/>
            <circle cx="16" cy="16" r="8" fill="white"/>
            <text x="16" y="20" text-anchor="middle" fill="#F54E26" font-size="12" font-weight="bold">떡</text>
          </svg>
        `),
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
      if (onMarkerClick) {
        naver.Event.addListener(marker, 'click', () => {
          onMarkerClick(restaurant);
        });
      }

      // 정보창 생성
      const infoWindow = new naver.InfoWindow({
        content: `
          <div style="padding: 10px; min-width: 200px;">
            <h3 style="margin: 0 0 5px 0; color: #F54E26;">${restaurant.name}</h3>
            <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">${restaurant.address}</p>
            <div style="display: flex; align-items: center; gap: 5px;">
              <span style="color: #ffc107;">★</span>
              <span style="font-size: 14px;">${restaurant.averageRating.toFixed(1)}</span>
              <span style="font-size: 12px; color: #666;">(${restaurant.reviewCount})</span>
            </div>
          </div>
        `,
        maxWidth: 250,
        backgroundColor: 'white',
        borderColor: '#F54E26',
        borderWidth: 2,
      });

      // 마커 호버 시 정보창 표시
      naver.Event.addListener(marker, 'mouseover', () => {
        infoWindow.open(map, marker);
      });

      naver.Event.addListener(marker, 'mouseout', () => {
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
  }, [map, naver, restaurants, onMarkerClick]);

  return null;
};

export default RestaurantMarker;