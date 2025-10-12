import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL 환경변수가 설정되지 않았습니다.");
}

// Supabase PostgreSQL 연결 (일반 PostgreSQL 드라이버 사용)
const client = postgres(process.env.DATABASE_URL, {
  ssl: "require",
});

export const db = drizzle(client, { schema });
export * from "./schema";
