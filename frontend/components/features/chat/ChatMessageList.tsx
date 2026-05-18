"use client";

import { useMemo } from "react";
import { Message } from "@/types/message";
import ChatMessage from "@/components/features/chat/ChatMessage";

type ChatMessageListProps = {
    messages: Array<Message>;
};

export default function ChatMessageList({ messages }: ChatMessageListProps) {
    const sortedMessages = useMemo(() => {
        return messages.slice().sort((a, b) => {
            const tempA = new Date(a.timestamp).getTime();
            const tempB = new Date(b.timestamp).getTime();
            const diff = tempB - tempA;

            if (diff !== 0) {
                return diff;
            }

            if (a.source === "assistant" && b.source === "user")
                return -1

            if (a.source === "user" && b.source === "assistant")
                return 1

            return 0
        });
    }, [messages]);

    return (
        <div className="custom-scrollbar flex h-full flex-col-reverse gap-1.5 overflow-y-auto overscroll-none pr-0.5 sm:gap-2 sm:pr-1">
            {sortedMessages.map((message) => (
                <ChatMessage key={message.id} message={message} />
            ))}
        </div>
    );
}
