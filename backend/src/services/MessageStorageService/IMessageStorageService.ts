import { Message, Response } from "@src/db/schema";

export default interface IMessageStorageService {
    registerMessage(content: string, chat_uuid: string): Promise<Message>;
    getMessagesByChat(chat_uuid: string): Promise<Message[]>;
    markMessageAsIncluded(msg_id: number): Promise<Message | null>;
    getUnusedMessages(chat_uuid: string): Promise<Message[]>;
    registerResponse(content: string, msg_id: number): Promise<Response>
}
