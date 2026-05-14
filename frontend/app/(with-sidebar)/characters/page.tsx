import CharacterFilters from "@/components/features/characters/list/CharacterFilters";
import { CharactersHeader } from "@/components/features/characters/list/CharactersHeader";
import CharactersList from "@/components/features/characters/list/CharactersList";
import { Separator } from "@/components/ui/separator";

export default function Characters() {
    return (
        <main className="flex h-full w-full flex-col gap-4 p-6 min-h-0">
            <CharactersHeader />
            <Separator className="bg-primary/50" />
            <CharacterFilters />
            <CharactersList />
        </main>
    )
}