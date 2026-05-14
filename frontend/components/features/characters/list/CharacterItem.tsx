import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { PlusIcon } from "lucide-react";

export default function CharacterItem() {
    return (
        <Item
            className="flex items-center justify-between rounded-md p-2 hover:bg-neutral/5">
            <ItemContent>
                <ItemTitle>Gojo</ItemTitle>
                <ItemDescription>Descrição breve sobre o personagem</ItemDescription>
            </ItemContent>
            <ItemActions>
                <button type="button" className="p-1 rounded-xl hover:bg-tertiary cursor-pointer">
                    <PlusIcon />
                </button>
            </ItemActions>
        </Item>
    )
}