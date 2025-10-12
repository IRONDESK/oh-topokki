import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from './schema';

// DATABASE_URL을 명시적으로 사용
console.log('Environment check:', {
  DATABASE_URL: !!process.env.DATABASE_URL,
  URL_prefix: process.env.DATABASE_URL?.substring(0, 20),
});

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL 환경변수가 설정되지 않았습니다.');
}

// Neon Serverless Pool 생성 (Edge Runtime 호환)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export * from './schema';