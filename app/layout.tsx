import type { Metadata } from "next";
import "@/style/global.css";
import localFont from "next/font/local";
import Layout from "@/share/layouts/Layout";
import Providers from "@/app/Providers";
import { theme } from "@/style/theme.css";

export const metadata: Metadata = {
  title: "오떠끼 - 오늘의 떡볶이를 찾아보세요",
  description: "떡볶이, 분식집을 자세하게 찾아볼 수 있어요",
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
      <body
        className={pretendard.className}
        style={{ color: theme.color.gray["800"] }}
      >
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
