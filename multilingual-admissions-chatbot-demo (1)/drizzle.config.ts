import { defineConfig } from "drizzle-kit";

/**
 * drizzle-kit loads `.env` automatically. To push the schema to the
 * production database, either put the pooled URL in .env or prefix:
 *
 *   DATABASE_URL="postgres://…" npx drizzle-kit push
 */
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://postgres:postgres@127.0.0.1:5432/app_db",
  },
});
