import { prompt, createPrompt } from '../../models/common/prompt';
import { getUnusedMessages, markMessageAsIncluded } from '../messageService/MainMessageService';

/**
 * In-memory prompt storage.
 * This mimics a relational DB table and will be replaced by Drizzle ORM queries later.
 */
const promptStore: prompt[] = [];  // prompt minúsculo

let nextId = 1;

/**
 * Registers a new prompt in the in-memory store.
 * @param content - The prompt text.
 * @param parent_id - Optional ID of the parent prompt (for chaining).
 * @returns The newly created prompt object.
 */
export function registerPrompt(content: string, parent_id: number | null = null): prompt {  // prompt minúsculo
  const newPrompt = createPrompt(nextId++, content, parent_id);
  promptStore.push(newPrompt);
  return newPrompt;
}

/**
 * Returns the most recently created prompt.
 * @returns The latest prompt or null if no prompts exist.
 */
export function getLatestPrompt(): prompt | null {  // prompt minúsculo
  if (promptStore.length === 0) return null;
  return promptStore[promptStore.length - 1];
}

/**
 * Generates a new prompt by concatenating all unused messages from a chat.
 * Marks those messages as "included_in_prompt" after generation.
 * @param chat_uuid - The chat session identifier.
 * @returns The generated prompt, or null if no unused messages exist.
 */
export function generatePromptFromUnusedMessages(chat_uuid: string): prompt | null {  // prompt minúsculo
  const unusedMessages = getUnusedMessages(chat_uuid);
  
  if (unusedMessages.length === 0) return null;
  
  // Build prompt by joining all message contents
  const promptText = unusedMessages
    .map((msg) => msg.content)
    .join('\n');
  
  // Mark all these messages as used
  unusedMessages.forEach((msg) => markMessageAsIncluded(msg.id));
  
  // Register the prompt
  const latestPrompt = getLatestPrompt();
  const parentId = latestPrompt ? latestPrompt.id : null;
  const newPrompt = registerPrompt(promptText, parentId);
  
  return newPrompt;
}