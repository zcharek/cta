import { useEffect, useState } from "react";
import { api, formatDate, primaryButton, secondaryButton, statusLabel, statusStyle, type AssignmentSummary, type User } from "./api";
import { ErrorNote, Loading, StatusBadge } from "./Shell";

export default function ClientDashboard({ user }: { user: User }) {
  const [items, setItems] = useState<AssignmentSummary[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ assignments: AssignmentSummary[] }>("assignments")
      .then((d) => setItems(d.assignments))
      .catch((e) => setError(e.message));
  }, []);

  const firstName = user.name.split(" ")[0];

  return (
    <>
      <h1 className="mb-1 text-3xl font-bold text-brand-blue-900">Bonjour {firstName}</h1>
      <p className="mb-8 text-gray-600">{user.company ? `${user.company} · ` : ""}Votre espace Central Test Agency</p>

      <h2 className="mb-4 text-lg font-semibold text-brand-blue-900">Vos questionnaires</h2>
      {error && <ErrorNote>{error}</ErrorNote>}
      {!items && !error && <Loading />}

      {items?.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <p className="mb-2 font-semibold text-brand-blue-900">Votre compte est prêt</p>
          <p className="mx-auto max-w-md text-gray-600">
            Nous allons vous envoyer un questionnaire de cadrage pour mieux comprendre votre besoin. Il apparaîtra ici,
            en général sous 24h.
          </p>
        </div>
      )}

      <ul className="grid gap-4">
        {items?.map((a) => (
          <li key={a.id} className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-semibold text-brand-blue-900">{a.title}</h3>
                <StatusBadge className={statusStyle[a.status]}>{statusLabel[a.status]}</StatusBadge>
              </div>
              <p className="text-sm text-gray-500">
                {a.status === "submitted" ? `Envoyé le ${formatDate(a.submitted_at)}` : `Reçu le ${formatDate(a.sent_at)}`}
              </p>
              {a.message && <p className="mt-3 whitespace-pre-line text-sm text-gray-700">{a.message}</p>}
            </div>
            <a
              href={`#/espace/questionnaire/${a.id}`}
              className={`${a.status === "submitted" ? secondaryButton : primaryButton} text-center`}
            >
              {a.status === "submitted" ? "Voir mes réponses" : a.status === "in_progress" ? "Reprendre" : "Commencer"}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
