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
        <div className="custom-scrollbar flex h-full flex-col-reverse gap-1.5 overflow-y-auto overscroll-none pr-0.5 sm:gap-2 sm:pr-1">
            {sortedMessages.map((message) => (
                <ChatMessage key={message.id} message={message} />
            ))}
        </div>
    );
}
