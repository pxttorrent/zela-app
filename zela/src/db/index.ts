import { neonConfig } from "@neondatabase/serverless";
import * as schema from "./schema";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { drizzle as drizzleNode } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

const isLocal =
  databaseUrl.includes("localhost") ||
  databaseUrl.includes("127.0.0.1") ||
  databaseUrl.includes("0.0.0.0");

export const db = isLocal
  ? (() => {
      const pool = new Pool({ connectionString: databaseUrl });
      return drizzleNode(pool, { schema });
    })()
  : (() => {
      neonConfig.fetchConnectionCache = true;
      return drizzleNeon(databaseUrl, { schema });
    })();

export { schema };
