import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './lib/drizzle/schema.ts',
  out: './lib/drizzle/migrations',
  driver: 'neon-websocket',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
});