'use client';

import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { Character } from "@/types/character";
import { MessageSquareText } from "lucide-react";
import { useRouter } from "next/navigation";

type CharacterItemProps = {
    character: Character
}

export default function CharacterItem({ character }: CharacterItemProps) {
    const router = useRouter();

    return (
        <Item
            className="flex items-center justify-between rounded-md p-2 hover:bg-neutral/5">
            <ItemContent onClick={() => router.push(`/characters/${character.id}`)}>
                <ItemTitle>{character.name}</ItemTitle>
                <ItemDescription>{character.description}</ItemDescription>
            </ItemContent>
            <ItemActions>
                <button type="button" className="p-2 rounded-xl hover:bg-tertiary cursor-pointer">
                    <MessageSquareText className="size-6" />
                </button>
            </ItemActions>
        </Item>
    )
}