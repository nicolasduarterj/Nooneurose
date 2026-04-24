export default interface IMessageService {
    registerMessage(content: string, chat_uuid: string): import('../../models/common/message').message;
    getMessagesByChat(chat_uuid: string): import('../../models/common/message').message[];
    markMessageAsIncluded(msg_id: number): import('../../models/common/message').message | null;
    getUnusedMessages(chat_uuid: string): import('../../models/common/message').message[];
}