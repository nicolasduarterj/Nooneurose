type UserViewProps = {
  user?: {
    name: string;
    email?: string;
    senha?: string;
  };
  showEmail?: boolean;
  showPassword?: boolean;
};

export default function UserView({
  user = {
    name: "Usuário",
    email: "email@mail.com",
  },
  showEmail = true,
}: UserViewProps) {
  return (
    <section className="flex flex-col w-full gap-4 rounded-md border border-neutral/20 bg-secondary p-4 text-neutral/80 sm:p-">
      <div className="rounded-md bg-tertiary/25 p-3 sm:col-span-2">
        <dt className="text-neutral/60">Nome do Usuário</dt>
        <dd className="font-medium">{user.name}</dd>
      </div>
      {showEmail && (
        <div className="rounded-md bg-tertiary/25 p-3 sm:col-span-2">
          <dt className="text-neutral/60">Email</dt>
          <dd className="font-medium">{user.email ?? "—"}</dd>
        </div>
      )}
    </section>
  );
}
