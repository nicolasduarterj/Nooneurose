import Sidebar from '@/components/layout/Sidebar'

export default function DashboardLayout({ children }
    : { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-full    ">
            <div className="w-3/12 h-full bg-zinc-950 border-r border-zinc-800">
                <Sidebar />
            </div>
            <div className="w-9/12 h-full bg-zinc-950">
                {children}
            </div>
        </div>
    )
}