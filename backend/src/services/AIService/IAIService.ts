import Message from "@src/models/common/Message"

export default interface IAIService {
    sendMessage(msg: string, systemPrompt: string, history?: Message[]): Promise<string>
}
