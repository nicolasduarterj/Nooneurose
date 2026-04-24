import { Message, MessageAndResponse, Response } from "@src/db/schema";

export default abstract class MockStorageService {
    /**
     * Mock message service for testing.
     * Returns predefined responses instead of real data.
     */
    private static nextId = 1000; // IDs diferentes para distinguir dos reais

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async registerMessage(content: string, chat_uuid: string): Promise<Message> {
        return {
            id: MockStorageService.nextId++,
            content: `MOCK: ${content}`,
            chatUUID: chat_uuid,
            isIncludedInPrompt: false,
            timestamp: new Date(),
        };
    }

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async getMessagesByChat(chat_uuid: string): Promise<Message[]> {
        return [
            {
                id: 1,
                content: 'Mock message 1',
                chatUUID: chat_uuid,
                isIncludedInPrompt: false,
                timestamp: new Date(),
            },
            {
                id: 2,
                content: 'Mock message 2',
                chatUUID: chat_uuid,
                isIncludedInPrompt: false,
                timestamp: new Date(),
            },
        ];
    }

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async markMessageAsIncluded(msg_id: number): Promise<Message | null> {
        return {
            id: msg_id,
            content: 'Mock message marked as included',
            chatUUID: 'mock-chat',
            isIncludedInPrompt: true,
            timestamp: new Date(),
        };
    }

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async getUnusedMessages(chat_uuid: string): Promise<Message[]> {
        return [
            {
                id: 1,
                content: 'Mock unused message',
                chatUUID: chat_uuid,
                isIncludedInPrompt: false,
                timestamp: new Date(),
            },
        ];
    }

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async registerResponse(content: string, msg_id: number): Promise<Response> {
        return {
            id: 1,
            content: 'Mock response',
            timestamp: new Date(),
            parentId: 1
        }
    }

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async getMessagesAndResponsesByChat(chat_uuid: string): Promise<MessageAndResponse[]> {
        return [{
            messages: {
                id: 1,
                content: 'Mock response',
                timestamp: new Date(),
                isIncludedInPrompt: false,
                chatUUID: chat_uuid
            },
            responses: {
                id: 1,
                content: 'Mock response',
                timestamp: new Date(),
                parentId: 1
            }
        }]
    }
}
