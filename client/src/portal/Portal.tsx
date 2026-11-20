import { useEffect, useState } from "react";
import { api, type User } from "./api";
import AdminPage from "./AdminPage";
import AuthPage from "./AuthPage";
import ClientDashboard from "./ClientDashboard";
import QuestionnairePage from "./QuestionnairePage";
import { ErrorNote, Loading, Shell } from "./Shell";

// Routes : #/espace · #/espace/questionnaire/:id · #/admin · #/admin/client/:id
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
  if (user === undefined) page = <Loading />;
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
