import { message } from '../../models/common/message';

export default interface IMessageStorageService {
    registerMessage(content: string, chat_uuid: string): Promise<message>;
    getMessagesByChat(chat_uuid: string): Promise<message[]>;
    markMessageAsIncluded(msg_id: number): Promise<message | null>;
    getUnusedMessages(chat_uuid: string): Promise<message[]>;
}
