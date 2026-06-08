import ChatsList from "@/components/features/chat/list/chats";

export default function MeChats() {
  return (
    <main className="flex h-full w-full flex-col relative">
        <div className="simple-mesh-gradient" aria-hidden="true" />
        <ChatsList />
    </main>
  );
}