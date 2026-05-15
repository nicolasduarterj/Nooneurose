import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { Character } from "@/types/character";
import { PlusIcon } from "lucide-react";

type CharacterItemProps = {
    character: Character
}

export default function CharacterItem({ character }: CharacterItemProps) {
    return (
        <Item
            className="flex items-center justify-between rounded-md p-2 hover:bg-neutral/5">
            <ItemContent>
                <ItemTitle>{character.name}</ItemTitle>
                <ItemDescription>{character.description}</ItemDescription>
            </ItemContent>
            <ItemActions>
                <button type="button" className="p-1 rounded-xl hover:bg-tertiary cursor-pointer">
                    <PlusIcon />
                </button>
            </ItemActions>
        </Item>
    )
}