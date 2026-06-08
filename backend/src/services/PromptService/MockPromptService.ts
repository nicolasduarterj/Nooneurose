import { Prompt } from '@src/db/schema'
import Character from '@src/models/common/Character';
import Chat from '@src/models/common/Chat';

export default abstract class MockPromptService {
    /**
     * Mock prompt service for testing.
     * Returns predefined responses instead of real data.
     */
    private static nextId = 1000;

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async register(content: string, parent_id: number | null, character: Character): Promise<Prompt> {
        return {
            id: MockPromptService.nextId++,
            content: `MOCK: ${content}`,
            parentId: parent_id,
            timestamp: new Date(),
            character: 1
        };
    }

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async getLatestPrompt(character: Character): Promise<Prompt> {
        return {
            id: 999,
            content: 'Mock latest prompt',
            parentId: null,
            timestamp: new Date(),
            character: character.id
        };
    }

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async generatePromptFromUnusedMessages(chat: Chat): Promise<Prompt | null> {
        return {
            id: MockPromptService.nextId++,
            content: `Mock generated prompt from chat ${chat.id}`,
            parentId: 999,
            timestamp: new Date(),
            character: chat.characterId
        };
    }

    public static async deleteByCharacter(character: Character): Promise<void> {}
}
