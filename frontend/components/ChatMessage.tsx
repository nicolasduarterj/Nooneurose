import { BotMessageSquare, CircleUser } from "lucide-react";

type MessageType = "user" | "ai";

type ChatMessageProps = {
  type: MessageType;
  content: string;
};

export default function ChatMessage({ type, content }: ChatMessageProps) {
  const isUser = type === "user";

  return (
    <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-2.5 sm:px-3 sm:py-3`}>
      <div className="inline-flex h-fit w-fit self-start items-center justify-center rounded-lg bg-linear-to-t from-sky-500 to-emerald-400">
        {isUser ? (
          <CircleUser className="h-8 w-8 text-black" />
        ) : (
          <BotMessageSquare className="h-8 w-8 text-black" />
        )
        }
      </div>
      <div className="flex w-full rounded-3xl border-zinc-900 bg-zinc-900 px-4 py-4 text-neutral-200 drop-shadow-neutral-950">
        <p className="text-base text-justify">{content}</p>
      </div>
    </div>
  );
}
