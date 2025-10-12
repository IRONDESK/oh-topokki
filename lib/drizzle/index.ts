import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const globalForDb = globalThis as unknown as {
  connection: postgres.Sql | undefined;
};

// Cloudflare Workers에서 안전한 PostgreSQL 연결
function createConnection() {
  console.log('Drizzle PostgreSQL 연결 생성');
  console.log('DATABASE_URL 존재:', !!process.env.DATABASE_URL);

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL 환경변수가 설정되지 않았습니다.');
  }

  return postgres(process.env.DATABASE_URL, {
    // 연결 풀 크기 최소화
    max: 1,
    idle_timeout: 20,
    max_lifetime: 60 * 30,
    ssl: { rejectUnauthorized: false },
  });
}

export const connection = globalForDb.connection ?? createConnection();

if (process.env.NODE_ENV !== 'production') {
  globalForDb.connection = connection;
}

export const db = drizzle(connection, { schema });

export * from './schema';