import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { Character } from "@/types/character";
import { MessageSquareText } from "lucide-react";

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
                <button type="button" className="p-2 rounded-xl hover:bg-tertiary cursor-pointer">
                    <MessageSquareText className="size-6" />
                </button>
            </ItemActions>
        </Item>
    )
}