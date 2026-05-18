'use client'

import { useRouter } from "next/navigation";
import CharacterCreateDialog from "../create/CharacterCreateDialog";

export function CharactersHeader() {
    const router = useRouter();
    return (
        <div className="flex items-center justify-between px-2">
            <div>
                <h1 className="text-2xl font-bold">Personagens disponíveis</h1>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => router.push("/characters/me")}
                    type="button"
                    className="bg-primary/50 px-8 py-1 rounded-lg text-neutral/80 hover:bg-primary/70 cursor-pointer">
                    Meus personagens
                </button>
                <CharacterCreateDialog />
            </div>
        </div>
    )
}