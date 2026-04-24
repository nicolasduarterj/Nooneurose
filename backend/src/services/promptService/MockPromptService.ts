import { prompt, createPrompt } from '../../models/common/prompt';

/**
 * Mock prompt service for testing.
 * Returns predefined responses instead of real data.
 */
let nextId = 1000;

export function registerPrompt(content: string, parent_id: number | null = null): prompt {
  return {
    id: nextId++,
    prompt: `MOCK: ${content}`,
    parent_id,
    created_at: new Date().toISOString(),
  };
}

export function getLatestPrompt(): prompt | null {
  return {
    id: 999,
    prompt: 'Mock latest prompt',
    parent_id: null,
    created_at: new Date().toISOString(),
  };
}

export function generatePromptFromUnusedMessages(chat_uuid: string): prompt | null {
  return {
    id: nextId++,
    prompt: `Mock generated prompt from chat ${chat_uuid}`,
    parent_id: 999,
    created_at: new Date().toISOString(),
  };
}