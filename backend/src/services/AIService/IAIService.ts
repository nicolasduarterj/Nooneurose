
export default interface IAIService {
    sendMessage(msg: string, systemPrompt: string): Promise<string>
}
