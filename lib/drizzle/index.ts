import { drizzle } from 'drizzle-orm/vercel-postgres';
import { createPool } from '@vercel/postgres';
import * as schema from './schema';

// DATABASE_URL을 명시적으로 사용
console.log('Environment check:', {
  DATABASE_URL: !!process.env.DATABASE_URL,
});

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL 환경변수가 설정되지 않았습니다.');
}

// DATABASE_URL을 사용해서 연결 생성
const pool = createPool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export * from './schema';