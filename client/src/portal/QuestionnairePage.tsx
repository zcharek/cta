import { useEffect, useRef, useState } from "react";
import {
  api,
  formatDate,
  inputClass,
  isAnswered,
  primaryButton,
  secondaryButton,
  statusLabel,
  statusStyle,
  visibleSections,
  type Answers,
  type Assignment,
  type Question,
  type User,
} from "./api";
import { ErrorNote, Loading, StatusBadge } from "./Shell";

type SaveState = "idle" | "saving" | "saved" | "error";

export default function QuestionnairePage({ id, user }: { id: string; user: User }) {
  const [data, setData] = useState<Assignment | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [missing, setMissing] = useState<string[]>([]);
  const [save, setSave] = useState<SaveState>("idle");
  const [submitting, setSubmitting] = useState(false);
  const dirty = useRef(false);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api<{ assignment: Assignment }>(`assignments/${id}`)
      .then(({ assignment }) => {
        setData(assignment);
        setAnswers(assignment.answers ?? {});
      })
      .catch((e) => setError(e.message));
  }, [id]);

  const readOnly = !data || data.status === "submitted" || user.role === "admin";
  const sections = data ? visibleSections(data.questionnaire_snapshot.sections, answers) : [];
  const current = sections[Math.min(step, sections.length - 1)];
  const isLast = step >= sections.length - 1;

  // Sauvegarde automatique 1,2 s après la dernière modification.
  useEffect(() => {
    if (readOnly || !dirty.current) return;
    const t = setTimeout(async () => {
      setSave("saving");
      try {
        await api(`assignments/${id}`, { method: "PATCH", body: { answers } });
        dirty.current = false;
        setSave("saved");
      } catch {
        setSave("error");
      }
    }, 1200);
    return () => clearTimeout(t);
  }, [answers, id, readOnly]);

  function set(qid: string, value: string | string[]) {
    dirty.current = true;
    setMissing((m) => m.filter((x) => x !== qid));
    setAnswers((a) => ({ ...a, [qid]: value }));
  }

  function missingIn(qs: Question[]) {
    return qs.filter((q) => q.required && !isAnswered(answers[q.id])).map((q) => q.id);
  }

  function go(next: number) {
    setStep(next);
    setMissing([]);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function next() {
    const m = missingIn(current.questions);
    if (m.length) return setMissing(m);
    go(step + 1);
  }

  async function submit() {
    const m = missingIn(current.questions);
    if (m.length) return setMissing(m);
    // Revérifie toutes les sections visibles (une réponse obligatoire a pu être effacée en revenant en arrière).
    const firstIncomplete = sections.findIndex((s) => missingIn(s.questions).length);
    if (firstIncomplete !== -1) {
      go(firstIncomplete);
      setMissing(missingIn(sections[firstIncomplete].questions));
      return;
    }
    if (!confirm("Envoyer vos réponses ? Vous ne pourrez plus les modifier ensuite.")) return;

    // N'envoie que les réponses des sections affichées (une section décochée entre-temps est ignorée).
    const kept: Answers = {};
    for (const s of sections) for (const q of s.questions) if (isAnswered(answers[q.id])) kept[q.id] = answers[q.id];

    setSubmitting(true);
    setError("");
    try {
      await api(`assignments/${id}`, { method: "PATCH", body: { answers: kept, submit: true } });
      dirty.current = false;
      setData({ ...data!, status: "submitted", submitted_at: new Date().toISOString() });
      setAnswers(kept);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (error && !data) return <ErrorNote>{error}</ErrorNote>;
  if (!data) return <Loading />;

  const backHref = user.role === "admin" ? `#/admin/client/${data.user_id}` : "#/espace";

  return (
    <div ref={topRef} className="scroll-mt-6">
      <a href={backHref} className="mb-6 inline-block text-sm font-medium text-brand-blue-700 hover:underline">
        ← {user.role === "admin" ? `Retour à ${data.client_name}` : "Retour à mon espace"}
      </a>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold text-brand-blue-900">{data.title}</h1>
        <StatusBadge className={statusStyle[data.status]}>{statusLabel[data.status]}</StatusBadge>
      </div>

      {readOnly ? (
        <ReadOnlyAnswers data={data} answers={answers} isAdmin={user.role === "admin"} />
      ) : (
        <>
          {step === 0 && data.questionnaire_snapshot.description && (
            <p className="mb-6 max-w-2xl text-gray-600">{data.questionnaire_snapshot.description}</p>
          )}

          {/* Progression */}
          <div className="mb-6">
            <div className="mb-2 flex justify-between text-sm text-gray-500">
              <span>
                Étape {step + 1} sur {sections.length}
              </span>
              <span aria-live="polite">
                {save === "saving" && "Enregistrement…"}
                {save === "saved" && "Enregistré ✓"}
                {save === "error" && <span className="text-red-600">Échec de l'enregistrement, vérifiez votre connexion</span>}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full rounded-full bg-brand-blue-600 transition-all" style={{ width: `${((step + 1) / sections.length) * 100}%` }} />
            </div>
          </div>

          <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-6 text-xl font-semibold text-brand-blue-900">{current.title}</h2>
            <div className="grid gap-8">
              {current.questions.map((q) => (
                <Field key={q.id} q={q} value={answers[q.id]} onChange={(v) => set(q.id, v)} invalid={missing.includes(q.id)} />
              ))}
            </div>
          </section>

          {missing.length > 0 && (
            <div className="mt-4">
              <ErrorNote>Merci de répondre aux questions marquées d'un astérisque.</ErrorNote>
            </div>
          )}
          {error && (
            <div className="mt-4">
              <ErrorNote>{error}</ErrorNote>
            </div>
          )}

          <div className="mt-6 flex justify-between gap-4">
            <button onClick={() => go(step - 1)} disabled={step === 0} className={`${secondaryButton} ${step === 0 ? "invisible" : ""}`}>
              Précédent
            </button>
            {isLast ? (
              <button onClick={submit} disabled={submitting} className={primaryButton}>
                {submitting ? "Envoi…" : "Envoyer mes réponses"}
              </button>
            ) : (
              <button onClick={next} className={primaryButton}>
                Suivant
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Field({ q, value, onChange, invalid }: { q: Question; value: Answers[string] | undefined; onChange: (v: string | string[]) => void; invalid: boolean }) {
  const labelId = `q-${q.id}`;
  const label = (
    <div className="mb-3">
      <p id={labelId} className="font-medium text-gray-900">
        {q.label}
        {q.required && <span className="ml-1 text-brand-red-700">*</span>}
      </p>
      {q.help && <p className="mt-1 text-sm text-gray-500">{q.help}</p>}
    </div>
  );
  const border = invalid ? "ring-2 ring-red-300 rounded-lg" : "";

  if (q.type === "text" || q.type === "textarea") {
    const props = {
      "aria-labelledby": labelId,
      "aria-invalid": invalid,
      value: (value as string) ?? "",
      onChange: (e: { target: { value: string } }) => onChange(e.target.value),
      className: `${inputClass} ${invalid ? "border-red-300" : ""}`,
    };
    return (
      <div>
        {label}
        {q.type === "text" ? <input {...props} /> : <textarea rows={4} {...props} />}
      </div>
    );
  }

  const multi = q.type === "multi";
  const selected = multi ? ((value as string[]) ?? []) : value;
  const toggle = (opt: string) => {
    if (!multi) return onChange(opt);
    const arr = selected as string[];
    onChange(arr.includes(opt) ? arr.filter((o) => o !== opt) : [...arr, opt]);
  };

  return (
    <fieldset aria-labelledby={labelId} className={border}>
      {label}
      <div className="grid gap-2 sm:grid-cols-2">
        {q.options!.map((opt) => {
          const on = multi ? (selected as string[]).includes(opt) : selected === opt;
          return (
            <label
              key={opt}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition ${
                on ? "border-brand-blue-600 bg-brand-blue-50 text-brand-blue-900" : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              }`}
            >
              <input
                type={multi ? "checkbox" : "radio"}
                name={q.id}
                checked={on}
                onChange={() => toggle(opt)}
                className="h-4 w-4 accent-brand-blue-600"
              />
              {opt}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function ReadOnlyAnswers({ data, answers, isAdmin }: { data: Assignment; answers: Answers; isAdmin: boolean }) {
  const sections = visibleSections(data.questionnaire_snapshot.sections, answers);
  return (
    <>
      {isAdmin ? (
        <div className="mb-6 rounded-2xl bg-white p-6 text-sm shadow-sm">
          <p className="font-semibold text-brand-blue-900">
            {data.client_name}
            {data.client_company ? ` · ${data.client_company}` : ""}
          </p>
          <p className="text-gray-500">
            <a href={`mailto:${data.client_email}`} className="hover:underline">
              {data.client_email}
            </a>{" "}
            · envoyé le {formatDate(data.sent_at)}
            {data.submitted_at ? ` · répondu le ${formatDate(data.submitted_at)}` : ""}
          </p>
          {data.status !== "submitted" && (
            <p className="mt-2 text-amber-700">Le client n'a pas encore envoyé ses réponses. Vous voyez son brouillon.</p>
          )}
        </div>
      ) : (
        <div className="mb-6 rounded-2xl bg-emerald-50 p-6 text-emerald-900">
          <p className="font-semibold">Merci, vos réponses ont bien été envoyées le {formatDate(data.submitted_at)}.</p>
          <p className="text-sm">Nous revenons vers vous rapidement pour en discuter.</p>
        </div>
      )}

      <div className="grid gap-6">
        {sections.map((s) => (
          <section key={s.id} className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-brand-blue-900">{s.title}</h2>
            <dl className="grid gap-4">
              {s.questions.map((q) => {
                const a = answers[q.id];
                return (
                  <div key={q.id}>
                    <dt className="text-sm text-gray-500">{q.label}</dt>
                    <dd className="mt-1 whitespace-pre-line text-gray-900">
                      {isAnswered(a) ? (Array.isArray(a) ? a.join(" · ") : a) : <span className="text-gray-400">Sans réponse</span>}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </section>
        ))}
      </div>
    </>
  );
}
