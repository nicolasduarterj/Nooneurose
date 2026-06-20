"use client";

import Form from "next/form";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

export type CharacterReportState = {
    motive: string;
};

type Props = {
    formState: CharacterReportState;
    onChange: (value: CharacterReportState) => void;
    onSubmit: () => Promise<void> | void;
    onCancel: () => void;
};

export default function CharacterReportForm({
    formState,
    onChange,
    onSubmit,
    onCancel,
}: Props) {
    return (
        <Form action={onSubmit}>
            <FieldGroup>

                <Field>
                    <FieldLabel>Motivo da denúncia</FieldLabel>

                    <Textarea
                        value={formState.motive}
                        onChange={(e) =>
                            onChange({
                                motive: e.target.value,
                            })
                        }
                    />
                </Field>

                <div className="flex justify-end gap-2">

                    <Button
                        type="button"
                        onClick={onCancel}
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="submit"
                        disabled={!formState.motive.trim()}
                    >
                        Enviar denúncia
                    </Button>

                </div>

            </FieldGroup>
        </Form>
    );
}