import { Prompt } from '@src/db/schema'
import { getServices } from '../Services';
import Character from '@src/models/common/Character';
import Chat from '@src/models/common/Chat';

export default abstract class LocalPromptService {

    /**
     * In-memory prompt storage.
     * This mimics a relational DB table and will be replaced by Drizzle ORM queries later.
     */
    private static promptStore: Prompt[] = [];  // prompt minúsculo
    private static nextId = 1;

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async register(content: string, parentId: number | null = null, character: Character): Promise<Prompt> {  // prompt minúsculo
        const newPrompt: Prompt = {
            id: LocalPromptService.nextId++,
            parentId: parentId,
            content,
            timestamp: new Date(),
            character: character.id
        }
        LocalPromptService.promptStore.push(newPrompt);
        return newPrompt;
  }

    //eslint-disable-next-line @typescript-eslint/require-await
    public static async getLatestPrompt(character: Character): Promise<Prompt> {  // prompt minúsculo
        if (LocalPromptService.promptStore.length === 0)  {
            return {
                id: LocalPromptService.nextId++,
                parentId: null,
                content: 'Mock prompt',
                timestamp: new Date(),
                character: 1
            }
        }
        return LocalPromptService.promptStore[LocalPromptService.promptStore.length - 1];
  }

    /**
     * Generates a new prompt by concatenating all unused messages from a chat.
     * Marks those messages as "included_in_prompt" after generation.
     * @param chat_uuid - The chat session identifier.
     * @returns The generated prompt, or null if no unused messages exist.
     */
    public static async generatePromptFromUnusedMessages(chat: Chat): Promise<Prompt | null> {  // prompt minúsculo
        const services = getServices()
        const unusedMessages = await services.MessageStorageService.getUnusedMessages(chat)
        const character = await services.CharacterService.getById(chat.characterId)

        if (unusedMessages.length === 0 || !character) return null;

        // Build prompt by joining all message contents
        const promptText = unusedMessages
        .map((msg) => msg.content)
        .join('\n');

        // Mark all these messages as used
        await Promise.all(unusedMessages.map((msg) => services.MessageStorageService.markMessageAsIncluded(msg.id)))

        // Register the prompt
        const latestPrompt = await LocalPromptService.getLatestPrompt(character);
        const parentId = latestPrompt ? latestPrompt.id : null;
        const newPrompt = LocalPromptService.register(promptText, parentId, character);

        return newPrompt;
    }
}
