import { Button } from "@/components/ui/button";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Form from "next/form";

type CharacterCreateFormProps = {
    onSubmitMessage: () => Promise<void> | void;
}

export default function CharacterCreateForm({ onSubmitMessage }: CharacterCreateFormProps) {
    const handleSubmit = async () => {
        console.log("Salvando personagem")

        await onSubmitMessage()
    }

    return (
        <Form action={handleSubmit}>
            <FieldGroup>
                <Field>
                    <FieldLabel>Nome</FieldLabel>
                    <Input
                        name="name"
                        type="text"
                        autoComplete="off" />
                </Field>
                <Field>
                    <FieldLabel>Descrição</FieldLabel>
                    <Textarea
                        name="description"
                        autoComplete="off">
                    </Textarea>
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