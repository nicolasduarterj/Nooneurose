"use client";

import { CircleUser, House, ListIndentDecrease, UserSearch } from "lucide-react";
import { Button } from "../ui/button";
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
import { useRouter } from "next/navigation";
import { API_BASE, authHeaders } from "@/lib/api";
import { Chat } from "@/types/chat";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/types/user";

export default function Sidebar() {
  const [chats, setChats] = useState<Array<Chat>>([]);
  const { user, logout } = useAuth();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
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
  }, []);

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
  }, [user?.id]);

  const createChat = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/user/chats`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ characterId: 1 }),
      });

      if (!res.ok)
        throw new Error(`Erro ao criar chat: ${res.status}`);

      const newChat: Chat = await res.json();
      setChats((prevChats) => [...prevChats, newChat]);
      router.push(`/chat/${newChat.id}`);
    } catch (error) {
      console.error("Falha ao criar novo chat", error);
    }
  };

  return (
    <aside className="flex flex-col justify-between min-h-screen h-full w-full gap-6 p-6 md:p-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-evenly items-center px-4">
          <div>
            <h1 className="text-2xl font-bold">Nooneurose</h1>
          </div>
          <div>
            <ListIndentDecrease className="h-5 w-5 hover:cursor-pointer" />
          </div>
        </div>
        <div className="px-4">
          <Button
            className="w-full bg-primary/50 hover:bg-primary/60"
            onClick={createChat}
          >
            Novo chat
          </Button>
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
              <p>{`Chat ${chat.id}`}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-row px-4 py-2.5 gap-4 border-t items-center border-primary/30 text-neutral/30 mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="flex flex-row items-center gap-2 transition-colors cursor-pointer hover:bg-primary/10 rounded-md px-2 py-1.5 w-full">
              <CircleUser className="h-8 w-8 flex-shrink-0" />
              <div className="flex flex-col text-sm text-left min-w-0">
                <p className="text-neutral/70 truncate">{userName ?? user?.name ?? "Carregando..."}</p>
                <p className="text-neutral/50 truncate">{userEmail ?? ""}</p>
              </div>
            </button>
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
              <DropdownMenuItem className="text-sm text-neutral/80 hover:bg-primary/10" onClick={() => router.push("/user/me")}>
                Ver minha conta
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm text-neutral/80 hover:bg-primary/10" onClick={() => router.push("/user/me/edit")}>
                Editar minha conta
              </DropdownMenuItem>
            </DropdownMenuGroup>
              <DropdownMenuSeparator className="border-primary/20" />
              <DropdownMenuItem className="text-sm text-neutral/80 hover:bg-primary/10" onClick={async () => {await logout();router.push('/');}}>
                Logout
              </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}