"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CharacterCreateForm, { CharacterFormState } from "./CharacterCreateForm";
import { useState } from "react";
import { Plus } from "lucide-react";
import { authHeaders } from "@/lib/api";
import { Character } from "@/types/character";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function CharacterCreateDialog() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [formState, setFormState] = useState<CharacterFormState>({
        name: "",
        description: "",
        permissionFile: null,
    });

    const handleSubmit = async () => {
        try {
            const formData = new FormData();

            formData.append("name", formState.name);
            formData.append("description", formState.description);

            if (formState.permissionFile) {
                formData.append("permissionFile", formState.permissionFile);
            }

            const headers = authHeaders();

            const { "Content-Type": _, ...headersWithoutContentType } = headers;

            const res = await fetch(`${API_BASE}/api/character`, {
                method: "POST",
                headers: headersWithoutContentType,
                body: formData,
            });

            if (!res.ok)
                throw new Error(`Erro ao criar personagem: ${res.status}`);

            const character: Character = await res.json();

            setOpen(false);
            router.push(`/characters/${character.id}`);
        }
        catch (error) {
            console.error("Erro ao criar personagem:", error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="bg-primary/50 px-1 py-1 rounded-lg text-neutral/80 hover:bg-primary/70 cursor-pointer">
                    <Plus />
                </button>
            </DialogTrigger>
            <DialogContent className="bg-secondary border border-neutral/20 text-neutral/80">
                <DialogHeader>
                    <DialogTitle>Crie um novo personagem</DialogTitle>
                    <DialogDescription>Preencha o formulário para criar seu personagem</DialogDescription>
                </DialogHeader>

                <CharacterCreateForm
                    formState={formState}
                    onChange={setFormState}
                    onSubmitMessage={handleSubmit} />
            </DialogContent>
        </Dialog>
    )
}