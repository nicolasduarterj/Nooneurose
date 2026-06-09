"use client";

import { use, useEffect, useOptimistic, useState } from "react";
import ChatForm from "@/components/features/chat/ChatForm";
import ChatMessageList from "@/components/features/chat/ChatMessageList";
import { Message } from "@/types/message";
import { API_BASE, authHeaders, lastChatIdKey } from "@/lib/api";
import { useRouter } from "next/navigation";

type ChatParams = {
    id: string;
}

type PageProps = {
    params: Promise<ChatParams>;
}

export default function Chat({ params }: PageProps) {
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

    const { id } = use<ChatParams>(params);
    const numberId = Number(id);
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            localStorage.setItem(lastChatIdKey, id);

            try {
                const res = await fetch(`${API_BASE}/api/user/chats/${id}/messages`,
                    {
                        method: "GET",
                        headers: authHeaders(),
                    }
                );

                if (!res.ok){
                    if (res.status === 404){
                        router.push("/chat");
                        return;
                    }

                    throw new Error(`Erro ao buscar histórico: ${res.status}`);
                }

                const history: Array<Message> = await res.json();
                setMessages(history);
            } catch (error) {
                console.error("Falha ao carregar histórico:", error);
            }
        };

        init();
    }, []);

    const handleSendMessage = async (message: string) => {
        const tempId = Date.now();

        const userMessage: Message = {
            id: tempId,
            content: message,
            chatId: numberId,
            isIncludedInPrompt: false,
            source: "user",
            timestamp: tempId,
        };
        const aiPlaceholder: Message = {
            id: tempId + 1,
            content: "Carregando...",
            chatId: numberId,
            isIncludedInPrompt: false,
            source: "assistant",
            timestamp: tempId + 1,
        };

        addOptimistic([userMessage, aiPlaceholder]);

        try {
            const res = await fetch(`${API_BASE}/api/ai/send`, {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify({ message, chatId: numberId }),
            });

            if (!res.ok) throw new Error(`Erro na resposta da IA: ${res.status}`);

            const data: { response: string } = await res.json();

            setMessages((prev) => [
                ...prev,
                userMessage,
                { ...aiPlaceholder, content: data.response },
            ]);

        } catch (error) {
            console.error("Falha ao enviar mensagem:", error);
            setMessages((prev) => [...prev, userMessage]);
        }
    };

    return (
        <main className="relative overflow-hidden custom-scrollbar">
            <div className="chat-mesh-gradient" aria-hidden="true" />
            <div className="relative z-10 mx-auto h-screen w-full px-2 pt-1 pb-15 md:w-[70vw] md:max-w-5xl md:px-1.5 md:pt-0.5 md:pb-7.5 flex flex-col overflow-hidden">
                <div className="min-h-0 flex-1">
                    <ChatMessageList messages={optimisticMessages} />
                </div>
                <div className="shrink-0 pt-1.5 pb-2.5 md:pt-2 md:pb-3">
                    <ChatForm onSubmitMessage={handleSendMessage} />
                </div>
            </div>
        </main>
    )
}
