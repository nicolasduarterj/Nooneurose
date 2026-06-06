'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X } from 'lucide-react';

import { API_BASE, authHeaders } from '@/lib/api';
import { Character } from '@/types/character';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import CharacterEditForm, { type CharacterEditFormState } from '@/components/features/characters/edit/CharacterEditForm';

type CharacterEditPageParams = {
    id: number;
};

type CharacterEditPageProps = {
    params: Promise<CharacterEditPageParams>;
};

 

export default function EditCharacter({ params }: CharacterEditPageProps) {
    const router = useRouter();
    const { id } = use<CharacterEditPageParams>(params);

    const [character, setCharacter] = useState<Character | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formState, setFormState] = useState<CharacterEditFormState>({
        name: '',
        description: '',
        isGloballyChangeable: false,
        isPrivatelyChangeable: false,
        imageURL: '',
    });

    useEffect(() => {
        const fetchCharacter = async () => {
            setIsLoading(true);

            try {
                const res = await fetch(`${API_BASE}/api/character/byId/${id}`, {
                    method: 'GET',
                    headers: authHeaders(),
                });

                if (!res.ok) {
                    throw new Error(`Erro ao buscar personagem: ${res.status}`);
                }

                const characterData: Character = await res.json();
                setCharacter(characterData);
                setFormState({
                    name: characterData.name,
                    description: characterData.description,
                    isGloballyChangeable: characterData.isGloballyChangeable,
                    isPrivatelyChangeable: characterData.isPrivatelyChangeable,
                    imageURL: characterData.imageURL ?? '',
                });
            } catch (error) {
                console.error('Erro ao carregar personagem para edição:', error);
                router.push('/characters');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCharacter();
    }, [id, router]);

    const handleSubmit = async () => {
        if (isSaving) {
            return;
        }

        setIsSaving(true);

        try {
            const requestBody = {
                name: formState.name.trim() || undefined,
                description: formState.description.trim() || undefined,
                isGloballyChangeable: formState.isGloballyChangeable,
                isPrivatelyChangeable: formState.isPrivatelyChangeable,
                imageURL: formState.imageURL.trim() ? formState.imageURL.trim() : null,
            };

            const res = await fetch(`${API_BASE}/api/character/byId/${id}`, {
                method: 'PATCH',
                headers: authHeaders(),
                body: JSON.stringify(requestBody),
            });

            if (!res.ok) {
                throw new Error(`Erro ao atualizar personagem: ${res.status}`);
            }

            router.push(`/characters/${id}`);
        } catch (error) {
            console.error('Erro ao salvar personagem:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className="relative flex h-full w-full flex-col gap-4 p-6 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between px-2">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold">Editar personagem</h1>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        className="bg-primary/50 cursor-pointer"
                        onClick={() => router.push(`/characters/${id}`)}
                    >
                        <X size={16} />
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        className="bg-primary/50 cursor-pointer"
                        onClick={() => void handleSubmit()}
                        disabled={isSaving || isLoading}
                    >
                        <Save size={16} />
                        {isSaving ? 'Salvando...' : 'Salvar alterações'}
                    </Button>
                </div>
            </div>

            <Separator className="bg-primary/50" />

            {isLoading ? (
                <p className="px-2 text-neutral/60">Carregando personagem...</p>
            ) : character ? (
                <CharacterEditForm character={character} formState={formState as CharacterEditFormState} setFormState={(s) => setFormState(s)} />
            ) : (
                <p className="px-2 text-neutral/60">Não foi possível carregar o personagem.</p>
            )}
        </main>
    );
}
