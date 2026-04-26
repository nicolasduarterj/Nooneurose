"use client";

import { useEffect, useOptimistic, useState } from "react";
import ChatForm from "@/components/ChatForm";
import ChatMessageList from "@/components/ChatMessageList";
import { Message } from "../types/message";
import { v4 as uuidv4 } from "uuid";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function Chat() {
    const [chatUUID, setChatUUID] = useState<string | null>(null);
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

    useEffect(() => {
        const init = async () => {
            const stored = localStorage.getItem("chatUUID");
 
            if (!stored) {
                const newUUID = uuidv4();
                localStorage.setItem("chatUUID", newUUID);
                setChatUUID(newUUID);
                return;
            }
 
            setChatUUID(stored);
 
            try {
                const res = await fetch(`${API_BASE}/api/chat/${stored}`);
 
                if (!res.ok) throw new Error(`Erro ao buscar histórico: ${res.status}`);
 
                // Conversao do formato do backEnd para o formato frontEnd
                const history: Array<{ message: string; response: string | null }> = await res.json();
 
                const mapped: Array<Message> = history.flatMap((item, index) => {
                    const base = index * 2;
                    const entries: Array<Message> = [
                        {
                            id: base,
                            content: item.message,
                            type: "user",
                            timestamp: base,
                        },
                    ];
                    if (item.response !== null) {
                        entries.push({
                            id: base + 1,
                            content: item.response,
                            type: "ai",
                            timestamp: base + 1,
                        });
                    }
                    return entries;
                });
 
                setMessages(mapped);
            } catch (error) {
                console.error("Falha ao carregar histórico:", error);
            }
        };
 
        init();
    }, []);


    
    const handleSendMessage = async (message: string) => {
        if (!chatUUID) return;
        
        const tempId = Date.now();

        const userMessage: Message = {
            id: tempId,
            content: message,
            type: "user",
            timestamp: tempId,
        };
        const aiPlaceholder: Message = {
            id: tempId + 1,
            content: "Carregando...",
            type: "ai",
            timestamp: tempId + 1,
        };

        addOptimistic([userMessage, aiPlaceholder]);

        try {
            const res = await fetch(`${API_BASE}/api/ai/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message, chatUUID }),
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
