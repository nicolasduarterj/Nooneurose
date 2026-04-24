/** Represents a prompt generated from chat messages. Stored in-memory during MVP phase; will be migrated to Drizzle ORM later.*/
export interface prompt {
  id: number;
  prompt: string;
  parent_id: number | null;
  created_at: string;
}

/**
 * Creates a new Prompt object with auto-generated timestamp.
 */
export function createPrompt(
  id: number,
  prompt: string,
  parent_id: number | null = null
): prompt {
  return {
    id,
    prompt,
    parent_id,
    created_at: new Date().toISOString(),
  };
}
