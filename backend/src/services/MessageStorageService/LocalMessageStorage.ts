import DatabaseError from "@src/common/types/DatabaseError";
import Message from "@src/models/common/Message";
import Chat from "@src/models/common/Chat";

export default abstract class LocalMessageStorage {
    /** 
     * In-memory message storage.
     * Key: chat_uuid, Value: Array of messages for that chat.
     * This mimics a relational DB table and will be replaced by Drizzle ORM queries later.
    */

    private static messageStore: Message[] = [];
    private static responseStore: Message[] = [];
    private static nextId = 1;

    /**
     * Registers a new message in the in-memory store.
     * @param content - The message text.
     * @param chat_uuid - The unique identifier of the chat session.
     * @returns The newly created Message object.
     */
    //eslint-disable-next-line @typescript-eslint/require-await
    public static async registerMessage(content: string, chat: Chat): Promise<Message> {
        const message: Message = {
            id: LocalMessageStorage.nextId++,
            content: content,
            isIncludedInPrompt: false,
            timestamp: new Date(),
            chatId: chat.id,
            source: 'user'
        }

        LocalMessageStorage.messageStore.push(message)
        return message;
    }

    /**
     * Retrieves all messages from a specific chat.
     * @param chat_uuid - The unique identifier of the chat session.
     * @returns An array of Messages (empty array if chat has no messages).
     */
    //eslint-disable-next-line @typescript-eslint/require-await
    public static async getMessagesByChat(chat: Chat): Promise<Message[]> {
        return LocalMessageStorage.messageStore.filter(msg => msg.chatId === chat.id)
    }

    /**
     * Marks a specific message as included in a prompt.
     * @param msg_id - The message ID to mark.
     * @returns The updated Message, or null if not found.
     */
    //eslint-disable-next-line @typescript-eslint/require-await
    public static async markMessageAsIncluded(msgId: number): Promise<Message | null> {
        for (let i = 0; i < LocalMessageStorage.messageStore.length; i++) {
            if (
                !LocalMessageStorage.messageStore[i].isIncludedInPrompt &&
                LocalMessageStorage.messageStore[i].id === msgId
            ) {
                LocalMessageStorage.messageStore[i].isIncludedInPrompt = true
                return LocalMessageStorage.messageStore[i]
            }
        }
        return null
    }

    /**
     * Returns all messages not yet included in any prompt for a given chat.
     * @param chat_uuid - The chat session identifier.
     * @returns Array of unused Messages.
     */
    //eslint-disable-next-line @typescript-eslint/require-await
    public static async getUnusedMessages(chat: Chat): Promise<Message[]> {
        return LocalMessageStorage.messageStore.filter(msg =>
            msg.chatId === chat.id && !msg.isIncludedInPrompt
        )
    }

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async registerResponse(content: string, msgId: number): Promise<Message> {
        const baseMsg = LocalMessageStorage.messageStore.find(msg => msg.id === msgId)
        if (!baseMsg)
            throw new DatabaseError()

        const newmsg: Message = {
            id: ++LocalMessageStorage.nextId,
            content: content,
            chatId: baseMsg.chatId,
            isIncludedInPrompt: false,
            source: 'assistant',
            timestamp: new Date()
        }

        LocalMessageStorage.responseStore.push(newmsg)
        return newmsg
    }

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async getMessagesAndResponsesByChat(chat: Chat): Promise<Message[]> {
        const msgs = LocalMessageStorage.messageStore.filter(msg => msg.chatId === chat.id)
        const responses = LocalMessageStorage.responseStore.filter(msg => msg.chatId === chat.id)

        const result = msgs.concat(responses)
        return result
    }
}
