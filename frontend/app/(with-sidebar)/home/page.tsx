import ChatsList from "@/components/features/chat/list/chats";

export default function MeChats() {
  return (
    <main className="flex h-full w-full flex-col gap-4 p-6 min-h-0 relative">
        <div className="simple-mesh-gradient" aria-hidden="true" />
        <ChatsList />
    </main>
  );
}