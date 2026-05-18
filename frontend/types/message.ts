export type MessageType = "assistant" | "user";

export type Message = {
    id: number;
    chatId: number;
    content: string;
    source: MessageType;
    isIncludedInPrompt: boolean;
    timestamp: number;
}

export type MessageRequest = {
    message: string;
    chatId: number;
}


