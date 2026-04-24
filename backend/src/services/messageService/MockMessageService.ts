import { message, createMessage } from '../../models/common/message';

/**
 * Mock message service for testing.
 * Returns predefined responses instead of real data.
 */
let nextId = 1000; // IDs diferentes para distinguir dos reais

export function registerMessage(content: string, chat_uuid: string): message {
  return {
    id: nextId++,
    content: `MOCK: ${content}`,
    chat_uuid,
    included_in_prompt: false,
    created_at: new Date().toISOString(),
  };
}

export function getMessagesByChat(chat_uuid: string): message[] {
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

export function markMessageAsIncluded(msg_id: number): message | null {
  return {
    id: msg_id,
    content: 'Mock message marked as included',
    chat_uuid: 'mock-chat',
    included_in_prompt: true,
    created_at: new Date().toISOString(),
  };
}

export function getUnusedMessages(chat_uuid: string): message[] {
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