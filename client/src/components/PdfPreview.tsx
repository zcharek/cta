"use client";

import { useEffect, useState } from "react";
import { getDocument } from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";

interface PdfPreviewProps {
  pdfUrl: string;
  altText?: string;
  className?: string;
}

export default function PdfPreview({
  pdfUrl,
  altText,
  className,
}: PdfPreviewProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const renderPdf = async () => {
      try {
        const loadingTask = getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        const dataUrl = canvas.toDataURL("image/png");
        setImageUrl(dataUrl);
      } catch (error) {
        console.error("Erreur de rendu PDF :", error);
      }
    };

    renderPdf();
  }, [pdfUrl]);

  return imageUrl ? (
    <img src={imageUrl} alt={altText || "Aperçu PDF"} className={className} />
  ) : (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
      Chargement...
    </div>
  );
}
