import { Prompt } from '@src/db/schema'

export default abstract class MockPromptService {
    /**
     * Mock prompt service for testing.
     * Returns predefined responses instead of real data.
     */
    private static nextId = 1000;

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async registerPrompt(content: string, parent_id: number | null = null): Promise<Prompt> {
        return {
            id: MockPromptService.nextId++,
            content: `MOCK: ${content}`,
            parentId: parent_id,
            timestamp: new Date(),
        };
    }

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async getLatestPrompt(): Promise<Prompt> {
        return {
            id: 999,
            content: 'Mock latest prompt',
            parentId: null,
            timestamp: new Date(),
        };
    }

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async generatePromptFromUnusedMessages(chat_uuid: string): Promise<Prompt | null> {
        return {
            id: MockPromptService.nextId++,
            content: `Mock generated prompt from chat ${chat_uuid}`,
            parentId: 999,
            timestamp: new Date()
        };
    }

}
