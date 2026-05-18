import { Message } from "@/types/message";
import { BotMessageSquare, CircleUser } from "lucide-react";

type ChatMessageProps = {
  message: Message;
};

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.source === "user";

  return (
    <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-2 px-2 py-2 sm:gap-2.5 sm:px-3 sm:py-3`}>
      <div className="inline-flex h-fit w-fit self-start items-center justify-center rounded-lg bg-linear-to-b from-primary to-primary/30">
        {isUser ? (
          <CircleUser className="h-7 w-7 text-secondary sm:h-8 sm:w-8" />
        ) : (
          <BotMessageSquare className="h-7 w-7 text-secondary sm:h-8 sm:w-8" />
        )
        }
      </div>
      <div className="flex min-w-0 flex-1 rounded-2xl border border-primary/50 bg-tertiary/30 px-3 py-2.5 text-neutral drop-shadow-neutral-950 sm:px-4 sm:py-4">
        <p className="text-sm text-justify whitespace-pre-wrap wrap-anywhere sm:text-base">{message.content}</p>
      </div>
    </div>
  );
}
