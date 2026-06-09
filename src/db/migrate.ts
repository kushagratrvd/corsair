import "dotenv/config";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./index";

await migrate(db, {
  migrationsFolder: "./drizzle"
});

process.exit(0);