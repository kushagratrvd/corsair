import {
  pgTable,
  text,
  bigint
} from "drizzle-orm/pg-core";

export const corsairIntegrations = pgTable(
  "corsair_integrations",
  {
    id: text().primaryKey(),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
    updatedAt: bigint("updated_at", { mode: "number" }).notNull(),
    name: text().notNull(),
    config: text().notNull(),
    dek: text()
  }
);

export const corsairAccounts = pgTable(
  "corsair_accounts",
  {
    id: text().primaryKey(),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
    updatedAt: bigint("updated_at", { mode: "number" }).notNull(),
    tenantId: text("tenant_id").notNull(),
    integrationId: text("integration_id")
      .notNull()
      .references(() => corsairIntegrations.id),
    config: text().notNull(),
    dek: text()
  }
);

export const corsairEntities = pgTable(
  "corsair_entities",
  {
    id: text().primaryKey(),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
    updatedAt: bigint("updated_at", { mode: "number" }).notNull(),
    accountId: text("account_id")
      .notNull()
      .references(() => corsairAccounts.id),
    entityId: text("entity_id").notNull(),
    entityType: text("entity_type").notNull(),
    version: text().notNull(),
    data: text().notNull()
  }
);

export const corsairEvents = pgTable(
  "corsair_events",
  {
    id: text().primaryKey(),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
    updatedAt: bigint("updated_at", { mode: "number" }).notNull(),
    accountId: text("account_id")
      .notNull()
      .references(() => corsairAccounts.id),
    eventType: text("event_type").notNull(),
    payload: text().notNull(),
    status: text()
  }
);