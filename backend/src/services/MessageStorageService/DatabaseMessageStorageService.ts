import { Message, messagesTable } from "@src/db/schema";
import db from "@src/db/db";
import { eq } from "drizzle-orm";

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
}
