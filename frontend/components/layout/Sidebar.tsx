import { CircleUser, House, ListIndentDecrease, UserSearch } from "lucide-react";

export default function Sidebar() {
    return (
        <aside className="flex flex-col h-full w-full gap-6 p-6 md:p-8">
            <div className="flex flex-col gap-6">
                <div className="flex flex-row justify-evenly items-center px-4">
                    <div>
                        <h1 className="text-2xl font-bold">Nooneurose</h1>
                    </div>
                    <div>
                        <ListIndentDecrease className="h-5 w-5 hover:cursor-pointer" />
                    </div>
                </div>
                <div className="px-4">
                    <input
                        className="w-full px-3 py-2 bg-tertiary/10 border-2 border-primary/30 rounded-lg text-md text-neutral/50 focus:outline-none focus:ring-primary/50 focus:border-primary/50"
                        type="text"
                        placeholder="Buscar"
                    />
                </div>
            </div>

            <div className="px-4 py-2.5 border-t border-primary/30">
                <ul className="flex flex-col gap-2 text-sm text-neutral/40">
                    <li className="flex flex-row items-center gap-2 cursor-pointer hover:bg-primary/10 rounded-md p-2">
                        <div>
                            <House />
                        </div>
                        <div>
                            <p>HOME</p>
                        </div>
                    </li>
                    <li className="flex flex-row items-center gap-2 cursor-pointer hover:bg-primary/10 rounded-md p-2">
                        <div>
                            <UserSearch />
                        </div>
                        <div>
                            <p>PERSONAGENS</p>
                        </div>
                    </li>
                </ul>
            </div>

            <div className="flex flex-col gap-2.5 px-4 py-2.5 border-t border-primary/30 text-xs">
                <h3 className="text-neutral/80">CHATS RECENTES</h3>

                <ul className="flex flex-col gap-2 text-sm text-neutral/40">
                    <li className="bg-tertiary/25 cursor-pointer hover:bg-primary/10 rounded-md px-2 py-1">
                        <p>Filosofia moderna</p>
                    </li>
                    <li className="bg-tertiary/25 cursor-pointer hover:bg-primary/10 rounded-md px-2 py-1">
                        <p>Banco de dados 3</p>
                    </li>
                    <li className="bg-tertiary/25 cursor-pointer hover:bg-primary/10 rounded-md px-2 py-1">
                        <p>Raças de gatos</p>
                    </li>
                </ul>
            </div>

            <div className="flex flex-row px-4 py-2.5 gap-4 border-t items-center border-primary/30 text-neutral/30 mt-auto">
                <div>
                    <CircleUser className="size-8" />
                </div>
                <div className="flex flex-col text-sm">
                    <p className="text-neutral/70">ENNIS</p>
                    <p className="text-neutral/50">ENIS@TESTE.COM</p>
                </div>
            </div>
        </aside>
    )
}