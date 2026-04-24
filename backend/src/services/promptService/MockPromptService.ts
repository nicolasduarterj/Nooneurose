import { Prompt } from '../../models/common/prompt';

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
            prompt: `MOCK: ${content}`,
            parent_id,
            created_at: new Date().toISOString(),
        };
    }

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async getLatestPrompt(): Promise<Prompt | null> {
        return {
            id: 999,
            prompt: 'Mock latest prompt',
            parent_id: null,
            created_at: new Date().toISOString(),
        };
    }

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async generatePromptFromUnusedMessages(chat_uuid: string): Promise<Prompt | null> {
        return {
            id: MockPromptService.nextId++,
            prompt: `Mock generated prompt from chat ${chat_uuid}`,
            parent_id: 999,
            created_at: new Date().toISOString(),
        };
    }

}
