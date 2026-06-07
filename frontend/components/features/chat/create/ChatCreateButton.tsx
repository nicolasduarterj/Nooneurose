'use client'

import { API_BASE, authHeaders } from "@/lib/api";
import { Chat } from "@/types/chat";
import { MessageSquareText } from "lucide-react"
import { useRouter } from "next/navigation";

type ChatCreateButtonProps = {
    characterId: number;
    buttonType?: "icon" | "text";
    buttonText?: string;
}

export default function ChatCreateButton({ characterId, buttonType = "icon", buttonText }: ChatCreateButtonProps) {
    const router = useRouter();
    
    const handleCreateChat = async () => {
        try {
            const requestBody = {
                characterId: characterId
            };

            const res = await fetch(`${API_BASE}/api/user/chats`, {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify(requestBody)
            });

            if (!res.ok)
                throw new Error(`Erro ao criar chat: ${res.status}`);

            const chat: Chat = await res.json();

            router.push(`/chat/${chat.id}`);
        }
        catch (error) {
            console.error("Erro ao criar chat:", error);
        }
    }

    return (
        <button 
            type="button" 
            className={`p-2 rounded-xl hover:bg-tertiary cursor-pointer ${buttonType === "text" ? "flex items-center gap-2 text-sm border border-primary/50 rounded-md" : ""}`}
            onClick={handleCreateChat}>
            {buttonType === "icon" ? (
                <MessageSquareText className="size-5" />
            ) : (
                <span>{buttonText}</span>
            )}
        </button>
    )
}