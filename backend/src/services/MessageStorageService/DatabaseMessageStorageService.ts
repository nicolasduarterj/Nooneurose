import { Message, messagesTable, Response, responsesTable } from "@src/db/schema";
import db from "@src/db/db";
import { eq } from "drizzle-orm";
import DatabaseError from "@src/common/types/DatabaseError";

export default abstract class DatabaseMessageStorageService {
    public static async registerMessage(content: string, chat_uuid: string): Promise<Message> {
        const message: typeof messagesTable.$inferInsert = {
            content,
            chatUUID: chat_uuid,
        };

        const res = await db.insert(messagesTable).values(message).returning()
        return res[0]
    }

    public static async getMessagesByChat(chat_uuid: string): Promise<Message[]> {
        const res = await db.select().from(messagesTable).where(eq(messagesTable.chatUUID, chat_uuid))
        return res
    }

    public static async markMessageAsIncluded(msg_id: number): Promise<Message | null> {
        const res = await db.update(messagesTable)
            .set({ isIncludedInPrompt: true })
            .where(eq(messagesTable.id, msg_id))
            .returning()
        return res[0]
    }

    public static async getUnusedMessages(): Promise<Message[]> {
        const res = await db.select().from(messagesTable).where(eq(messagesTable.isIncludedInPrompt, false))
        return res
    }

    public static async registerResponse(content: string, msg_id: number): Promise<Response> {
        const msgCandidates = await db.select().from(messagesTable).where(eq(messagesTable.id, msg_id))

        if (msgCandidates.length === 0)
            throw new DatabaseError('Error responding to non-existing message')

        const msg = msgCandidates[0]
        const resBase: typeof responsesTable.$inferInsert = {
            content,
            parentId: msg.id
        }

        const res = await db.insert(responsesTable).values(resBase).returning()
        return res[0]
    }
}
