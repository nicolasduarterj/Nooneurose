"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CharacterReportForm, { CharacterReportState } from "./CharacterReportForm";
import { API_BASE, authHeaders } from "@/lib/api";

type Props = {
    characterId: number;
};

export default function CharacterReportDialog({
    characterId,
}: Props) {

    const [open, setOpen] = useState(false);

    const [formState, setFormState] =
        useState<CharacterReportState>({
            motive: "",
        });

    const handleCancel = () => {
        setFormState({ motive: "" });
        setOpen(false);
    };

    const handleSubmit = async () => {
        try {

            const res = await fetch(`${API_BASE}/api/report`, {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify({
                    characterId,
                    motive: formState.motive,
                }),
            });

            if (!res.ok) {
                throw new Error("Erro ao enviar denúncia");
            }

            setFormState({ motive: "" });
            setOpen(false);

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >

            <DialogTrigger asChild>
                <button
                    className="flex items-center gap-2 px-2 py-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 cursor-pointer"
                >
                    <Flag size={14}/>
                    Denunciar
                </button>
            </DialogTrigger>

            <DialogContent className="bg-secondary border border-neutral/20 text-neutral/80">

                <DialogHeader>

                    <DialogTitle>
                        Denunciar personagem
                    </DialogTitle>

                    <DialogDescription>
                        Explique o motivo da denúncia.
                    </DialogDescription>

                </DialogHeader>

                <CharacterReportForm
                    formState={formState}
                    onChange={setFormState}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />

            </DialogContent>

        </Dialog>
    );
}