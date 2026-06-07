'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { API_BASE, authHeaders } from "@/lib/api";
import { useAuth } from '@/contexts/AuthContext';
import { User, FormData } from '@/types/user'


export default function MeUser() {
  const [user, setUser] = useState<User | null>(null);
  const { user: authUser } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    password: "",
    confirmPassword: "",
    oldPassword: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saveError, setSaveError] = useState('');

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
        setFormData({
          name: data.name,
          password: "",
          confirmPassword: "",
          oldPassword: "",
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [authUser?.id]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        password: "",
        confirmPassword: "",
        oldPassword: "",
      });
    }
    setSaveError('');
    setEditMode(false);
  };

  const handleSave = async () => {
    setSaveError('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      setSaveError("As senhas não coincidem.");
      return;
    }

    if (formData.password && !formData.oldPassword) {
      setSaveError('Digite a senha atual para alterá-la');
      return;
    }

    if (formData.oldPassword && !formData.password) {
      setSaveError('Digite a nova senha para alterá-la');
      return;
    }

    if (formData.password && formData.oldPassword) {
      const checkRes = await fetch(`${API_BASE}/api/user/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email: user!.email, password: formData.oldPassword }),
      });

      if (!checkRes.ok) {
        setSaveError('Senha atual incorreta.');
        return;
      }
    }

    if (!user) {
      return;
    }

    const payload: { name?: string; password?: string } = {};
    if (formData.name.trim() !== user.name.trim()) payload.name = formData.name;
    if (formData.password) payload.password = formData.password;

    if (Object.keys(payload).length === 0) {
      setEditMode(false);
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/user`,
        {
          method: "PATCH",
          headers: authHeaders(),
          body: JSON.stringify(payload),
        });

      if (!res.ok) {
        const data = await res.json();
        setSaveError(data.error ?? `Erro ao salvar as mudanças.`);
        return;
      }

      const updated: User = await res.json();
      setUser(updated);
      setFormData({
        name: updated.name,
        password: "",
        confirmPassword: "",
        oldPassword: "",
      });
      setEditMode(false);
    } catch (error) {
      console.error(error);
      setSaveError('Erro ao salvar as mudanças.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="flex h-full w-full flex-col gap-4 p-6 min-h-0 relative">
      {isLoading ? (
        <div className="rounded-md bg-tertiary/25 p-4 text-neutral/60">Carregando dados do usuário...</div>
      ) : user ? (
        <section className="flex flex-col w-full gap-4 rounded-md border border-neutral/20 bg-secondary p-4 text-neutral/80">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 rounded-md bg-tertiary/25 p-3">
              <span className="text-neutral/60">Nome do Usuário</span>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={!editMode}
                className="w-full rounded-md border border-neutral/20 bg-transparent px-3 py-2 text-neutral/90 outline-none focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-2 rounded-md bg-tertiary/25 p-3">
              <span className="text-neutral/60">Email</span>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full rounded-md border border-neutral/20 bg-transparent px-3 py-2 text-neutral/90 outline-none"
              />
            </label>
            <label className="flex flex-col gap-2 rounded-md bg-tertiary/25 p-3">
              <span className="text-neutral/60">Senha atual</span>
              <input
                type="password"
                value={editMode ? formData.oldPassword : "*****"}
                onChange={(e) => handleInputChange("oldPassword", e.target.value)}
                disabled={!editMode}
                placeholder={editMode ? "Digite sua senha atual" : undefined}
                className="w-full rounded-md border border-neutral/20 bg-transparent px-3 py-2 text-neutral/90 outline-none focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-2 rounded-md bg-tertiary/25 p-3">
              <span className="text-neutral/60">Nova senha</span>
              <input
                type="password"
                value={editMode ? formData.password : ""}
                onChange={(e) => handleInputChange("password", e.target.value)}
                disabled={!editMode}
                placeholder={editMode ? "Deixe em branco para não alterar" : undefined}
                className="w-full rounded-md border border-neutral/20 bg-transparent px-3 py-2 text-neutral/90 outline-none focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-2 rounded-md bg-tertiary/25 p-3">
              <span className="text-neutral/60">Confirme a nova senha</span>
              <input
                type="password"
                value={editMode ? formData.confirmPassword : ""}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                disabled={!editMode}
                placeholder={editMode ? "Confirme a nova senha" : undefined}
                className="w-full rounded-md border border-neutral/20 bg-transparent px-3 py-2 text-neutral/90 outline-none focus:border-primary"
              />
            </label>
          </div>
          {saveError && <p className="text-sm text-red-500 px-1">{saveError}</p>}
        </section>
      ) : (
        <div className="rounded-md bg-tertiary/25 p-4 text-neutral/60">Usuário não encontrado.</div>
      )}
      <div className="flex justify-between gap-3 pt-2">
        {editMode ? (
          <>
            <Button
              variant="outline"
              className="min-w-35 bg-primary/80 hover:bg-[#ff2f8b] text-white border-transparent"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancelar mudanças
            </Button>
            <Button className="min-w-35" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar mudanças"}
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            className="min-w-35 bg-primary/80 hover:bg-[#ff2f8b] text-white border-transparent"
            onClick={() => setEditMode(true)}
          >
            Editar conta
          </Button>
        )}
      </div>
    </main>
  );
}
