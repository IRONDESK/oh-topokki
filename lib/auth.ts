import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/shared/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
  user: {
    // Better Auth 내부 필드 `name` ↔ DB 컬럼 `nickname` 매핑
    fields: {
      name: "nickname",
    },
  },
  plugins: [nextCookies()], // 항상 마지막 플러그인
});
