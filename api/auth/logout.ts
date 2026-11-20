import { clearCookie, json } from "../_lib/http.js";

export function POST() {
  return json({ ok: true }, { headers: { "Set-Cookie": clearCookie() } });
}
