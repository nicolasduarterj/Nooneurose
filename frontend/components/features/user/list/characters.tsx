"use client";

import CharactersList from "@/components/features/characters/list/CharactersList";
import { Separator } from "@/components/ui/separator";
import { API_BASE, authHeaders } from "@/lib/api";
import { Character } from "@/types/character";
import { useEffect, useState } from "react";

interface MeListProps {
  userId?: number; 
}

export default function MeList({ userId }: MeListProps) {
  const [characters, setCharacters] = useState<Array<Character>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const endpoint = userId
          ? `${API_BASE}/api/user/${userId}/characters`
          : `${API_BASE}/api/user/characters`;

        const res = await fetch(endpoint, {
          method: "GET",
          headers: authHeaders(),
        });

        if (!res.ok) {
          throw new Error(`Erro ao buscar personagens: ${res.status}`);
        }

        const data: Array<Character> = await res.json();
        setCharacters(data);
      } catch (requestError) {
        console.error("Falha ao carregar personagens", requestError);
        setError("Não foi possível carregar os personagens deste usuário.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, [userId]);

  return (
    <main className="flex h-full w-full flex-col gap-4 p-6 min-h-0 relative">
      <div className="" aria-hidden="true" />
      <div>
        <h1 className="text-2xl font-bold">Personagens</h1>
      </div>
      <Separator className="bg-primary/50" />

      {isLoading ? (
        <p className="text-neutral/60">Carregando seus personagens...</p>
      ) : error ? (
        <div className="rounded-md bg-destructive/25 p-4 text-destructive">
          {error}
        </div>
      ) : characters.length === 0 ? (
        <h3 className="text-neutral/60">Você ainda não tem personagens criados.</h3>
      ) : (
        <CharactersList characters={characters} />
      )}
    </main>
  );
}