import { ItemGroup } from "@/components/ui/item";
import CharacterItem from "./CharacterItem";
import { Character } from "@/types/character";

type CharacterListProps = {
    characters: Array<Character>;
};

export default function CharactersList({ characters }: CharacterListProps) {
    return (
        <div className="relative flex flex-col min-h-0 overflow-y-auto custom-scrollbar border border-neutral/10 rounded-lg">
            <ItemGroup className="flex flex-col gap-1 p-2">
                {characters.map((character) => {
                    return <CharacterItem key={character.id} character={character} />
                })}
            </ItemGroup>
        </div>
    )
}