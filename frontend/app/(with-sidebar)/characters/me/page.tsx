"use client";

import CharactersList from "@/components/features/characters/list/CharactersList";
import { Separator } from "@/components/ui/separator";
import { API_BASE, authHeaders } from "@/lib/api";
import { Character } from "@/types/character";
import { useEffect, useState } from "react";

export default function MyCharacterPage() {
    const [characters, setCharacters] = useState<Array<Character>>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCharacters = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`${API_BASE}/api/usercharacters`, {
                    method: "GET",
                    headers: authHeaders(),
                });

                if (!res.ok) {
                    throw new Error(`Erro ao buscar personagens: ${res.status}`);
                }

                const data: Array<Character> = await res.json();
                setCharacters(data);
            } catch (requestError) {
                console.error("Falha ao carregar personagens do usuário", requestError);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCharacters();
    }, []);

    return (
        <main className="flex h-full w-full flex-col gap-4 p-6 min-h-0 relative">
            <div className="simple-mesh-gradient" aria-hidden="true" />
            <div>
                <h1 className="text-2xl font-bold">Personagem</h1>
            </div>
            <Separator className="bg-primary/50" />

            {isLoading ? (
                <p className="text-neutral/60">Carregando seus personagens...</p>
            ) : characters.length === 0 ? (
                <h3 className="text-neutral/60">Você ainda não tem personagens criados.</h3>
            ) : (
                <CharactersList characters={characters} />
            )}
        </main>
    );
}