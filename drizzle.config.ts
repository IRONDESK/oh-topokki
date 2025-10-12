import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './lib/drizzle/schema.ts',
  out: './lib/drizzle/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});