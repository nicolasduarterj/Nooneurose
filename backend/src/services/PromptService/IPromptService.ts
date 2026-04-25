import { Prompt } from '@src/db/schema'

export default interface IPromptService {
    registerPrompt(content: string, parent_id?: number | null): Promise<Prompt>;
    getLatestPrompt(): Promise<Prompt>;
    generatePromptFromUnusedMessages(chat_uuid: string): Promise<Prompt | null>;
}
