'use client';

import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { Character } from "@/types/character";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import ChatCreateButton from "../../chat/create/ChatCreateButton";
import CharacterDeriveButton from "../derive/CharacterDeriveButton";

type CharacterItemProps = {
    character: Character
}

export default function CharacterItem({ character }: CharacterItemProps) {
    const router = useRouter();

    return (
        <Item
            className="flex items-center justify-between rounded-md p-2">
            <ItemContent>
                <ItemTitle>{character.name}</ItemTitle>
                <ItemDescription>{character.description}</ItemDescription>
            </ItemContent>
            <ItemActions>
                <CharacterDeriveButton characterId={character.id} />
                <ChatCreateButton characterId={character.id} />
                <button 
                    type="button" 
                    className="p-2 rounded-xl hover:bg-tertiary cursor-pointer"
                    onClick={() => router.push(`/characters/${character.id}`)}>
                    <ArrowRight className="size-5" />
                </button>
            </ItemActions>
        </Item>
    )
}