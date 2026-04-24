import { sql } from "drizzle-orm";
import { AnyPgColumn, boolean, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const messagesTable = pgTable('messages', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    content: text('content').notNull(),
    chatUUID: uuid('chat_uuid').notNull(),
    isIncludedInPrompt: boolean('is_included_in_prompt').notNull().default(false),
    timestamp: timestamp('timestamp').notNull().default(sql`now()`)
})

export const promptsTable = pgTable('prompts', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    content: text('content').notNull(),
    parentId: integer('parent_id').references((): AnyPgColumn => promptsTable.id),
    timestamp: timestamp('timestamp').notNull().default(sql`now()`)
})

export type Message = typeof messagesTable.$inferSelect
export type Prompt = typeof promptsTable.$inferSelect
