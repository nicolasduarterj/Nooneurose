import { Prompt } from '@src/db/schema'
import Character from '@src/models/common/Character';
import Chat from '@src/models/common/Chat';

export default interface IPromptService {
    register(content: string, parentId: number | null, character: Character): Promise<Prompt>
    getLatestPrompt(character: Character): Promise<Prompt>;
    generatePromptFromUnusedMessages(chat: Chat): Promise<Prompt | null>;
    deleteByCharacter(character: Character): Promise<void>
}
