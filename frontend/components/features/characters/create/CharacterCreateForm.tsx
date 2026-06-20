import { Button } from "@/components/ui/button";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Form from "next/form";

export type CharacterFormState = {
    name: string;
    description: string;
    permissionFile?: File | null;
}

type CharacterCreateFormProps = {
    formState: CharacterFormState;
    onChange: (newValue: CharacterFormState) => void;
    onSubmitMessage: () => Promise<void> | void;
}

export default function CharacterCreateForm({ formState, onChange, onSubmitMessage }: CharacterCreateFormProps) {
    return (
        <Form action={onSubmitMessage}>
            <FieldGroup>
                <Field>
                    <FieldLabel>Nome</FieldLabel>
                    <Input
                        name="name"
                        type="text"
                        autoComplete="off"
                        value={formState.name}
                        onChange={(event) => onChange({ ...formState, name: event.target.value })} />
                </Field>
                <Field>
                    <FieldLabel>Descrição</FieldLabel>
                    <Textarea
                        name="description"
                        autoComplete="off"
                        value={formState.description}
                        onChange={(event) => onChange({ ...formState, description: event.target.value })}>
                    </Textarea>
                </Field>
                <Field>
                    <FieldLabel>
                        OBS: Se o seu personagem for baseado em uma pessoal real você precisa anexar uma autorização da pessoa (PDF)
                    </FieldLabel>

                    <Input
                        className="cursor-pointer"
                        type="file"
                        accept=".pdf"
                        onChange={(event) =>
                            onChange({
                                ...formState,
                                permissionFile: event.target.files?.[0] ?? null,
                            })
                        }
                    />
                    {formState.permissionFile && (
                        <p>{formState.permissionFile.name}</p>
                    )}
                </Field>
                <Field>
                    <Button
                        className="cursor-pointer"
                        type="submit">
                        Criar
                    </Button>
                </Field>
            </FieldGroup>
        </Form>
    )
}