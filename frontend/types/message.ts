export type MessageType = "user" | "ai";

export type Message = {
    id: number;
    content: string;
    type: MessageType;
    timestamp: number;
}


