"use client";

import { useEffect, useState } from "react";
import CharacterFilters, { CharacterFiltersState } from "@/components/features/characters/list/CharacterFilters";
import { CharactersHeader } from "@/components/features/characters/list/CharactersHeader";
import CharactersList from "@/components/features/characters/list/CharactersList";
import { Separator } from "@/components/ui/separator";
import { Character } from "@/types/character";
import { authHeaders } from "@/lib/api";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type Creator = {
    id: number;
    name: string;
    email: string;
};

async function getCharacters(characterName: string): Promise<Array<Character>> {
    const trimmedName = characterName.trim();
    const endpoint =
        trimmedName === ""
            ? `${API_BASE}/api/character`
            : `${API_BASE}/api/character/search/${encodeURIComponent(trimmedName)}`;

    const res = await fetch(endpoint, { headers: authHeaders() });

    if (!res.ok) {
        if (res.status === 404) return [];
        throw new Error(`Erro ao buscar personagens: ${res.status}`);
    }

    const characters: Array<Character> = await res.json();
    return characters;
}

async function getCreatorsByName(name: string): Promise<Array<Creator>> {
    const trimmedName = name.trim();
    const endpoint = trimmedName === ""
        ? `${API_BASE}/api/user/search/%`
        : `${API_BASE}/api/user/search/${encodeURIComponent(trimmedName)}`;

    const res = await fetch(endpoint, { headers: authHeaders() });

    if (!res.ok) {
        if (res.status === 404) return [];
        throw new Error(`Erro ao buscar criadores: ${res.status}`);
    }

    return res.json();
}

export default function Characters() {
    const [loading, setLoading] = useState(false)
    const [characters, setCharacters] = useState<Array<Character>>([]);
    const [creators, setCreators] = useState<Array<Creator>>([]);
    const [charactersFilters, setCharactersFilters] = useState<CharacterFiltersState>({
        characterName: "",
        isGloballyChangeableSelected: false,
        isPrivatelyChangeableSelected: false,
    });
    const [tab, setTab] = useState<"criadores" | "personagens">("personagens");
    const router = useRouter();

    useEffect(() => {
        async function fetchCharacters() {
            try {
                const fetchedCharacters = await getCharacters("");
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
            if (tab === 'personagens') {
                const fetchedCharacters = await getCharacters(charactersFilters.characterName);
                const filteredCharacters = fetchedCharacters.filter((character) => {
                    if (charactersFilters.isGloballyChangeableSelected && !character.isGloballyChangeable)
                        return false;
                    if (charactersFilters.isPrivatelyChangeableSelected && !character.isPrivatelyChangeable)
                        return false;
                    return true;
                });

                setCharacters(filteredCharacters);
            } else {
                const fetchedCreators = await getCreatorsByName(charactersFilters.characterName);
                setCreators(fetchedCreators);
            }
        }
        catch (error) {
            console.error("Erro ao buscar personagens/criadores:", error);
        }
        finally {
            setLoading(false);
        }
    }

    const handleSetTab = (t: "criadores" | "personagens") => {
        setTab(t);
        if (t === "personagens") {
            setCreators([]);
        } else {
            setCharacters([]);
        }
    }

    return (
        <main className="flex h-full w-full flex-col gap-4 p-6 min-h-0 relative">
            <div className="simple-mesh-gradient" aria-hidden="true" />
            <CharactersHeader tab={tab} />
            <Separator className="bg-primary/50" />

            <CharacterFilters
                tab={tab}
                onTabChange={handleSetTab}
                value={charactersFilters}
                isLoading={loading}
                onChange={setCharactersFilters}
                onSearch={handleOnSearch}
            />

            {tab === "personagens" ? (
                <CharactersList characters={characters} />
            ) : (
                <div className="grid gap-3">
                    {creators.length === 0 ? (
                        <p className="text-neutral/60">Nenhum criador encontrado.</p>
                    ) : creators.map((c) => (
                        <div 
                            key={c.id}
                            onClick={() => router.push(`/user/creator/${c.id}`)} 
                            className="flex items-center justify-between gap-4 p-3 rounded-md bg-primary/5 cursor-pointer">
                            <div className="flex flex-col min-w-0">
                                <span className="font-medium truncate">{c.name}</span>
                                <span className="text-sm text-neutral/60 truncate">{c.email}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}