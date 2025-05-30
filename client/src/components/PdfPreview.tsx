import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PdfPreviewProps {
  pdfUrl: string;
  altText: string;
  className?: string;
}

const PdfPreview = ({ pdfUrl, altText, className = "" }: PdfPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderPdfPreview = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        // Load the PDF document
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        
        // Get the first page
        const page = await pdf.getPage(1);
        
        // Set canvas dimensions to match the desired display size
        const viewport = page.getViewport({ scale: 1 });
        const scale = Math.min(400 / viewport.width, 240 / viewport.height);
        const scaledViewport = page.getViewport({ scale });
        
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        
        // Render the page
        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport,
        };
        
        await page.render(renderContext).promise;
        setIsLoading(false);
      } catch (err) {
        console.error('Error rendering PDF preview:', err);
        setError('Impossible de charger l\'aperçu du PDF');
        setIsLoading(false);
      }
    };

    renderPdfPreview();
  }, [pdfUrl]);

  if (error) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <i className="fas fa-file-pdf text-red-500 text-3xl mb-2"></i>
          <p className="text-sm text-gray-600">Aperçu PDF indisponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Chargement...</p>
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        aria-label={altText}
      />
      {!isLoading && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
          PDF
        </div>
      )}
    </div>
  );
};

export default PdfPreview;