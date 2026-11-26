// Lecture du texte d'un PDF (pdf.js), reconstitué ligne par ligne : base de la détection automatique.
// Les PDF scannés (images) n'ont pas de texte : on renvoie alors une liste vide.

type ElementTexte = { str: string; transform: number[]; width?: number };
type PdfJs = {
  getDocument: (src: { data: Uint8Array; isEvalSupported?: boolean; useSystemFonts?: boolean }) => {
    promise: Promise<{ numPages: number; getPage: (n: number) => Promise<{ getTextContent: () => Promise<{ items: unknown[] }> }>; destroy: () => Promise<void> }>;
  };
};

/** Lignes de texte des premières pages, de haut en bas et de gauche à droite. */
export async function lignesPdf(pdfjs: PdfJs, octets: Uint8Array, pagesMax = 4): Promise<string[]> {
  const doc = await pdfjs.getDocument({ data: octets, isEvalSupported: false }).promise;
  const lignes: string[] = [];
  try {
    for (let n = 1; n <= Math.min(doc.numPages, pagesMax); n++) {
      const page = await doc.getPage(n);
      const { items } = await page.getTextContent();
      const elements = (items as ElementTexte[]).filter((i) => typeof i.str === "string" && i.str.trim());
      // Regroupe les éléments d'une même ligne (même ordonnée, à 3 points près)
      const rangs: { y: number; el: ElementTexte[] }[] = [];
      for (const e of elements) {
        const y = e.transform[5]!;
        const rang = rangs.find((r) => Math.abs(r.y - y) <= 3);
        if (rang) rang.el.push(e);
        else rangs.push({ y, el: [e] });
      }
      rangs.sort((a, b) => b.y - a.y);
      for (const r of rangs) {
        r.el.sort((a, b) => a.transform[4]! - b.transform[4]!);
        lignes.push(
          r.el
            .map((e) => e.str)
            .join(" ")
            .replace(/\s+/g, " ")
            .trim(),
        );
      }
    }
  } finally {
    await doc.destroy();
  }
  return lignes;
}
