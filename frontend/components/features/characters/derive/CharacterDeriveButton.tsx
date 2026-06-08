'use client';

import { API_BASE, authHeaders } from "@/lib/api";
import { Character } from "@/types/character";
import { GitBranch } from "lucide-react";
import { useRouter } from "next/navigation";

type CharacterDeriveButtonProps = {
    characterId: number;
    buttonType?: "icon" | "text";
    buttonText?: string;
};

export default function CharacterDeriveButton({ characterId, buttonType = "icon", buttonText = "Derivar" }: CharacterDeriveButtonProps) {
    const router = useRouter();
    
    const handleDerive = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/character/byId/${characterId}/derive`, {
                method: "POST",
                headers: authHeaders(),
            });

            if (!res.ok)
                throw new Error(`Erro ao derivar personagem: ${res.status}`);

            const derivedCharacter: Character = await res.json();

            router.push(`/characters/${derivedCharacter.id}`);
        }
        catch (error) {
            console.error("Erro ao derivar personagem:", error);
        }
    }

    return (
        <button
            type="button"
            onClick={handleDerive}
            className={`p-2 rounded-xl hover:bg-tertiary cursor-pointer ${buttonType === "text" ? "flex items-center gap-2 text-sm border border-primary/50 rounded-sm" : ""}`}
        >
            <GitBranch className="size-5" />
            {buttonType === "text" && <span>{buttonText}</span>}
        </button>
    );
}