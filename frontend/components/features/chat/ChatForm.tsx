"use client";

import { ArrowUp } from "lucide-react";
import Form from "next/form";
import { useRef, type ChangeEvent, type KeyboardEvent } from "react";

const MAX_ROWS = 3;

interface ChatFormProps {
    onSubmitMessage: (message: string) => Promise<void> | void;
}

export default function ChatForm({ onSubmitMessage }: ChatFormProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const cleanForm = () => {
        formRef.current?.reset();
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.overflowY = "hidden";
        }
    }

    const handleSubmit = async (formData: FormData) => {
        const message = formData.get("message")?.toString().trim();

        if (!message) {
            cleanForm();
            return;
        }

        cleanForm();
        await onSubmitMessage(message);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            formRef.current?.requestSubmit();
        }
    };

    function handleTextareaInput(event: ChangeEvent<HTMLTextAreaElement>) {
        const textarea = event.currentTarget;
        const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight || "20");
        const maxHeight = lineHeight * MAX_ROWS;

        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
        textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
    }

    return (
        <div className="flex w-full min-h-12 items-center rounded-2xl bg-tertiary/30 border border-neutral/10 px-3 py-1.5 sm:px-4 sm:py-2">
            <Form ref={formRef} action={handleSubmit} className="flex w-full flex-row items-center gap-2 sm:gap-3">
                <div className="flex flex-1 items-center px-1.5 sm:px-3">
                    <textarea
                        ref={textareaRef}
                        name="message"
                        placeholder="Digite o prompt..."
                        rows={1}
                        onChange={handleTextareaInput}
                        onKeyDown={handleKeyDown}
                        className="w-full resize-none overflow-hidden text-sm leading-5 text-neutral outline-none focus:outline-none focus:ring-0 sm:text-base" />
                </div>
                <div>
                    <button type="submit" className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-linear-to-b from-primary to-primary/30 p-2 sm:h-8 sm:w-8">
                        <ArrowUp className="h-4 w-4 text-secondary" />
                    </button>
                </div>
            </Form>
        </div>
    );
}   