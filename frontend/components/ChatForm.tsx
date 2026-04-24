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

        await onSubmitMessage(message);
        cleanForm();
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
        <div className="w-full min-h-12 bg-secondary rounded-2xl flex items-center px-4 py-2">
            <Form ref={formRef} action={handleSubmit} className="flex flex-row items-center gap-3 w-full">
                <div className="flex-1 px-3 flex items-center">
                    <textarea
                        ref={textareaRef}
                        name="message"
                        placeholder="Digite o prompt..."
                        rows={1}
                        onChange={handleTextareaInput}
                        onKeyDown={handleKeyDown}
                        className="w-full text-neutral outline-none focus:outline-none focus:ring-0 resize-none leading-5 overflow-hidden" />
                </div>
                <div>
                    <button type="submit" className="w-8 h-8 flex items-center justify-center bg-linear-to-b from-primary to-primary/30 rounded-lg p-2">
                        <ArrowUp className="text-secondary" />
                    </button>
                </div>
            </Form>
        </div>
    );
}   