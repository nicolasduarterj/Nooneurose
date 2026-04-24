"use client";

import { useOptimistic, useState } from "react";
import ChatForm from "@/components/ChatForm";
import ChatMessageList from "@/components/ChatMessageList";
import { Message } from "../types/message";

export default function Chat() {
    const [messages, setMessages] = useState<Array<Message>>([]);
    const [optimisticMessages, addOptimistic] = useOptimistic(
        messages,
        (state, newItems: Message[]) => {
            const filteredNewItems = newItems.filter(
                (newItem) => !state.some((realItem) => realItem.id === newItem.id)
            );
            return [...state, ...filteredNewItems]
        }
    );

    const handleSendMessage = async (message: string) => {
        const tempId = Date.now();

        const userMessage: Message = {
            id: tempId,
            content: message,
            type: "user",
            timestamp: Date.now()
        };
        const aiPlaceholder: Message = {
            id: tempId + 1,
            content: "Carregando...",
            type: "ai",
            timestamp: Date.now()
        };

        addOptimistic([userMessage, aiPlaceholder]);

        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const newResponse = "Conteúdo vindo da IA";

            setMessages((prev) => [
                ...prev,
                userMessage,
                { ...aiPlaceholder, content: newResponse }
            ]);

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main className="mx-auto h-screen w-[70vw] max-w-5xl bg-tertiary pt-1.5 px-1.5 pb-7.5 flex flex-col overflow-hidden">
            <div className="min-h-0 flex-1">
                <ChatMessageList messages={optimisticMessages} />
            </div>
            <div className="pt-7.5 shrink-0">
                <ChatForm onSubmitMessage={handleSendMessage} />
            </div>
        </main>
    )
}