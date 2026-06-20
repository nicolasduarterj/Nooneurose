'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { API_BASE, authHeaders } from "@/lib/api";
import Image from "next/image";
import { isImageUrl } from "@/lib/utils";

interface Report {
  id: number;
  character: number;
  motive: string;
}

interface Character {
  id: number;
  name: string;
  description: string;
  isGloballyChangeable: boolean;
  isPrivatelyChangeable: boolean;
  ownerId: number;
  imageURL: string | null;
  permissionFile: string | null;
}

export default function ReportDetail() {
  const params = useParams();
  const router = useRouter();
  const reportId = params?.id as string | undefined;

  const [report, setReport] = useState<Report | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);
  const [srcDaImagem, setSrcDaImagem] = useState("/question.svg");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const reportsRes = await fetch(`${API_BASE}/api/report`, {
          method: "GET",
          headers: authHeaders(),
        });

        if (!reportsRes.ok) {
          throw new Error(`Erro ao buscar denúncia: ${reportsRes.status}`);
        }

        const allReports: Report[] = await reportsRes.json();
        const found = allReports.find((r) => r.id === Number(reportId));

        if (!found) {
          throw new Error("Denúncia não encontrada.");
        }

        setReport(found);

        const charRes = await fetch(`${API_BASE}/api/character/byId/${found.character}`, {
          method: "GET",
          headers: authHeaders(),
        });

        if (!charRes.ok) {
          throw new Error(`Erro ao buscar personagem: ${charRes.status}`);
        }

        const charData: Character = await charRes.json();
        setCharacter(charData);

        if (charData.imageURL) {
          const valid = await isImageUrl(charData.imageURL);
          if (valid) setSrcDaImagem(charData.imageURL);
        }
      } catch (fetchError) {
        console.error("Falha ao carregar denúncia", fetchError);
        setError(fetchError instanceof Error ? fetchError.message : "Erro ao carregar denúncia.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [reportId]);

  const handleDenyReport = () => {
    router.push("/report");
  };

  const handleViewPdf = async () => {
    if (!character?.permissionFile) return;

    try {
        const res = await fetch(`${API_BASE}/api/file/${character.permissionFile}`, {
        headers: authHeaders(),
        });

        if (!res.ok) throw new Error(`Erro ao buscar arquivo: ${res.status}`);

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    } catch (err) {
        console.error(err);
        setActionError('Não foi possível abrir o arquivo da licença.');
    }
  };

  // Confirmar denúncia — apaga o personagem denunciado
  const handleConfirmReport = async () => {
    if (!character) return;

    setActionLoading(true);
    setActionError(null);

    try {
      const res = await fetch(`${API_BASE}/api/character/byId/${character.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (!res.ok && res.status !== 204) {
        throw new Error(`Erro ao apagar personagem: ${res.status}`);
      }

      router.push("/report");
    } catch (err) {
      console.error(err);
      setActionError("Não foi possível apagar o personagem.");
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col gap-4 p-6 min-h-0 relative">
        <p className="text-neutral/60">Carregando denúncia...</p>
      </div>
    );
  }

  if (error || !report || !character) {
    return (
      <div className="flex h-full w-full flex-col gap-4 p-6 min-h-0 relative">
        <div className="rounded-md bg-destructive/25 p-4 text-destructive">
          {error ?? "Denúncia não encontrada."}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-4 p-6 min-h-0 overflow-y-auto relative">
      <div>
        <h1 className="text-2xl font-bold">Denúncia {report.id}</h1>
      </div>
      <Separator className="bg-primary/50" />

      <section className="flex flex-col w-full gap-4 rounded-md border border-neutral/20 bg-secondary p-4 text-neutral/80 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">{character.name}</h2>
            <p className="text-sm text-neutral/70">{character.description}</p>
          </div>
        </div>

        <div className="w-fit h-fit rounded-md bg-tertiary/25">
          <Image
            src={srcDaImagem}
            alt={character.name}
            className="rounded-md object-cover"
            width={200}
            height={200}
            priority
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/question.svg";
            }}
          />
        </div>

        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-md bg-tertiary/25 p-3">
            <dt className="text-neutral/60">ID do criador</dt>
            <dd className="font-medium">#{character.ownerId}</dd>
          </div>

          <div className="rounded-md bg-tertiary/25 p-3">
            <dt className="text-neutral/60">Moldável pelos usuários</dt>
            <dd className="font-medium">{character.isGloballyChangeable ? "Sim" : "Não"}</dd>
          </div>
        </dl>
      </section>

      <section className="flex flex-col w-full gap-2 rounded-md border border-neutral/20 bg-secondary p-4 text-neutral/80 sm:p-6">
        <h3 className="text-sm text-neutral/60">Motivo da denúncia</h3>
        <p className="text-base">{report.motive}</p>
      </section>

      <section className="flex flex-col w-full gap-2 rounded-md border border-neutral/20 bg-secondary p-4 text-neutral/80 sm:p-6">
        <h3 className="text-sm text-neutral/60">Licença de uso de imagem</h3>
        {character.permissionFile ? (
            <button
            type="button"
            onClick={handleViewPdf}
            className="w-fit rounded-md bg-primary/20 px-4 py-2 text-sm text-primary hover:bg-primary/30 transition cursor-pointer"
            >
            Ver PDF da licença
            </button>
        ) : (
            <p className="text-sm text-neutral/50">
            Nenhuma licença enviada — o criador afirma que este personagem não é real.
            </p>
        )}
       </section>

      {actionError && (
        <div className="rounded-md bg-destructive/25 p-4 text-destructive">
          {actionError}
        </div>
      )}

      <div className="flex flex-row justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleDenyReport}
          disabled={actionLoading}
          className="px-4 py-2 rounded-lg bg-neutral/10 text-neutral/80 hover:bg-neutral/15 cursor-pointer disabled:opacity-50"
        >
          Negar denúncia
        </button>
        <button
          type="button"
          onClick={handleConfirmReport}
          disabled={actionLoading}
          className="px-4 py-2 rounded-lg bg-destructive/80 text-white hover:bg-destructive cursor-pointer disabled:opacity-50"
        >
          {actionLoading ? "Apagando..." : "Confirmar denúncia e apagar personagem"}
        </button>
      </div>
    </div>
  );
}