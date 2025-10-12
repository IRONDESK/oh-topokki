"use client";

import { useState, useEffect } from "react";

export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const checkIsDesktop = () => {
      // 간단한 모바일 감지 - 모바일이 아니면 데스크톱
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);

      // 디버깅용 로그
      console.log('Device Detection Debug:', {
        userAgent: navigator.userAgent,
        isMobile,
        result: !isMobile
      });

      setIsDesktop(!isMobile);
    };

    checkIsDesktop();
  }, []);

  // 아직 감지 중이면 기본값으로 데스크톱 가정
  return isDesktop ?? true;
}