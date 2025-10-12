import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL 환경변수가 설정되지 않았습니다.");
}

// Serverless PostgreSQL 연결 (Vercel Edge Runtime 호환)
const client = neon(process.env.DATABASE_URL);

export const db = drizzle(client, { schema });
export * from "./schema";
