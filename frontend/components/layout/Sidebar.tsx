"use client";

import { CircleUser, House, UserSearch } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { API_BASE, authHeaders } from "@/lib/api";
import { Chat } from "@/types/chat";
import { Character } from "@/types/character";
import { useAuth } from "@/contexts/AuthContext";

export default function Sidebar() {
  const [chats, setChats] = useState<Array<Chat>>([]);
  const [characterNames, setCharacterNames] = useState<Record<number, string>>({});
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;

    const init = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/user/chats`, {
          method: "GET",
          headers: authHeaders(),
        });

        if (!res.ok)
          throw new Error(`Erro ao buscar chats: ${res.status}`);

        const chatsData: Array<Chat> = await res.json();

        setChats(chatsData);
      } catch (error) {
        console.error("Falha ao carregar chats", error);
      }
    };

    init();
  }, [pathname, isAuthenticated]);

  useEffect(() => {
    const loadCharacterNames = async () => {
      const idsToLoad = Array.from(new Set(chats.map((chat) => chat.characterId)));

      if (idsToLoad.length === 0) return;

      try {
        const entries = await Promise.all(
          idsToLoad.map(async (id) => {
            const res = await fetch(`${API_BASE}/api/character/byId/${id}`);
            if (!res.ok) return [id, `Personagem ${id}`] as const;
            const character: Character = await res.json();
            return [id, character.name] as const;
          })
        );

        setCharacterNames(Object.fromEntries(entries));
      } catch (error) {
        console.error("Falha ao carregar nomes dos personagens", error);
      }
    };

    loadCharacterNames();
  }, [chats, pathname]);

  useEffect(() => {
    const loadUser = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`${API_BASE}/api/user/byId/${user.id}`, {
          headers: authHeaders(),
        });
        if (!res.ok) return;
        const data = await res.json();
        setUserEmail(data.email);
        setUserName(data.name);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário", error);
      }
    };
    loadUser();
  }, [user?.id, pathname]);

  const displayName = user?.name ?? userName ?? "Carregando...";

  return (
    <aside className="flex flex-col justify-between min-h-screen h-full w-full gap-6 p-6 md:p-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-evenly items-center px-4">
          <div>
            <h1
              className="text-3xl font-bold tracking-tight leading-none"
              style={{ fontFamily: "'Anta', sans-serif" }}
            >
              <span style={{ color: '#FF007A' }}>NOO</span>
              <span className="text-white">NEUROSE</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="px-4 py-2.5 border-t border-primary/30">
        <ul className="flex flex-col gap-2 text-sm text-neutral/40">
          <li className="flex flex-row items-center gap-2 cursor-pointer hover:bg-primary/10 rounded-md p-2">
            <div>
              <House />
            </div>
            <div>
              <p>HOME</p>
            </div>
          </li>
          <li
            className="flex flex-row items-center gap-2 cursor-pointer hover:bg-primary/10 rounded-md p-2"
            onClick={() => router.push("/characters")}
          >
            <div>
              <UserSearch />
            </div>
            <div>
              <p>PERSONAGENS</p>
            </div>
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-2.5 px-4 py-2.5 border-t border-primary/30 text-xs">
        {chats.length > 0 && (
          <h3 className="text-neutral/80">CHATS RECENTES</h3>
        )}
        <ul className="flex flex-col gap-2 text-sm text-neutral/40">
          {chats.slice(-3).reverse().map((chat) => (
            <li key={chat.id} onClick={() => router.push(`/chat/${chat.id}`)} className="bg-tertiary/25 cursor-pointer hover:bg-primary/10 rounded-md px-2 py-1">
              <p>{`Chat ${chat.id} | ${characterNames[chat.characterId] ?? `Personagem ${chat.characterId}`}`}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-row px-4 py-2.5 gap-4 border-t items-center border-primary/30 text-neutral/30 mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex flex-row items-center gap-2 transition-colors cursor-pointer hover:bg-primary/10 rounded-md px-2 py-1.5 w-full">
              <CircleUser className="h-8 w-8 shrink-0" />
              <div className="flex flex-col text-sm text-left min-w-0">
                <p className="text-neutral/70 truncate">{displayName}</p>
                <p className="text-neutral/50 truncate">{userEmail ?? ""}</p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="rounded-xl border border-primary/20 bg-slate-950/95 shadow-lg backdrop-blur-xl z-50"
            align="start"
            sideOffset={8}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs uppercase tracking-[0.16em] text-primary/50">
                Minha Conta
              </DropdownMenuLabel>
              <DropdownMenuItem className="text-sm text-neutral/80 focus:bg-primary/10 focus:text-neutral/80" onClick={() => router.push("/user/me")}>
                Ver minha conta
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm text-neutral/80 focus:bg-primary/10 focus:text-neutral/80" onClick={() => router.push("/user/me/edit")}>
                Editar minha conta
              </DropdownMenuItem>
            </DropdownMenuGroup>
              <DropdownMenuSeparator className="border-primary/20" />
              <DropdownMenuItem className="text-sm text-neutral/80 focus:bg-primary/10 focus:text-neutral/80" onClick={async () => {await logout();router.push('/');}}>
                Logout
              </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}