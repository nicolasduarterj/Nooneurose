import { Character } from "@/types/character";
import Image from 'next/image'

type CharacterViewProps = {
    character: Character;
};

export default function CharacterView({ character }: CharacterViewProps) {
    return (
        <section className="flex flex-col w-full h-full gap-4 rounded-md border border-neutral/20 bg-secondary p-4 text-neutral/80 sm:p-6">
            <div className="space-y-1">
                <h2 className="text-xl font-semibold">{character.name}</h2>
                <p className="text-sm text-neutral/70">{character.description}</p>
            </div>

            <div className="w-fit h-fit rounded-md bg-tertiary/25">
                <Image
                    src={character.imageURL ?? "/question.svg"}
                    alt={character.name}
                    className="rounded-md object-cover"
                    width={200}
                    height={200}
                />
            </div>

            <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-md bg-tertiary/25 p-3 sm:col-span-2">
                    <dt className="text-neutral/60">Criado por</dt>
                    <dd className="font-medium">{character.ownerId}</dd>
                </div>

                <div className="rounded-md bg-tertiary/25 p-3">
                    <dt className="text-neutral/60">Alteracao global</dt>
                    <dd className="font-medium">{character.isGloballyChangeable ? "Sim" : "Não"}</dd>
                </div>

                <div className="rounded-md bg-tertiary/25 p-3">
                    <dt className="text-neutral/60">Alteracao privada</dt>
                    <dd className="font-medium">{character.isPrivatelyChangeable ? "Sim" : "Não"}</dd>
                </div>
            </dl>
        </section>
    );
}
