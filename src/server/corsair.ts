import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { createCorsair } from 'corsair';
import { gmail } from '@corsair-dev/gmail';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export const corsair = createCorsair({
    multiTenancy: true,
    plugins: [gmail()],
    database: pool,
    kek: process.env.CORSAIR_KEK!,
});