"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

// Microsoft Clarity (세션 녹화·히트맵 UX 분석).
// 운영 빌드에서 프로젝트 ID가 있을 때만 켠다 — 로컬 개발 세션이 통계에 섞이지 않게.
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
// 개인정보 처리방침 v1.1(이용 행태 분석 항목 추가) 시행일. 수집 항목 추가는 30일 전 공지가 필요해 이 날부터 수집한다.
const CLARITY_START = new Date("2026-11-12T00:00:00+09:00");

export default function ClarityInit() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !CLARITY_PROJECT_ID) return;
    if (Date.now() < CLARITY_START.getTime()) return;
    Clarity.init(CLARITY_PROJECT_ID);
  }, []);

  return null;
}
