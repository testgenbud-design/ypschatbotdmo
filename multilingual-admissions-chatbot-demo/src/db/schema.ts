import { pgTable, serial, text, varchar, boolean, timestamp, real } from "drizzle-orm/pg-core";

/** Every question asked to the assistant — feeds the registrar dashboard idea. */
export const chatLogs = pgTable("chat_logs", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  lang: varchar("lang", { length: 8 }).notNull().default("en"),
  question: text("question").notNull(),
  topScore: real("top_score").notNull().default(0),
  answered: boolean("answered").notNull().default(false),
  via: varchar("via", { length: 16 }).notNull().default("llm"), // llm | handoff | declined | greeting | error
  ipHash: varchar("ip_hash", { length: 24 }),
});

/** "Request a callback" leads captured from the chat widget. */
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  name: varchar("name", { length: 80 }).notNull(),
  phone: varchar("phone", { length: 16 }).notNull(),
  interest: varchar("interest", { length: 80 }).notNull(),
  consent: boolean("consent").notNull().default(false),
  source: varchar("source", { length: 16 }).notNull().default("widget"),
});
