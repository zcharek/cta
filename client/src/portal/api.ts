export type User = { id: string; email: string; name: string; company: string | null; role: "client" | "admin" };

export type Status = "sent" | "in_progress" | "submitted";

export type Question = {
  id: string;
  label: string;
  help?: string;
  type: "text" | "textarea" | "single" | "multi";
  required?: boolean;
  options?: string[];
};

export type Section = {
  id: string;
  title: string;
  showIf?: { question: string; includes: string };
  questions: Question[];
};

export type Answers = Record<string, string | string[]>;

export type AssignmentSummary = {
  id: string;
  title: string;
  message: string | null;
  status: Status;
  sent_at: string;
  updated_at?: string;
  submitted_at: string | null;
};

export type Assignment = AssignmentSummary & {
  user_id: string;
  questionnaire_snapshot: { description?: string; sections: Section[] };
  answers: Answers;
  client_name: string;
  client_email: string;
  client_company: string | null;
};

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function api<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const res = await fetch(`/api/${path}`, {
    method: init.method ?? (init.body ? "POST" : "GET"),
    headers: init.body ? { "Content-Type": "application/json" } : undefined,
    body: init.body ? JSON.stringify(init.body) : undefined,
    credentials: "same-origin",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.error ?? "Une erreur est survenue. Réessayez.");
  return data as T;
}

/** Une section conditionnelle n'apparaît que si la réponse ciblée contient la valeur attendue. */
export function visibleSections(sections: Section[], answers: Answers) {
  return sections.filter((s) => {
    if (!s.showIf) return true;
    const a = answers[s.showIf.question];
    return Array.isArray(a) ? a.includes(s.showIf.includes) : a === s.showIf.includes;
  });
}

export function isAnswered(a: Answers[string] | undefined) {
  return Array.isArray(a) ? a.length > 0 : !!a?.trim();
}

export const statusLabel: Record<Status, string> = {
  sent: "À compléter",
  in_progress: "En cours",
  submitted: "Envoyé",
};

export const statusStyle: Record<Status, string> = {
  sent: "bg-brand-red-700/10 text-brand-red-700",
  in_progress: "bg-amber-100 text-amber-800",
  submitted: "bg-emerald-100 text-emerald-800",
};

export function formatDate(iso: string | null | undefined) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export const inputClass =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-brand-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue-100";

export const primaryButton =
  "rounded-lg bg-brand-blue-900 px-5 py-3 font-semibold text-white transition hover:bg-brand-blue-700 disabled:cursor-not-allowed disabled:opacity-60";

export const secondaryButton =
  "rounded-lg border border-gray-200 bg-white px-5 py-3 font-semibold text-brand-blue-900 transition hover:bg-gray-50 disabled:opacity-60";
