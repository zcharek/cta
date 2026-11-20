import type { ReactNode } from "react";
import type { User } from "./api";

export function StatusBadge({ className, children }: { className: string; children: ReactNode }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${className}`}>{children}</span>;
}

export function Shell({ user, onLogout, children }: { user?: User | null; onLogout?: () => void; children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <a href="#" aria-label="Retour au site Central Test Agency" className="flex items-center gap-3">
            <img src="/images/logo-dark-horizontal.svg" alt="Central Test Agency" className="h-9 w-auto" />
            <span className="hidden border-l border-gray-200 pl-3 text-sm font-medium text-gray-500 sm:inline">
              {user?.role === "admin" ? "Administration" : "Espace client"}
            </span>
          </a>
          {user && (
            <div className="flex items-center gap-4 text-sm">
              {user.role === "admin" && (
                <a href="#/admin" className="font-medium text-brand-blue-700 hover:underline">
                  Clients
                </a>
              )}
              <span className="hidden text-gray-500 md:inline">{user.email}</span>
              <button onClick={onLogout} className="font-medium text-gray-700 hover:text-brand-blue-700">
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">{children}</main>
      <footer className="py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Central Test Agency ·{" "}
        <a href="#/legal" className="hover:text-gray-600">
          Mentions légales
        </a>
      </footer>
    </div>
  );
}

export function Loading() {
  return <p className="py-20 text-center text-gray-500">Chargement…</p>;
}

export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
      {children}
    </p>
  );
}
