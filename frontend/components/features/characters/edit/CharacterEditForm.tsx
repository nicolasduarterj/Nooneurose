"use client";

import Image from "next/image";

import { Character } from "@/types/character";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { isImageUrl } from "@/lib/utils";

export type CharacterEditFormState = {
	name: string;
	description: string;
	isGloballyChangeable: boolean;
	isPrivatelyChangeable: boolean;
	imageURL: string;
};

type CharacterEditFormProps = {
	character: Character;
	formState: CharacterEditFormState;
	setFormState: (s: CharacterEditFormState) => void;
};

export default function CharacterEditForm({ character, formState, setFormState }: CharacterEditFormProps) {
	const url = character.imageURL;
    const srcDaImagem = url && isImageUrl(url) ? url : "/question.svg";
	
	return (
		<section className="flex-1 flex flex-col w-full gap-4 rounded-md border border-neutral/20 bg-secondary p-4 text-neutral/80 sm:p-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div className="space-y-1 flex-1 gap-4">
					<div className="flex flex-col gap-2">
						<Label>Nome</Label>
						<Input
							id="name"
							name="name"
							type="text"
							autoComplete="off"
							value={formState.name}
							onChange={(event) => setFormState({ ...formState, name: event.target.value })}
							className="w-fit h-auto text-xl font-semibold shadow-none focus-visible:ring-0"
						/>
					</div>

					<div className="flex flex-col gap-2">
						<Label>Descrição</Label>
						<Textarea
							id="description"
							name="description"
							autoComplete="off"
							value={formState.description}
							onChange={(event) => setFormState({ ...formState, description: event.target.value })}
							className="-auto text-xl font-semibold shadow-none focus-visible:ring-0"
						/>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-[200px_1fr] lg:items-start">
				<div className="flex flex-col gap-2">
					<div className="lg:flex lg:items-start lg:gap-4">
						<div className="w-fit h-fit rounded-md bg-tertiary/25 shrink-0">
							<Image
								src={srcDaImagem}
								alt={formState.name || character.name}
								className="rounded-md object-cover"
								width={200}
								height={200}
								onError={(e) => {
									(e.target as HTMLImageElement).src = "/question.svg";
								}}
							/>
						</div>
						
					</div>
                    <div className="flex flex-col w-full lg:mt-0 gap-2">
							<Label>Imagem URL</Label>
							<Input
								name="imageURL"
								type="url"
								autoComplete="off"
								placeholder="URL da imagem"
								value={formState.imageURL}
								onChange={(event) => setFormState({ ...formState, imageURL: event.target.value })}
								className="w-fit h-full text-xl font-semibold shadow-none focus-visible:ring-0"
							/>
					</div>
				</div>

				<dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 lg:col-span-full">
					<div className="rounded-md bg-tertiary/25 p-3">
						<dt className="text-neutral/60">Alteracao global</dt>
						<dd className="mt-2 flex items-center gap-2">
							<Checkbox
								checked={formState.isGloballyChangeable}
								onCheckedChange={(checked) => setFormState({ ...formState, isGloballyChangeable: !!checked })}
							/>
							<span className="font-medium">{formState.isGloballyChangeable ? 'Sim' : 'Não'}</span>
						</dd>
					</div>

					<div className="rounded-md bg-tertiary/25 p-3">
						<dt className="text-neutral/60">Alteracao privada</dt>
						<dd className="mt-2 flex items-center gap-2">
							<Checkbox
								checked={formState.isPrivatelyChangeable}
								onCheckedChange={(checked) => setFormState({ ...formState, isPrivatelyChangeable: !!checked })}
							/>
							<span className="font-medium">{formState.isPrivatelyChangeable ? 'Sim' : 'Não'}</span>
						</dd>
					</div>
				</dl>
			</div>
		</section>
	);
}

