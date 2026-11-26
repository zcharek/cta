import { useEffect, useState } from "react";
import { api, type User } from "./api";
import AdminPage from "./AdminPage";
import AuthPage from "./AuthPage";
import ClientDashboard from "./ClientDashboard";
import QuestionnairePage from "./QuestionnairePage";
import { ErrorNote, Loading, Shell } from "./Shell";

/** #/espace/verifier/:jeton — lien reçu par e-mail : confirme l'adresse puis ouvre l'espace. */
function Verification({ jeton, onAuth }: { jeton: string; onAuth: (u: User) => void }) {
  const [erreur, setErreur] = useState("");
  useEffect(() => {
    api("auth/verify", { body: { jeton } })
      .then(() => api<{ user: User }>("auth/me"))
      .then((d) => onAuth(d.user))
      .catch((e) => setErreur((e as Error).message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jeton]);
  if (!erreur) return <Loading />;
  return (
    <div className="mx-auto grid max-w-md gap-4">
      <ErrorNote>{erreur}</ErrorNote>
      <a href="#/espace" className="text-center font-semibold text-brand-blue-700 hover:underline">
        Aller à la connexion
      </a>
    </div>
  );
}

// Routes : #/espace · #/espace/verifier/:jeton · #/espace/questionnaire/:id · #/admin · #/admin/client/:id
export default function Portal({ route }: { route: string }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    api<{ user: User | null }>("auth/me")
      .then((d) => setUser(d.user))
      .catch(() => setUser(null));
  }, []);

  async function logout() {
    await api("auth/logout", { method: "POST" }).catch(() => {});
    setUser(null);
    window.location.hash = "#/espace";
  }

  function onAuth(u: User) {
    setUser(u);
    window.location.hash = u.role === "admin" ? "#/admin" : "#/espace";
  }

  const parts = route.replace(/^#\//, "").split("/");
  const isAdminRoute = parts[0] === "admin";

  let page;
  if (parts[0] === "espace" && parts[1] === "verifier" && parts[2]) page = <Verification key={parts[2]} jeton={parts[2]} onAuth={onAuth} />;
  else if (user === undefined) page = <Loading />;
  else if (!user) page = <AuthPage onAuth={onAuth} />;
  else if (parts[1] === "questionnaire" && parts[2]) page = <QuestionnairePage key={parts[2]} id={parts[2]} user={user} />;
  else if (isAdminRoute && user.role !== "admin") page = <ErrorNote>Cette page est réservée à l'administrateur.</ErrorNote>;
  else if (isAdminRoute || user.role === "admin") page = <AdminPage key={route} clientId={parts[1] === "client" ? parts[2] : undefined} />;
  else page = <ClientDashboard user={user} />;

  return (
    <Shell user={user} onLogout={logout}>
      {page}
    </Shell>
  );
}
