"use client";

import { useEffect, useState } from "react";
import CharacterFilters, { CharacterFiltersState } from "@/components/features/characters/list/CharacterFilters";
import { CharactersHeader } from "@/components/features/characters/list/CharactersHeader";
import CharactersList from "@/components/features/characters/list/CharactersList";
import { Separator } from "@/components/ui/separator";
import { Character } from "@/types/character";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

async function getCharacters(characterName: string): Promise<Array<Character>> {
    // Solução temporaria por rota nao aceitar parametros vazios
    if (characterName === "")
        characterName = "%";
    const encodedCharacterName = encodeURIComponent(characterName);
    const res = await fetch(`${API_BASE}/api/character/search/${encodedCharacterName}`);

    if (!res.ok)
        throw new Error(`Erro ao buscar personagens: ${res.status}`);

    const characters: Array<Character> = await res.json();
    return characters;
}

export default function Characters() {
    const [loading, setLoading] = useState(false)
    const [characters, setCharacters] = useState<Array<Character>>([]);
    const [charactersFilters, setCharactersFilters] = useState<CharacterFiltersState>({
        characterName: "",
        isGloballyChangeableSelected: false,
        isPrivatelyChangeableSelected: false,
    });

    useEffect(() => {
        async function fetchCharacters() {
            try {
                const fetchedCharacters = await getCharacters(charactersFilters.characterName);
                setCharacters(fetchedCharacters);
            }
            catch (error) {
                console.error("Erro ao buscar personagens:", error);
            }
        }

        fetchCharacters();
    }, []);

    const handleOnSearch = async () => {
        setLoading(true);

        try {
            const fetchedCharacters = await getCharacters(charactersFilters.characterName);

            const filteredCharacters = fetchedCharacters.filter((character) => {
                if (charactersFilters.isGloballyChangeableSelected && !character.isGloballyChangeable)
                    return false;
                if (charactersFilters.isPrivatelyChangeableSelected && !character.isPrivatelyChangeable)
                    return false;
                return true;
            });

            setCharacters(filteredCharacters);
        }
        catch (error) {
            console.error("Erro ao buscar personagens:", error);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex h-full w-full flex-col gap-4 p-6 min-h-0 relative">
            <div className="simple-mesh-gradient" aria-hidden="true" />
            <CharactersHeader />
            <Separator className="bg-primary/50" />
            <CharacterFilters
                value={charactersFilters}
                isLoading={loading}
                onChange={setCharactersFilters}
                onSearch={handleOnSearch}
            />
            <CharactersList characters={characters} />
        </main>
    )
}