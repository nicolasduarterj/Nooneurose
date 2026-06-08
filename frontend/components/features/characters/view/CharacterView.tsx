'use client';

import { Character } from "@/types/character";
import Image from 'next/image'
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import CharacterDeleteDialog from "../delete/CharacterDeleteDialog";
import CharacterDeriveButton from "../derive/CharacterDeriveButton";
import { isImageUrl } from "@/lib/utils";
import { useEffect, useState } from "react";
import { API_BASE, authHeaders } from "@/lib/api";
import { User } from "@/types/user";

type CharacterViewProps = {
    character: Character;
};

export default function CharacterView({ character }: CharacterViewProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [ownerName, setOwnerName] = useState<string>("Usuário");
    const [srcDaImagem, setSrcDaImagem] = useState("/question.svg");
    const isOwner = user?.id === character.ownerId;

    const redirectToCreator = () => {
        if (character.ownerId === user?.id) {
            router.push("/user/me");
            return;
        }

        router.push(`/user/creator/${character.ownerId}`);
    }
    
    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/user/byId/${character.ownerId}`, {
                method: "GET",
                headers: authHeaders(),
                });

                if (!res.ok) {
                throw new Error(`Erro ao buscar usuário: ${res.status}`);
                }

                const data: User = await res.json();
                setOwnerName(data.name);
            } catch (error) {
                console.error(error);
            }
        };

        const validateImageUrl = async () => {
            if (character.imageURL) {
                const isValid = await isImageUrl(character.imageURL);
                
                if (isValid) {
                    setSrcDaImagem(character.imageURL);
                }
            }
        };

    loadUser();
    validateImageUrl();
    }, [character, router]);

    return (
        <section className="flex flex-col w-full h-full gap-4 rounded-md border border-neutral/20 bg-secondary p-4 text-neutral/80 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold">{character.name}</h2>
                    <p className="text-sm text-neutral/70">{character.description}</p>
                </div>

                <div className="flex flex-row flex-wrap gap-4">
                    <CharacterDeriveButton characterId={character.id} buttonType="text" buttonText="Derivar" />
                    {isOwner && (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="flex items-center gap-2 px-2 py-2 rounded-lg bg-neutral/10 text-neutral/80 hover:bg-neutral/15 cursor-pointer"
                                onClick={() => router.push(`/characters/${character.id}/edit`)}
                            >
                                <Pencil size={12}/>
                                Editar
                            </button>
                            <CharacterDeleteDialog
                            characterId={character.id}
                            onDelete={() => router.push("/characters")}
                        />
                        </div>
                    )}
                </div>
            </div>

            <div className="w-fit h-fit rounded-md bg-tertiary/25">
                <Image
                    src={srcDaImagem}
                    alt={character.name}
                    className="rounded-md object-cover"
                    width={200}
                    height={200}
                    priority
                    onError={(e) => {
                    (e.target as HTMLImageElement).src = "/question.svg";
                }}
                />
            </div>

            <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-md bg-tertiary/25 p-3 sm:col-span-2">
                    <dt className="text-neutral/60">Criado por</dt>
                    <dd 
                        className="w-fit font-medium cursor-pointer"
                        onClick={redirectToCreator}>
                            {`${ownerName} #${character.ownerId}`}
                    </dd>
                </div>

                <div className="rounded-md bg-tertiary/25 p-3">
                    <dt className="text-neutral/60">Moldável pelos usuários</dt>
                    <dd className="font-medium">{character.isGloballyChangeable ? "Sim" : "Não"}</dd>
                </div>

                <div className="rounded-md bg-tertiary/25 p-3">
                    <dt className="text-neutral/60">Moldável pelo criador</dt>
                    <dd className="font-medium">{character.isPrivatelyChangeable ? "Sim" : "Não"}</dd>
                </div>
            </dl>
        </section>
    );
}
