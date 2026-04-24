import { prompt, createPrompt } from '../../models/common/prompt';
import { getServices } from '../Services';

export default abstract class LocalPromptService {

    /**
     * In-memory prompt storage.
     * This mimics a relational DB table and will be replaced by Drizzle ORM queries later.
     */
    private static promptStore: prompt[] = [];  // prompt minúsculo
    private static nextId = 1;

    /**
     * Registers a new prompt in the in-memory store.
     * @param content - The prompt text.
     * @param parent_id - Optional ID of the parent prompt (for chaining).
     * @returns The newly created prompt object.
     */
    //eslint-disable-next-line @typescript-eslint/require-await
    public static async registerPrompt(content: string, parent_id: number | null = null): Promise<prompt> {  // prompt minúsculo
        const newPrompt = createPrompt(LocalPromptService.nextId++, content, parent_id);
        LocalPromptService.promptStore.push(newPrompt);
        return newPrompt;
  }

    /**
     * Returns the most recently created prompt.
     * @returns The latest prompt or null if no prompts exist.
     */
    //eslint-disable-next-line @typescript-eslint/require-await
    public static async getLatestPrompt(): Promise<prompt | null> {  // prompt minúsculo
        if (LocalPromptService.promptStore.length === 0) return null;
        return LocalPromptService.promptStore[LocalPromptService.promptStore.length - 1];
  }

    /**
     * Generates a new prompt by concatenating all unused messages from a chat.
     * Marks those messages as "included_in_prompt" after generation.
     * @param chat_uuid - The chat session identifier.
     * @returns The generated prompt, or null if no unused messages exist.
     */
    public static async generatePromptFromUnusedMessages(chat_uuid: string): Promise<prompt | null> {  // prompt minúsculo
        const services = getServices()
        const unusedMessages = await services.MessageStorageService.getUnusedMessages(chat_uuid);

        if (unusedMessages.length === 0) return null;

        // Build prompt by joining all message contents
        const promptText = unusedMessages
        .map((msg) => msg.content)
        .join('\n');

        // Mark all these messages as used
        await Promise.all(unusedMessages.map((msg) => services.MessageStorageService.markMessageAsIncluded(msg.id)))

        // Register the prompt
        const latestPrompt = await LocalPromptService.getLatestPrompt();
        const parentId = latestPrompt ? latestPrompt.id : null;
        const newPrompt = LocalPromptService.registerPrompt(promptText, parentId);

        return newPrompt;
    }
}
