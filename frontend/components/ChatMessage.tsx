import { Message } from "@/app/types/message";
import { BotMessageSquare, CircleUser } from "lucide-react";

type ChatMessageProps = {
  message: Message;
};

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === "user";

  return (
    <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-2.5 sm:px-3 sm:py-3`}>
      <div className="inline-flex h-fit w-fit self-start items-center justify-center rounded-lg bg-linear-to-b from-primary to-primary/30">
        {isUser ? (
          <CircleUser className="h-8 w-8 text-secondary" />
        ) : (
          <BotMessageSquare className="h-8 w-8 text-secondary" />
        )
        }
      </div>
      <div className="flex min-w-0 flex-1 rounded-3xl border-secondary bg-secondary px-4 py-4 text-neutral drop-shadow-neutral-950">
        <p className="text-base text-justify whitespace-pre-wrap wrap-anywhere">{message.content}</p>
      </div>
    </div>
  );
}
