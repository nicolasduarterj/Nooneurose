'use client'

import { useEffect, useState } from "react";
import MeList from "@/components/features/user/list/characters";
import UserView from "@/components/features/user/view/UserView";
import { API_BASE, authHeaders } from "@/lib/api";
import { useAuth } from '@/contexts/AuthContext';



export default function MeUser() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!authUser?.id) {
          setIsLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE}/api/user/byId/${authUser.id}`, {
          method: "GET",
          headers: authHeaders(),
        });

        if (!res.ok) {
          throw new Error(`Erro ao buscar usuário: ${res.status}`);
        }

        const data: User = await res.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [authUser?.id]);

  return (
    <main className="flex h-full w-full flex-col gap-4 p-6 min-h-0 relative">
        <div aria-hidden="true" />
        {isLoading ? (
          <div className="rounded-md bg-tertiary/25 p-4 text-neutral/60">Carregando dados do usuário...</div>
        ) : (
          <>
            {user ? (
              <section className="flex flex-col w-full gap-4 rounded-md border border-neutral/20 bg-secondary p-4 text-neutral/80 sm:p-">
                <div className="rounded-md bg-tertiary/25 p-3 sm:col-span-2">
                  <dt className="text-neutral/60">ID do Usuário</dt>
                  <dd className="font-medium">{user.id}</dd>
                </div>
              </section>
            ) : null}
            <UserView user={user ?? undefined} showEmail />
          </>
        )}
        <MeList />
    </main>
  );
}
