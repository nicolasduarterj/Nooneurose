'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { API_BASE, authHeaders } from "@/lib/api";
import { useAuth } from '@/contexts/AuthContext';

type User = {
  id: number;
  name: string;
  email: string;
  description?: string;
};

type FormData = {
  name: string;
  description: string;
  password: string;
  confirmPassword: string;
  oldPassword: string;
};

export default function MeUser() {
  const [user, setUser] = useState<User | null>(null);
  const { user: authUser } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    password: "",
    confirmPassword: "",
    oldPassword: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState("");
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!authUser?.id) {
          console.log("authUser não carregado ainda");
          setIsLoading(false);
          return;
        }

        console.log("Carregando usuário com ID:", authUser.id);

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
          description: data.description ?? "",
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

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        description: user.description ?? "",
        password: "",
        confirmPassword: "",
        oldPassword: "",
      });
    }
    setEditMode(false);
  };

  const handleSave = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    if (formData.password && !formData.oldPassword) {
      alert("Digite a senha antiga para alterar a senha.");
      return;
    }

    if (!user) {
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
      };

      if (formData.password) {
        Object.assign(payload, { password: formData.password });
      }

      if (formData.oldPassword) {
        Object.assign(payload, { oldPassword: formData.oldPassword });
      }

      const res = await fetch(`${API_BASE}/api/user/byId/${user.id}`, {
        method: "PATCH",
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Erro ao salvar usuário: ${res.status}`);
      }

      const updated: User = await res.json();
      setUser(updated);
      setFormData({
        name: updated.name,
        description: updated.description ?? "",
        password: "",
        confirmPassword: "",
        oldPassword: "",
      });
      setEditMode(false);
      alert("Usuário atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar as mudanças.");
    } finally {
      setIsSaving(false);
      setIsLoading(false);
    }
  };

  const handleDeleteDialogCancel = () => {
    setDeleteDialogOpen(false);
    setDeletePassword("");
    setDeleteConfirmPassword("");
    setDeleteConfirmationText("");
  };

  const handleDeleteAccountSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!deletePassword || !deleteConfirmPassword || !deleteConfirmationText) {
      alert("Preencha todos os campos.");
      return;
    }

    if (deletePassword !== deleteConfirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    if (deleteConfirmationText.trim().toLowerCase() !== "excluir conta") {
      alert("Digite 'excluir conta' para confirmar.");
      return;
    }

    // API para excluir a conta.
    alert("Conta excluída.");
    handleDeleteDialogCancel();
  };

  return (
    <main className="flex h-full w-full flex-col gap-4 p-6 min-h-0 relative">
      <div aria-hidden="true" />
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
                onChange={(event) => handleInputChange("name", event.target.value)}
                disabled={!editMode}
                className="w-full rounded-md border border-neutral/20 bg-transparent px-3 py-2 text-neutral/90 outline-none focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-2 rounded-md bg-tertiary/25 p-3">
              <span className="text-neutral/60">Email</span>
              <input
                type="email"
                value={user.email ?? ""}
                readOnly
                className="w-full rounded-md border border-neutral/20 bg-transparent px-3 py-2 text-neutral/90 outline-none"
              />
            </label>
            <label className="flex flex-col gap-2 rounded-md bg-tertiary/25 p-3 sm:col-span-2">
              <span className="text-neutral/60">Sobre Mim</span>
              <textarea
                value={formData.description}
                onChange={(event) => handleInputChange("description", event.target.value)}
                disabled={!editMode}
                rows={4}
                className="w-full resize-none rounded-md border border-neutral/20 bg-transparent px-3 py-2 text-neutral/90 outline-none focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-2 rounded-md bg-tertiary/25 p-3">
              <span className="text-neutral/60">Senha antiga</span>
              <input
                type="password"
                value={editMode ? formData.oldPassword : "*****"}
                onChange={(event) => handleInputChange("oldPassword", event.target.value)}
                disabled={!editMode}
                placeholder={editMode ? "Digite a senha antiga" : undefined}
                className="w-full rounded-md border border-neutral/20 bg-transparent px-3 py-2 text-neutral/90 outline-none focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-2 rounded-md bg-tertiary/25 p-3">
              <span className="text-neutral/60">Nova senha</span>
              <input
                type="password"
                value={editMode ? formData.password : ""}
                onChange={(event) => handleInputChange("password", event.target.value)}
                disabled={!editMode}
                placeholder={editMode ? "Digite a nova senha" : undefined}
                className="w-full rounded-md border border-neutral/20 bg-transparent px-3 py-2 text-neutral/90 outline-none focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-2 rounded-md bg-tertiary/25 p-3">
              <span className="text-neutral/60">Confirme a nova senha</span>
              <input
                type="password"
                value={editMode ? formData.confirmPassword : ""}
                onChange={(event) => handleInputChange("confirmPassword", event.target.value)}
                disabled={!editMode}
                placeholder={editMode ? "Confirme a nova senha" : undefined}
                className="w-full rounded-md border border-neutral/20 bg-transparent px-3 py-2 text-neutral/90 outline-none focus:border-primary"
              />
            </label>
          </div>
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
          <>
            <Button variant="outline" className="min-w-35 bg-primary/80 hover:bg-[#ff2f8b] text-white border-transparent" onClick={handleEdit}>
              Editar conta
            </Button>
            <Button variant="destructive" className="min-w-35" onClick={() => setDeleteDialogOpen(true)}>
              Excluir conta
            </Button>
            {deleteDialogOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="w-full max-w-lg rounded-2xl bg-secondary p-6 shadow-xl">
                  <div className="mb-5">
                    <h2 className="text-lg font-semibold text-white">Excluir conta</h2>
                    <p className="mt-2 text-sm text-neutral/60">
                      Esta operação irá apagar completamente a sua conta, voce tem certeza que deseja prosseguir? preencha os campos abaixo
                    </p>
                  </div>
                  <form className="space-y-4" onSubmit={handleDeleteAccountSubmit}>
                    <label className="flex flex-col gap-2 rounded-md bg-tertiary/25 p-3">
                      <span className="text-neutral/60">Senha</span>
                      <input
                        type="password"
                        value={deletePassword}
                        onChange={(event) => setDeletePassword(event.target.value)}
                        placeholder="Digite sua senha"
                        className="w-full rounded-md border border-neutral/20 bg-transparent px-3 py-2 text-neutral/90 outline-none focus:border-primary"
                      />
                    </label>
                    <label className="flex flex-col gap-2 rounded-md bg-tertiary/25 p-3">
                      <span className="text-neutral/60">Confirmar senha</span>
                      <input
                        type="password"
                        value={deleteConfirmPassword}
                        onChange={(event) => setDeleteConfirmPassword(event.target.value)}
                        placeholder="Confirme sua senha"
                        className="w-full rounded-md border border-neutral/20 bg-transparent px-3 py-2 text-neutral/90 outline-none focus:border-primary"
                      />
                    </label>
                    <label className="flex flex-col gap-2 rounded-md bg-tertiary/25 p-3">
                      <span className="text-neutral/60">Digite "excluir conta" para validar</span>
                      <input
                        type="text"
                        value={deleteConfirmationText}
                        onChange={(event) => setDeleteConfirmationText(event.target.value)}
                        placeholder="excluir conta"
                        className="w-full rounded-md border border-neutral/20 bg-transparent px-3 py-2 text-neutral/90 outline-none focus:border-primary"
                      />
                    </label>
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        className="min-w-35 rounded-md border border-neutral/20 bg-transparent px-4 py-2 text-sm text-white transition hover:bg-primary/800"
                        onClick={handleDeleteDialogCancel}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="min-w-35 rounded-md bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700"
                      >
                        Excluir conta
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
