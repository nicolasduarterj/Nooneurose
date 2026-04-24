import { Prompt } from '../../models/common/prompt';

export default interface IPromptService {
    registerPrompt(content: string, parent_id?: number | null): Promise<Prompt>;
    getLatestPrompt(): Promise<Prompt | null>;
    generatePromptFromUnusedMessages(chat_uuid: string): Promise<Prompt | null>;
}
