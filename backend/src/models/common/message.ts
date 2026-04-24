/** Represents a chat message entity. Stored in-memory during MVP phase; will be migrated to Drizzle ORM later. */
export interface message {
    id: number;
    content: string;
    chat_uuid: string;
    included_in_prompt: boolean;
    created_at: string;
}

/** Creates a new Message object with auto-generated timestamp.*/
export function createMessage(
    id: number,
    content: string,
    chat_uuid: string
): message {
    return {
        id,
        content,
        chat_uuid,
        included_in_prompt: false,
        created_at: new Date().toISOString(),
    };
}