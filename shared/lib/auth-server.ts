import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * 현재 요청의 인증 세션에서 로그인 유저를 반환한다.
 * Better Auth 세션 유저 형태: { id, name, email, emailVerified, image, ... }
 * 로그인되어 있지 않으면 throw (라우트 핸들러에서 401로 매핑).
 */
export async function getAuthenticatedUser() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("로그인이 필요합니다.");
  }

  return session.user;
}
