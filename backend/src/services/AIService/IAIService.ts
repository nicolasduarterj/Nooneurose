import { MessageAndResponse } from "@src/db/schema";

export default interface IAIService {
    sendMessage(msg: string, systemPrompt: string, history?: MessageAndResponse[]): Promise<string>
}
