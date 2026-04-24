import DatabaseError from "@src/common/types/DatabaseError";
import { Message, MessageAndResponse, Response } from "@src/db/schema";

export default abstract class LocalMessageStorage {
    /** 
     * In-memory message storage.
     * Key: chat_uuid, Value: Array of messages for that chat.
     * This mimics a relational DB table and will be replaced by Drizzle ORM queries later.
    */

    private static messageStore: Map<string, Message[]> = new Map();
    private static responseStore: Map<string, Response[]> = new Map();
    private static nextId = 1;

    /**
     * Registers a new message in the in-memory store.
     * @param content - The message text.
     * @param chat_uuid - The unique identifier of the chat session.
     * @returns The newly created Message object.
     */
    //eslint-disable-next-line @typescript-eslint/require-await
    public static async registerMessage(content: string, chat_uuid: string): Promise<Message> {
        const message: Message = {
            id: LocalMessageStorage.nextId++,
            content: content,
            isIncludedInPrompt: false,
            timestamp: new Date(),
            chatUUID: chat_uuid
        }

        const chatMessages = LocalMessageStorage.messageStore.get(chat_uuid) || [];
        chatMessages.push(message);
        LocalMessageStorage.messageStore.set(chat_uuid, chatMessages);

        return message;
    }

    /**
     * Retrieves all messages from a specific chat.
     * @param chat_uuid - The unique identifier of the chat session.
     * @returns An array of Messages (empty array if chat has no messages).
     */
    //eslint-disable-next-line @typescript-eslint/require-await
    public static async getMessagesByChat(chat_uuid: string): Promise<Message[]> {
        return LocalMessageStorage.messageStore.get(chat_uuid) || [];
    }

    /**
     * Marks a specific message as included in a prompt.
     * @param msg_id - The message ID to mark.
     * @returns The updated Message, or null if not found.
     */
    //eslint-disable-next-line @typescript-eslint/require-await
    public static async markMessageAsIncluded(msg_id: number): Promise<Message | null> {
        for (const messages of LocalMessageStorage.messageStore.values()) {
            const found = messages.find((m) => m.id === msg_id);
            if (found) {
                found.isIncludedInPrompt = true;
                return found;
            }
        }
        return null;
    }

    /**
     * Returns all messages not yet included in any prompt for a given chat.
     * @param chat_uuid - The chat session identifier.
     * @returns Array of unused Messages.
     */
    //eslint-disable-next-line @typescript-eslint/require-await
    public static async getUnusedMessages(chat_uuid: string): Promise<Message[]> {
        const chatMessages = LocalMessageStorage.messageStore.get(chat_uuid) || [];
        return chatMessages.filter((m) => !m.isIncludedInPrompt);
    }

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async registerResponse(content: string, msg_id: number): Promise<Response> {
        const res: Response = {
            id: LocalMessageStorage.nextId++,
            content,
            timestamp: new Date(),
            parentId: msg_id
        }

        let chatUUID = ''
        for (const chat of LocalMessageStorage.messageStore.values()) {
            const msg = chat.find(msg => msg.id === msg_id)
            if (msg) {
                chatUUID = msg.chatUUID
            }
        }

        if (!chatUUID)
            throw new DatabaseError()

        const responses = LocalMessageStorage.responseStore.get(chatUUID) || []
        LocalMessageStorage.responseStore.set(chatUUID, responses.concat(res))
        return res
    }

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async getMessagesAndResponsesByChat(chat_uuid: string): Promise<MessageAndResponse[]> {

        const result: MessageAndResponse[] = []

        const messages = LocalMessageStorage.messageStore.get(chat_uuid) || []
        const responses = LocalMessageStorage.responseStore.get(chat_uuid) || []

        for (let i = 0; i < messages.length; i++) {
            result.push({
                messages: messages[i],
                responses: responses.find(res => res.parentId === messages[i].id) ?? null
            })
        }

        return result
    }
}
