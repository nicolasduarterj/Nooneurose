"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { API_BASE, authHeaders } from "@/lib/api";

interface Report {
  id: number;
  character: number; 
  motive: string;
}

export default function ReportsList() {
  const [reports, setReports] = useState<Report[]>([]);
  const [characterNames, setCharacterNames] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}/api/report`, {
          method: "GET",
          headers: authHeaders(),
        });

        if (!res.ok) {
          throw new Error(`Erro ao buscar denúncias: ${res.status}`);
        }

        const data: Report[] = await res.json();

        const ordered = data.slice().sort((a, b) => b.id - a.id);
        setReports(ordered);

        const uniqueCharacterIds = Array.from(new Set(ordered.map((report) => report.character)));
        const names: Record<number, string> = {};

        await Promise.all(
          uniqueCharacterIds.map(async (characterId) => {
            try {
              const charRes = await fetch(`${API_BASE}/api/character/byId/${characterId}`, {
                headers: authHeaders(),
              });
              if (!charRes.ok) return;
              const character = await charRes.json();
              names[characterId] = character.name ?? `Personagem ${characterId}`;
            } catch {
              names[characterId] = `Personagem ${characterId}`;
            }
          })
        );

        setCharacterNames(names);
      } catch (fetchError) {
        console.error("Falha ao carregar denúncias", fetchError);
        setError("Não foi possível carregar a lista de denúncias.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="flex h-full w-full flex-col gap-4 p-6 min-h-0 overflow-hidden relative">
      <div aria-hidden="true" />
      <div>
        <h1 className="text-2xl font-bold">Denúncias</h1>
      </div>
      <Separator className="bg-primary/50" />

      {isLoading ? (
        <p className="text-neutral/60">Carregando denúncias...</p>
      ) : error ? (
        <div className="rounded-md bg-destructive/25 p-4 text-destructive">
          {error}
        </div>
      ) : reports.length === 0 ? (
        <h3 className="text-neutral/60">Nenhuma denúncia encontrada.</h3>
      ) : (
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="grid gap-3 overflow-y-auto pr-2 max-h-full">
            {reports.map((report) => (
              <Link
                key={report.id}
                href={`/report/${report.id}`}
                className="flex flex-row justify-between items-center rounded-2xl border border-neutral/20 bg-muted/10 p-4 transition hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="flex w-full items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm text-neutral/60 truncate">
                      Denúncia {report.id} | {characterNames[report.character] ?? `Personagem ${report.character}`}
                    </p>
                    <p className="text-xs text-neutral/40 truncate">{report.motive}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}