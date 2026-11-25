import { afterEach, describe, expect, it, vi } from "vitest";
import { emailInvitation, envoyerParResend } from "../../api/_lib/cockpit/emails";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

function capturerEnvoi() {
  const appels: { url: string; corps: Record<string, unknown>; auth: string }[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init: RequestInit) => {
      appels.push({ url, corps: JSON.parse(String(init.body)), auth: (init.headers as Record<string, string>).Authorization });
      return new Response(JSON.stringify({ id: "x" }), { status: 200 });
    }),
  );
  return appels;
}

describe("envoi par Resend", () => {
  const mail = emailInvitation("yasmine@cta.test", "Yasmine Belkacem", "Charek", "https://www.centraltestagency.com/cockpit/definir-mot-de-passe?jeton=abc");

  it("envoie depuis EMAIL_FROM avec les réponses vers EMAIL_REPLY_TO", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("EMAIL_FROM", "Cockpit CTA <cockpit@centraltestagency.com>");
    vi.stubEnv("EMAIL_REPLY_TO", "centraltestagency@gmail.com");
    const appels = capturerEnvoi();
    await envoyerParResend(mail);
    expect(appels).toHaveLength(1);
    expect(appels[0]!.url).toBe("https://api.resend.com/emails");
    expect(appels[0]!.auth).toBe("Bearer re_test");
    expect(appels[0]!.corps).toMatchObject({
      from: "Cockpit CTA <cockpit@centraltestagency.com>",
      to: ["yasmine@cta.test"],
      reply_to: "centraltestagency@gmail.com",
      subject: "Votre accès à Cockpit – Central Test Agency",
    });
  });

  it("sans EMAIL_REPLY_TO, pas d'adresse de réponse", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("EMAIL_REPLY_TO", "");
    const appels = capturerEnvoi();
    await envoyerParResend(mail);
    expect(appels[0]!.corps).not.toHaveProperty("reply_to");
  });

  it("un refus de Resend devient une erreur lisible", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubGlobal("fetch", vi.fn(async () => new Response("domain not verified", { status: 403 })));
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(envoyerParResend(mail)).rejects.toThrow("L'e-mail n'a pas pu être envoyé");
  });
});
