import Chat from "@src/models/common/Chat";
import Message from "@src/models/common/Message";

export default interface IMessageStorageService {
    registerMessage(content: string, chat: Chat): Promise<Message>;
    getMessagesByChat(chat: Chat): Promise<Message[]>;
    markMessageAsIncluded(msgId: number): Promise<Message | null>;
    getUnusedMessages(chat: Chat): Promise<Message[]>;
    registerResponse(content: string, msgId: number): Promise<Message>
    getMessagesAndResponsesByChat(chat: Chat): Promise<Message[]>
}
