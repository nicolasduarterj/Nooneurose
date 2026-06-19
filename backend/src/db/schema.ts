import { sql } from "drizzle-orm";
import { AnyPgColumn, boolean, integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const messagesTable = pgTable('messages', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    content: text('content').notNull(),
    chatId: integer('chat').references(() => chatsTable.id).notNull(),
    isIncludedInPrompt: boolean('is_included_in_prompt').notNull().default(false),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull().default(sql`now()`)
})

export const promptsTable = pgTable('prompts', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    content: text('content').notNull(),
    parentId: integer('parent_id').references((): AnyPgColumn => promptsTable.id),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull().default(sql`now()`),
    character: integer('character').references(() => charactersTable.id).notNull()
})

export const responsesTable = pgTable('responses', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    content: text('content').notNull(),
    parentId: integer('parent_id').references(() => messagesTable.id).notNull(),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull().default(sql`now()`)
})

export const usersTable = pgTable('users', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    name: varchar('name').notNull(),
    email: varchar('email').notNull().unique(),
    password: varchar('password').notNull(),
    isAdmin: boolean('is_admin').notNull().default(false)
})

export const charactersTable = pgTable('characters', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    name: varchar('name').notNull(),
    description: varchar('description').notNull(),
    isGloballyChangeable: boolean('is_globally_changeable').notNull(),
    isPrivatelyChangeable: boolean('is_privately_changeable').notNull(),
    ownerId: integer('owner').references(() => usersTable.id).notNull(),
    imageURL: varchar('image_url'),
    permissionFile: text('permission_file')
})

export const chatsTable = pgTable('chats', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    ownerId: integer('owner').references(() => usersTable.id).notNull(),
    characterId: integer('character').references(() => charactersTable.id).notNull()
})

export const reportsTable = pgTable('reports', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    character: integer('character').notNull().references(() => charactersTable.id),
    motive: text('motive').notNull()
})

export type Prompt = typeof promptsTable.$inferSelect
export type Response = typeof responsesTable.$inferSelect
export type Message = typeof messagesTable.$inferInsert
export type Chat = typeof chatsTable.$inferSelect

export type MessageAndResponse = {
    messages: Message,
    responses: Response | null
}
