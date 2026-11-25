import { traiter } from "./_lib/cockpit/app.js";

// Point d'entrée unique de l'API Cockpit : /api/cockpit/<chemin> est réécrit ici par vercel.json.
// Une seule fonction serverless pour toutes les routes (limite de 12 fonctions sur le plan Hobby).
export const GET = traiter;
export const POST = traiter;
export const PUT = traiter;
export const PATCH = traiter;
export const DELETE = traiter;
