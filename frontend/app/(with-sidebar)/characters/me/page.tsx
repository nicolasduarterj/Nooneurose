import MeList from "@/components/features/user/list/characters";

export default function MeCharacters() {
  return (
    <div className="flex h-full w-full flex-col relative">
        <div className="simple-mesh-gradient" aria-hidden="true" />
        <MeList />
    </div>
  );
}