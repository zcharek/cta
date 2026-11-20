import { useEffect, useState, type FormEvent } from "react";
import { api, formatDate, inputClass, primaryButton, statusLabel, statusStyle, type Status } from "./api";
import { ErrorNote, Loading, StatusBadge } from "./Shell";

type Client = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  created_at: string;
  assignments: { id: string; title: string; status: Status; sent_at: string; submitted_at: string | null }[];
};
type Template = { id: string; slug: string; title: string; description: string | null };
type Overview = { clients: Client[]; questionnaires: Template[] };

function useOverview() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState("");
  const reload = () =>
    api<Overview>("admin/overview")
      .then(setData)
      .catch((e) => setError(e.message));
  useEffect(() => {
    reload();
  }, []);
  return { data, error, reload };
}

export default function AdminPage({ clientId }: { clientId?: string }) {
  const { data, error, reload } = useOverview();
  if (error) return <ErrorNote>{error}</ErrorNote>;
  if (!data) return <Loading />;

  if (clientId) {
    const client = data.clients.find((c) => c.id === clientId);
    if (!client) return <ErrorNote>Client introuvable.</ErrorNote>;
    return <ClientDetail client={client} templates={data.questionnaires} onChange={reload} />;
  }
  return <ClientList clients={data.clients} />;
}

function ClientList({ clients }: { clients: Client[] }) {
  const toSend = clients.filter((c) => c.assignments.length === 0).length;
  const toRead = clients.filter((c) => c.assignments.some((a) => a.status === "submitted")).length;

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-brand-blue-900">Clients</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Comptes clients" value={clients.length} />
        <Stat label="Sans questionnaire" value={toSend} hint={toSend ? "à qui envoyer un questionnaire" : undefined} />
        <Stat label="Avec réponses reçues" value={toRead} />
      </div>

      {clients.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
          Aucun client inscrit pour l'instant. Les clients créent leur compte depuis{" "}
          <a href="#/espace" className="font-medium text-brand-blue-700 hover:underline">
            l'espace client
          </a>
          .
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl bg-white shadow-sm">
          {clients.map((c) => {
            const last = c.assignments[0];
            return (
              <li key={c.id}>
                <a href={`#/admin/client/${c.id}`} className="flex flex-col gap-2 px-6 py-4 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-brand-blue-900">
                      {c.name}
                      {c.company && <span className="font-normal text-gray-500"> · {c.company}</span>}
                    </p>
                    <p className="text-sm text-gray-500">
                      {c.email} · inscrit le {formatDate(c.created_at)}
                    </p>
                  </div>
                  {last ? (
                    <StatusBadge className={statusStyle[last.status]}>{statusLabel[last.status]}</StatusBadge>
                  ) : (
                    <span className="text-sm font-medium text-brand-red-700">Questionnaire à envoyer →</span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

function Stat({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-brand-blue-900">{value}</p>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

function ClientDetail({ client, templates, onChange }: { client: Client; templates: Template[]; onChange: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setBusy(true);
    setError("");
    setSent(false);
    try {
      await api("assignments", { body: { userId: client.id, questionnaireId: f.get("questionnaireId"), message: f.get("message") } });
      form.reset();
      setSent(true);
      onChange();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <a href="#/admin" className="mb-6 inline-block text-sm font-medium text-brand-blue-700 hover:underline">
        ← Tous les clients
      </a>

      <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-brand-blue-900">{client.name}</h1>
        {client.company && <p className="text-gray-700">{client.company}</p>}
        <p className="mt-2 text-sm text-gray-500">
          <a href={`mailto:${client.email}`} className="hover:underline">
            {client.email}
          </a>
          {client.phone && (
            <>
              {" · "}
              <a href={`tel:${client.phone}`} className="hover:underline">
                {client.phone}
              </a>
            </>
          )}
          {" · "}inscrit le {formatDate(client.created_at)}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-5">
        <section className="md:col-span-3">
          <h2 className="mb-4 text-lg font-semibold text-brand-blue-900">Questionnaires envoyés</h2>
          {client.assignments.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-gray-600">Aucun pour l'instant.</p>
          ) : (
            <ul className="grid gap-3">
              {client.assignments.map((a) => (
                <li key={a.id}>
                  <a href={`#/espace/questionnaire/${a.id}`} className="flex items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md">
                    <div>
                      <p className="font-semibold text-brand-blue-900">{a.title}</p>
                      <p className="text-sm text-gray-500">
                        Envoyé le {formatDate(a.sent_at)}
                        {a.submitted_at && ` · répondu le ${formatDate(a.submitted_at)}`}
                      </p>
                    </div>
                    <StatusBadge className={statusStyle[a.status]}>{statusLabel[a.status]}</StatusBadge>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="md:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-brand-blue-900">Envoyer un questionnaire</h2>
          <form onSubmit={send} className="grid gap-4 rounded-2xl bg-white p-6 shadow-sm">
            <label className="grid gap-2 text-sm font-medium text-gray-700">
              Questionnaire
              <select name="questionnaireId" required className={inputClass}>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-gray-700">
              Message au client (facultatif)
              <textarea
                name="message"
                rows={4}
                className={inputClass}
                placeholder={`Bonjour ${client.name.split(" ")[0]}, merci pour votre inscription. Ce questionnaire nous aidera à préparer notre premier échange.`}
              />
            </label>
            {error && <ErrorNote>{error}</ErrorNote>}
            {sent && <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Envoyé. Le client le voit dans son espace.</p>}
            <button type="submit" disabled={busy || templates.length === 0} className={primaryButton}>
              {busy ? "Envoi…" : "Envoyer"}
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
