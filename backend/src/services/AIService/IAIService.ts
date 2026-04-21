
export default interface IAIService {
    sendMessage(msg: string, chatID: string): Promise<string>
}
