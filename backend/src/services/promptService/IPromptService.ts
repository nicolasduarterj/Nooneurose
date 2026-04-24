export default interface IPromptService {
    registerPrompt(content: string, parent_id?: number | null): import('../../models/common/prompt').prompt;
    getLatestPrompt(): import('../../models/common/prompt').prompt | null;
    generatePromptFromUnusedMessages(chat_uuid: string): import('../../models/common/prompt').prompt | null;
}