// 도메인 변경 시 NEXT_PUBLIC_SITE_URL 환경변수만 바꾸면 canonical·sitemap·OG URL이 함께 바뀐다.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://oh-topokki.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "오떠끼";

export const restaurantPath = (id: string) => `/restaurants/${id}`;
