
export default interface IAIService {
    sendMessage(msg: string, chatID: string): Promise<string>
    sendMergeMessage(msg: string): Promise<string>
}
