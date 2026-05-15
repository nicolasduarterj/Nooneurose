export default interface Message {
    id: number
    content: string
    chatId: number
    isIncludedInPrompt: boolean
    source: 'assistant' | 'user'
    timestamp: Date
}
