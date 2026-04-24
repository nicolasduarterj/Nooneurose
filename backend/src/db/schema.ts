import { sql } from "drizzle-orm";
import { AnyPgColumn, boolean, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const messagesTable = pgTable('messages', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    content: text('content').notNull(),
    chatUUID: uuid('chat_uuid').notNull(),
    isIncludedInPrompt: boolean('is_included_in_prompt').notNull().default(false),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull().default(sql`now()`)
})

export const promptsTable = pgTable('prompts', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    content: text('content').notNull(),
    parentId: integer('parent_id').references((): AnyPgColumn => promptsTable.id),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull().default(sql`now()`)
})

export const responsesTable = pgTable('responses', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    content: text('content').notNull(),
    parentId: integer('parent_id').references(() => messagesTable.id).notNull(),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull().default(sql`now()`)
})

export type Message = typeof messagesTable.$inferSelect
export type Prompt = typeof promptsTable.$inferSelect
export type Response = typeof responsesTable.$inferSelect

export type MessageAndResponse = {
    messages: Message,
    responses: Response | null
}
