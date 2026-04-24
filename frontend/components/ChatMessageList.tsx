"use client";

import { useMemo } from "react";
import { Message } from "@/app/types/message";
import ChatMessage from "@/components/ChatMessage";

type ChatMessageListProps = {
    messages: Array<Message>;
};

export default function ChatMessageList({ messages }: ChatMessageListProps) {
    const sortedMessages = useMemo(() => {
        return messages.slice().reverse();
    }, [messages]);

    return (
        <div className="flex h-full flex-col-reverse gap-2 overflow-y-auto overscroll-none pr-1">
            {sortedMessages.map((message) => (
                <ChatMessage key={message.id} message={message} />
            ))}
        </div>
    );
}
