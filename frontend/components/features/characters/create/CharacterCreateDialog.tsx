"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import CharacterCreateForm from "./CharacterCreateForm";
import { useState } from "react";

export default function CharacterCreateDialog() {
    const [open, setOpen] = useState(false);

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

                <CharacterCreateForm onSubmitMessage={() => { setOpen(false) }} />
            </DialogContent>
        </Dialog>
    )
}