import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

import * as corsairSchema from "./corsair-schema";
import * as authSchema from "./auth-schema";

export const db = drizzle(pool, { schema: { ...corsairSchema, ...authSchema } });