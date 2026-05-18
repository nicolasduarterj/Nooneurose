"use client";

import { CircleUser, House, ListIndentDecrease, UserSearch } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE, authHeaders } from "@/lib/api";
import { Chat } from "@/types/chat";

export default function Sidebar() {
    const [chats, setChats] = useState<Array<Chat>>([]);
    const router = useRouter();

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
        }
        catch (error) {
            console.error("Falha ao criar novo chat", error);
        }
    }
    return (
        <aside className="flex flex-col h-full w-full gap-6 p-6 md:p-8">
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
                        onClick={createChat}>
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
                    <li className="flex flex-row items-center gap-2 cursor-pointer hover:bg-primary/10 rounded-md p-2">
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
                <div>
                    <CircleUser className="size-8" />
                </div>
                <div className="flex flex-col text-sm">
                    <p className="text-neutral/70">ENNIS</p>
                    <p className="text-neutral/50">ENIS@TESTE.COM</p>
                </div>
            </div>
        </aside>
    )
}