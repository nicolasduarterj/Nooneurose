import Message from "@src/models/common/Message";
import Chat from "@src/models/common/Chat";

export default abstract class MockStorageService {
    /**
     * Mock message service for testing.
     * Returns predefined responses instead of real data.
     */
    private static nextId = 1000; // IDs diferentes para distinguir dos reais

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async registerMessage(content: string, chat: Chat): Promise<Message> {
        return {
            id: MockStorageService.nextId++,
            content: `MOCK: ${content}`,
            chatId: chat.id,
            isIncludedInPrompt: false,
            timestamp: new Date(),
            source: 'assistant'
        };
    }

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async getMessagesByChat(chat: Chat): Promise<Message[]> {
        return [
            {
                id: 1,
                content: 'Mock message 1',
                chatId: chat.id,
                isIncludedInPrompt: false,
                timestamp: new Date(),
                source: 'user'
            },
            {
                id: 2,
                content: 'Mock message 2',
                chatId: chat.id,
                isIncludedInPrompt: false,
                timestamp: new Date(),
                source: 'user'
            },
        ];
    }

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async markMessageAsIncluded(msgId: number): Promise<Message | null> {
        return {
            id: msgId,
            content: 'Mock message marked as included',
            chatId: 1,
            isIncludedInPrompt: true,
            timestamp: new Date(),
            source: 'user'
        };
    }

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async getUnusedMessages(chat: Chat): Promise<Message[]> {
        return [
            {
                id: 1,
                content: 'Mock unused message',
                chatId: chat.id,
                isIncludedInPrompt: false,
                timestamp: new Date(),
                source: 'user'
            },
        ];
    }

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async registerResponse(content: string, msgId: number): Promise<Message> {
        return {
            id: 1,
            content: 'Mock response',
            timestamp: new Date(),
            chatId: 12,
            source: 'assistant',
            isIncludedInPrompt: false
        }
    }

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async getMessagesAndResponsesByChat(chat: Chat): Promise<Message[]> {
        return [
            {
                id: 1,
                content: 'Mock response',
                timestamp: new Date(),
                isIncludedInPrompt: false,
                chatId: chat.id,
                source: 'user'
            },
            {
                id: 1,
                content: 'Mock response',
                timestamp: new Date(),
                isIncludedInPrompt: false,
                chatId: chat.id,
                source: 'assistant'
            }
        ]
    }
}
