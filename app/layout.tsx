import type { Metadata, Viewport } from "next";
import "@/shared/style/global.css";
import localFont from "next/font/local";
import Layout from "@/shared/layouts/Layout";
import Providers from "@/app/Providers";
import { SITE_NAME, SITE_URL } from "@/shared/constants/site";

const DESCRIPTION =
  "밀떡·쌀떡, 소스, 매운맛 단계, 순대까지 — 떡볶이 맛집을 지도에서 자세하게 찾아보세요";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - 오늘의 떡볶이를 찾아보세요`,
    template: `%s | ${SITE_NAME}`, // 하위 페이지: "선화당 - 부산 동구 판떡볶이 | 오떠끼"
  },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "ko_KR",
    title: `${SITE_NAME} - 오늘의 떡볶이를 찾아보세요`,
    description: DESCRIPTION,
    images: [{ url: "/logo.png", width: 1254, height: 1254, alt: SITE_NAME }],
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff4ea" },
    { media: "(prefers-color-scheme: dark)", color: "#111012" },
  ],
};
const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body className={`${pretendard.className} bg-cream text-ink root`}>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
