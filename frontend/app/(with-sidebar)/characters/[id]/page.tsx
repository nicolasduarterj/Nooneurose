'use client';

import { Separator } from "@/components/ui/separator";
import CharacterView from "@/components/features/characters/view/CharacterView";
import { Character } from "@/types/character";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type CharacterPageParams = {
    id: number
};

type CharacterPageProps = {
    params: Promise<CharacterPageParams>;
}

export default function CharacterPage({ params }: CharacterPageProps) {
    const [character, setCharacter] = useState<Character>();
    const router = useRouter();
    const { id } = use<CharacterPageParams>(params);

    useEffect(() => {
        const fetchCharacter = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/character/byId/${id}`);
                if (!res.ok)
                    router.push("/characters");

                const characterData: Character = await res.json();
                setCharacter(characterData);
            }
            catch (error) {
                console.error("Erro ao buscar personagem:", error);
                router.push("/characters");
            }
        }

        fetchCharacter();
    }, [id]);

    return (
        <main className="flex h-full w-full flex-col gap-4 p-6 min-h-0 relative">
            <div className="simple-mesh-gradient" aria-hidden="true" />
            <div>
                <h1 className="text-2xl font-bold">Personagem</h1>
            </div>
            <Separator className="bg-primary/50" />

            <div className="w-full h-fit">
                {character && <CharacterView character={character} />}
            </div>
        </main>
    );
}