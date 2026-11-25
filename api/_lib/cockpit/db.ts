import { neon } from "@neondatabase/serverless";

// Requête SQL paramétrée en « tagged template ». Les tests branchent ici un Postgres en mémoire.
// Conventions : les dates sont renvoyées en texte (::text) et les comptes en entiers (::int),
// pour obtenir les mêmes types quel que soit le pilote.
export type Ligne = Record<string, any>;
export type Sql = (strings: TemplateStringsArray, ...values: unknown[]) => Promise<Ligne[]>;

let impl: Sql | null = null;

export function brancherSql(s: Sql | null) {
  impl = s;
}

export const sql: Sql = (strings, ...values) => {
  impl ??= neon(process.env.DATABASE_URL!) as unknown as Sql;
  return impl(strings, ...values);
};
