import { prompt } from '../../models/common/prompt';

export default interface IPromptService {
    registerPrompt(content: string, parent_id?: number | null): Promise<prompt>;
    getLatestPrompt(): Promise<prompt | null>;
    generatePromptFromUnusedMessages(chat_uuid: string): Promise<prompt | null>;
}
