/** 문단 | 목록 | 표 */
export type LegalBlock =
  | string
  | { list: string[] }
  | { table: { head: string[]; rows: string[][] } };

export type LegalSection = {
  title: string;
  body: LegalBlock[];
};

export type LegalDocument = {
  version: string;
  effectiveDate: string; // YYYY-MM-DD (시행일)
  summary: string; // 개정 이력에 표시할 주요 변경 내용
  preface?: string;
  sections: LegalSection[];
};

import { SITE_URL } from "@/shared/constants/site";

// 운영자 정보 (약관·방침 공통)
export const OPERATOR = {
  service: "오떠끼(오늘의 떡볶이)",
  name: "손수철",
  email: "todaytopokki@gmail.com",
  url: SITE_URL,
} as const;
