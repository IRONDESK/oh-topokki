import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/shared/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    // TODO: 메일 서비스(Resend 등) 연동 전까지 콘솔 출력으로 대체.
    // 연동 시 이 함수 안에서 url을 담아 메일을 발송하면 된다.
    sendResetPassword: async ({ user, url }) => {
      console.log(`[비밀번호 재설정] ${user.email}\n${url}`);
    },
  },
  user: {
    // Better Auth 내부 필드 `name` ↔ DB 컬럼 `nickname` 매핑
    fields: {
      name: "nickname",
    },
  },
  plugins: [nextCookies()], // 항상 마지막 플러그인
});
