import CharacterFilters from "@/components/features/characters/list/CharacterFilters";
import { CharactersHeader } from "@/components/features/characters/list/CharactersHeader";
import CharactersList from "@/components/features/characters/list/CharactersList";
import { Separator } from "@/components/ui/separator";
import { Character } from "@/types/character";

const characters: Array<Character> = [
    {
        id: 1,
        name: "Gojo Satoru",
        description: "Feiticeiro de grau especial e professor na Escola Técnica Superior de Jujutsu.",
    },
    {
        id: 2,
        name: "Engenheiro de Software Sênior",
        description: "Profissional pragmático focado em arquitetura, escalabilidade e na resolução de problemas complexos.",
    },
    {
        id: 3,
        name: "Bob Esponja",
        description: "Otimista inabalável, morador da Fenda do Biquíni e o chapeiro mais dedicado do Siri Cascudo.",
    },
    {
        id: 4,
        name: "Ennis Del Mar",
        description: "Vaqueiro de poucas palavras, marcado pelo estoicismo e por um profundo conflito emocional.",
    },
    {
        id: 5,
        name: "Especialista em Frontend",
        description: "Guardião da experiência do usuário, mestre em interfaces interativas e obcecado pelo pixel perfect.",
    }
]

export default function Characters() {
    return (
        <main className="flex h-full w-full flex-col gap-4 p-6 min-h-0">
            <CharactersHeader />
            <Separator className="bg-primary/50" />
            <CharacterFilters />
            <CharactersList characters={characters} />
        </main>
    )
}