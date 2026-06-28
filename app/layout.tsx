import type { Metadata, Viewport } from "next";
import "@/shared/style/global.css";
import localFont from "next/font/local";
import Layout from "@/shared/layouts/Layout";
import Providers from "@/app/Providers";

export const metadata: Metadata = {
  title: "오떠끼 - 오늘의 떡볶이를 찾아보세요",
  description: "떡볶이, 분식집을 자세하게 찾아볼 수 있어요",
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
