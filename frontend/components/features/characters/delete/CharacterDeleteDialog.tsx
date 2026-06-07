"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type CharacterDeleteProps = {
    characterId: number;
    onDelete: () => void;
};

export default function CharacterDeleteDialog({ characterId, onDelete }: CharacterDeleteProps) {
    const [open, setOpen] = useState(false);
    
    const handleDelete = async () => {
        // Implementar lógica de deleção aqui

        setOpen(false);
        onDelete();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="flex items-center gap-2 px-2 py-2 rounded-lg bg-destructive/50 text-neutral/80 hover:bg-destructive/60 cursor-pointer">
                    <Trash2 size={18} />
                </button>
            </DialogTrigger>
            <DialogContent className="bg-secondary border border-neutral/20 text-neutral/80">
                <DialogHeader className="gap-2">
                    <DialogTitle>Excluir personagem</DialogTitle>
                    <DialogDescription>Essa ação remove permanentemente o personagem. Deseja continuar?</DialogDescription>
                </DialogHeader>
                <Button 
                    type="button"
                    onClick={handleDelete}>
                        Excluir
                </Button>
            </DialogContent>
        </Dialog>
    )
}