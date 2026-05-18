import { Separator } from "@/components/ui/separator";
import CharacterView from "@/components/features/characters/view/CharacterView";
import { Character } from "@/types/character";
import { redirect } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

type CharacterPageParams = {
    id: number
};

type CharacterPageProps = {
    params: Promise<CharacterPageParams>;
}

export default async function CharacterPage({ params }: CharacterPageProps) {
    const { id } = await params;
    const res = await fetch(`${API_BASE}/api/character/byId/${id}`);

    if (!res.ok)
        redirect("/characters");

    const character: Character = await res.json();

    return (
        <main className="flex h-full w-full flex-col gap-4 p-6 min-h-0 relative">
            <div className="simple-mesh-gradient" aria-hidden="true" />
            <div>
                <h1 className="text-2xl font-bold">Personagem</h1>
            </div>
            <Separator className="bg-primary/50" />

            <div className="w-full h-fit">
                <CharacterView character={character} />
            </div>
        </main>
    );
}