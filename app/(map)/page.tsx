import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// 홈은 (map) 레이아웃의 지도만 보여준다.
export default function Home() {
  return null;
}
