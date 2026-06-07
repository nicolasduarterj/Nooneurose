'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import UserView from "@/components/features/user/view/UserView";
import MeList from "@/components/features/user/list/characters";
import { API_BASE, authHeaders } from "@/lib/api";
import { Creator } from "@/types/user"

export default function UserCreatorPage() {
  const params = useParams();
  const creatorId = params?.id as string | undefined;
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!creatorId) {
      setLoading(false);
      return;
    }

    const fetchCreator = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/user/byId/${creatorId}`, {
          headers: authHeaders(),
        });
        if (response.ok) {
          const data = await response.json();
          setCreator(data as Creator);
        }
      } catch (error) {
        console.error("Erro ao buscar criador:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreator();
  }, [creatorId]);

  if (loading) {
    return (
      <main className="flex h-full w-full flex-col gap-4 p-6 min-h-0 relative">
        <div className="rounded-md bg-tertiary/25 p-4 text-neutral/60">Carregando...</div>
      </main>
    );
  }

  if (!creator) {
    return (
      <main className="flex h-full w-full flex-col gap-4 p-6 min-h-0 relative">
        <div aria-hidden="true" />
        <div className="rounded-md bg-secondary p-4 text-neutral/80">Criador não encontrado.</div>
      </main>
    );
  }

  return (
    <main className="flex h-full w-full flex-col gap-4 p-6 min-h-0 relative">
      <div aria-hidden="true" />
      <section className="flex flex-col w-full gap-4 rounded-md border border-neutral/20 bg-secondary p-4 text-neutral/80 sm:p-">
        <div className="rounded-md bg-tertiary/25 p-3 sm:col-span-2">
          <dt className="text-neutral/60">ID do Usuário</dt>
          <dd className="font-medium">{creator.id}</dd>
        </div>
      </section>
      <UserView showEmail={false} user={creator} />
      <MeList userId={creator.id} />
    </main>
  );
}