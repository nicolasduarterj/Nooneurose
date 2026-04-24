import { message } from '../../models/common/message';

export default abstract class MockStorageService {
    /**
     * Mock message service for testing.
     * Returns predefined responses instead of real data.
     */
    private static nextId = 1000; // IDs diferentes para distinguir dos reais

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async registerMessage(content: string, chat_uuid: string): Promise<message> {
        return {
            id: MockStorageService.nextId++,
            content: `MOCK: ${content}`,
            chat_uuid,
            included_in_prompt: false,
            created_at: new Date().toISOString(),
        };
    }

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async getMessagesByChat(chat_uuid: string): Promise<message[]> {
        return [
            {
                id: 1,
                content: 'Mock message 1',
                chat_uuid,
                included_in_prompt: false,
                created_at: new Date().toISOString(),
            },
            {
                id: 2,
                content: 'Mock message 2',
                chat_uuid,
                included_in_prompt: false,
                created_at: new Date().toISOString(),
            },
        ];
    }

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async markMessageAsIncluded(msg_id: number): Promise<message | null> {
        return {
            id: msg_id,
            content: 'Mock message marked as included',
            chat_uuid: 'mock-chat',
            included_in_prompt: true,
            created_at: new Date().toISOString(),
        };
    }

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async getUnusedMessages(chat_uuid: string): Promise<message[]> {
        return [
            {
                id: 1,
                content: 'Mock unused message',
                chat_uuid,
                included_in_prompt: false,
                created_at: new Date().toISOString(),
            },
        ];
    }
}
