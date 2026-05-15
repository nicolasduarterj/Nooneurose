import { messagesTable, responsesTable } from "@src/db/schema";
import Message from "@src/models/common/Message";
import db from "@src/db/db";
import { and, eq } from "drizzle-orm";
import DatabaseError, { ThrowsDatabaseError } from "@src/common/types/DatabaseError";
import Chat from "@src/models/common/Chat";

export default abstract class DatabaseMessageStorageService {
    @ThrowsDatabaseError
    public static async registerMessage(content: string, chat: Chat): Promise<Message> {
        const message: typeof messagesTable.$inferInsert = {
            content,
            chatId: chat.id
        };

        const res = await db.insert(messagesTable).values(message).returning()
        return {
            id: res[0].id,
            content: res[0].content,
            chatId: res[0].chatId,
            isIncludedInPrompt: res[0].isIncludedInPrompt,
            source: 'user',
            timestamp: res[0].timestamp
        }
    }

    @ThrowsDatabaseError
    public static async getMessagesByChat(chat: Chat): Promise<Message[]> {
        const res = await db.select().from(messagesTable).where(eq(messagesTable.chatId, chat.id))
        return res.map(resItem => ({
            id: resItem.id,
            content: resItem.content,
            chatId: resItem.chatId,
            isIncludedInPrompt: resItem.isIncludedInPrompt,
            source: 'user',
            timestamp: resItem.timestamp
        }))
    }

    @ThrowsDatabaseError
    public static async markMessageAsIncluded(msgId: number): Promise<Message | null> {
        const res = await db.update(messagesTable)
            .set({ isIncludedInPrompt: true })
            .where(eq(messagesTable.id, msgId))
            .returning()
        return {
            id: msgId,
            content: res[0].content,
            chatId: res[0].chatId,
            source: 'user',
            timestamp: res[0].timestamp,
            isIncludedInPrompt: true,
        }
    }

    @ThrowsDatabaseError
    public static async getUnusedMessages(chat: Chat): Promise<Message[]> {
        const res = await db.select().from(messagesTable)
            .where(
                and(
                    eq(messagesTable.isIncludedInPrompt, false),
                    eq(messagesTable.chatId, chat.id)
                ))
        return res.map(resItem => ({
            id: resItem.id,
            content: resItem.content,
            isIncludedInPrompt: resItem.isIncludedInPrompt,
            source: 'user',
            timestamp: resItem.timestamp,
            chatId: resItem.chatId
        }))
    }

    @ThrowsDatabaseError
    public static async registerResponse(content: string, msgId: number): Promise<Message> {
        const msgCandidates = await db.select().from(messagesTable).where(eq(messagesTable.id, msgId))

        if (msgCandidates.length === 0)
            throw new DatabaseError('Error responding to non-existing message')

        const msg = msgCandidates[0]
        const resBase: typeof responsesTable.$inferInsert = {
            content,
            parentId: msg.id
        }

        const res = await db.insert(responsesTable).values(resBase).returning()
        return {
            id: res[0].id,
            content: res[0].content,
            chatId: msg.chatId,
            timestamp: res[0].timestamp,
            isIncludedInPrompt: false,
            source: 'assistant'
        }
    }

    @ThrowsDatabaseError
    public static async getMessagesAndResponsesByChat(chat: Chat): Promise<Message[]> {
        const res = await db.select().from(messagesTable)
            .leftJoin(responsesTable, eq(messagesTable.id, responsesTable.parentId))
            .where(eq(messagesTable.chatId, chat.id))

        const msgs: Message[] = []
        for (const resItem of res) {
            msgs.push({
                id: resItem.messages.id,
                content: resItem.messages.content,
                chatId:resItem.messages.chatId,
                timestamp: resItem.messages.timestamp,
                isIncludedInPrompt: resItem.messages.isIncludedInPrompt,
                source: 'user'
            })
            if (resItem.responses) {
                msgs.push({
                    id: resItem.responses.id,
                    content: resItem.responses.content,
                    chatId: resItem.messages.chatId,
                    timestamp: resItem.responses.timestamp,
                    isIncludedInPrompt: false,
                    source: 'assistant'
                })
            }
        }

        return msgs
    }
}
