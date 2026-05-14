import { ItemGroup } from "@/components/ui/item";
import CharacterItem from "./CharacterItem";

export default function CharactersList() {
    return (
        <div className="relative flex flex-col min-h-0 overflow-y-auto custom-scrollbar border border-neutral/10 rounded-lg">
            <ItemGroup className="flex flex-col gap-1 p-2">
                {Array.from({ length: 5 }).map((_, index) => (
                    <CharacterItem key={index} />
                ))}
            </ItemGroup>
        </div>
    )
}