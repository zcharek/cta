import { useState, type FormEvent } from "react";
import { api, inputClass, primaryButton, type User } from "./api";
import { ErrorNote } from "./Shell";

export default function AuthPage({ onAuth }: { onAuth: (user: User) => void }) {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const body = Object.fromEntries(new FormData(e.currentTarget));
    try {
      await api(`auth/${mode}`, { body });
      const { user } = await api<{ user: User }>("auth/me");
      onAuth(user);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const tab = (m: typeof mode, label: string) => (
    <button
      type="button"
      onClick={() => {
        setMode(m);
        setError("");
      }}
      aria-pressed={mode === m}
      className={`flex-1 rounded-md py-2 text-sm font-semibold transition ${
        mode === m ? "bg-white text-brand-blue-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="mx-auto grid max-w-4xl items-start gap-10 md:grid-cols-2">
      <div className="md:pt-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-red-700">Espace client</p>
        <h1 className="mb-4 text-3xl font-bold text-brand-blue-900">Suivez votre projet avec Central Test Agency</h1>
        <p className="mb-6 text-gray-600">
          Créez votre compte pour accéder à votre espace. Nous vous y enverrons un questionnaire de cadrage pour bien
          comprendre votre besoin avant notre premier échange.
        </p>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Vos questionnaires au même endroit</li>
          <li>• Réponses enregistrées automatiquement</li>
          <li>• Reprenez où vous vous êtes arrêté</li>
        </ul>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex gap-1 rounded-lg bg-gray-100 p-1">
          {tab("signup", "Créer un compte")}
          {tab("login", "Se connecter")}
        </div>

        <form onSubmit={submit} className="grid gap-4">
          {mode === "signup" && (
            <>
              <input name="name" required placeholder="Nom et prénom" aria-label="Nom et prénom" autoComplete="name" className={inputClass} />
              <input name="company" placeholder="Entreprise" aria-label="Entreprise" autoComplete="organization" className={inputClass} />
              <input name="phone" type="tel" placeholder="Téléphone (facultatif)" aria-label="Téléphone" autoComplete="tel" className={inputClass} />
            </>
          )}
          <input name="email" type="email" required placeholder="Email professionnel" aria-label="Email" autoComplete="email" className={inputClass} />
          <input
            name="password"
            type="password"
            required
            minLength={mode === "signup" ? 8 : undefined}
            placeholder={mode === "signup" ? "Mot de passe (8 caractères minimum)" : "Mot de passe"}
            aria-label="Mot de passe"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            className={inputClass}
          />
          {error && <ErrorNote>{error}</ErrorNote>}
          <button type="submit" disabled={busy} className={primaryButton}>
            {busy ? "Un instant…" : mode === "signup" ? "Créer mon compte" : "Se connecter"}
          </button>
          {mode === "login" && (
            <p className="text-center text-xs text-gray-500">
              Mot de passe oublié ? Écrivez-nous à{" "}
              <a href="mailto:centraltestagency@gmail.com" className="text-brand-blue-700 hover:underline">
                centraltestagency@gmail.com
              </a>
              .
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
