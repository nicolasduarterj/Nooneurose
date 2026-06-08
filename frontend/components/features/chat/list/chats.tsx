"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { API_BASE, authHeaders } from "@/lib/api";

interface Chat {
  id: number;
  characterId: number;
  updatedAt?: string;
}

type ChatsListProps = {
  characterId?: number | string;
};

export default function ChatsList({ characterId }: ChatsListProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [characterNames, setCharacterNames] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}/api/user/chats`, {
          method: "GET",
          headers: authHeaders(),
        });

        if (!res.ok) {
          throw new Error(`Erro ao buscar chats: ${res.status}`);
        }

        const data: Chat[] = await res.json();
        const parsedCharacterId = characterId != null ? Number(characterId) : undefined;
        const filtered = parsedCharacterId && !Number.isNaN(parsedCharacterId)
          ? data.filter((chat) => chat.characterId === parsedCharacterId)
          : data;
        const ordered = filtered.slice().sort((a, b) => {
          if (a.updatedAt && b.updatedAt) {
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          }
          if (a.updatedAt) return -1;
          if (b.updatedAt) return 1;
          return b.id - a.id;
        });
        setChats(ordered);

        const uniqueCharacterIds = Array.from(new Set(ordered.map((chat) => chat.characterId)));
        const names: Record<number, string> = {};

        await Promise.all(
          uniqueCharacterIds.map(async (characterId) => {
            try {
              const charRes = await fetch(`${API_BASE}/api/character/byId/${characterId}`);
              if (!charRes.ok) {
                return;
              }
              const character = await charRes.json();
              names[characterId] = character.name ?? `Personagem ${characterId}`;
            } catch {
              names[characterId] = `Personagem ${characterId}`;
            }
          })
        );

        setCharacterNames(names);
      } catch (fetchError) {
        console.error("Falha ao carregar chats", fetchError);
        setError("Não foi possível carregar a lista de chats.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [characterId]);

  return (
    <main className="flex h-full w-full flex-col gap-4 p-6 min-h-0 overflow-hidden relative">
      <div aria-hidden="true" />
      <div>
        <h1 className="text-2xl font-bold">Chats</h1>
      </div>
      <Separator className="bg-primary/50" />

      {isLoading ? (
        <p className="text-neutral/60">Carregando chats...</p>
      ) : error ? (
        <div className="rounded-md bg-destructive/25 p-4 text-destructive">
          {error}
        </div>
      ) : chats.length === 0 ? (
        <h3 className="text-neutral/60">Nenhum chat encontrado.</h3>
      ) : (
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="grid gap-3 overflow-y-auto pr-2 max-h-full">
            {chats.map((chat) => (
              <Link
                key={chat.id}
                href={`/chat/${chat.id}`}
                className="rounded-2xl border border-neutral/20 bg-muted/10 p-4 transition hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-neutral/60">
                      Chat {chat.id} | {characterNames[chat.characterId] ?? `Personagem ${chat.characterId}`}
                    </p>
                  </div>
                  {chat.updatedAt ? (
                    <span className="text-xs text-neutral/50">
                      {new Date(chat.updatedAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
