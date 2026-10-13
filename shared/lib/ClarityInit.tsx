"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

// Microsoft Clarity (세션 녹화·히트맵 UX 분석).
// 운영 빌드에서 프로젝트 ID가 있을 때만 켠다 — 로컬 개발 세션이 통계에 섞이지 않게.
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

export default function ClarityInit() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !CLARITY_PROJECT_ID) return;
    Clarity.init(CLARITY_PROJECT_ID);
  }, []);

  return null;
}
