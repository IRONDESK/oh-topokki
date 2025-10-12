import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// DATABASE_URL을 명시적으로 사용
console.log('Environment check:', {
  DATABASE_URL: !!process.env.DATABASE_URL,
  URL_prefix: process.env.DATABASE_URL?.substring(0, 20),
});

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL 환경변수가 설정되지 않았습니다.');
}

// postgres-js 사용 (기본 PostgreSQL 드라이버)
const client = postgres(process.env.DATABASE_URL, {
  ssl: 'require',
  connection: {
    application_name: 'todaytopokki'
  }
});

export const db = drizzle(client, { schema });

export * from './schema';