import { m } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import * as pdfjsLib from 'pdfjs-dist';

interface CaseStudyCardProps {
  title: string;
  description: string;
  image: string;
  altText: string;
  category: string;
  readTime: string;
  pdf?: string;
}

const CaseStudyCard = ({
  title,
  description,
  image,
  altText,
  category,
  readTime,
  pdf,
}: CaseStudyCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Set up PDF.js worker
  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }, []);

  const generatePdfPreview = async (pdfUrl: string) => {
    if (!canvasRef.current) return;
    
    setLoadingPreview(true);
    try {
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1); // Get first page
      
      const scale = 1.5;
      const viewport = page.getViewport({ scale });
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      // Convert canvas to image URL
      const imageUrl = canvas.toDataURL('image/png');
      setPdfPreview(imageUrl);
    } catch (error) {
      console.error('Error generating PDF preview:', error);
    }
    setLoadingPreview(false);
  };

  const openModal = () => {
    if (pdf) {
      setIsModalOpen(true);
      if (!pdfPreview) {
        generatePdfPreview(pdf.startsWith("/") ? pdf : `/${pdf}`);
      }
    } else {
      alert("Case study details will be available after deployment.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group h-full">
        <div className="relative h-64 overflow-hidden">
          <img
            src={image}
            alt={altText}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-primary/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <m.a
              href="#"
              className="px-6 py-3 bg-white text-primary rounded-md font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                openModal();
              }}
            >
              View Case Study
            </m.a>
          </div>
        </div>
        <div className="p-6">
          <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-4">
            {category}
          </span>
          <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-primary">
              <m.a
                href="#"
                className="font-medium hover:underline flex items-center"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                onClick={(e) => {
                  e.preventDefault();
                  openModal();
                }}
              >
                Read More
                <i className="fas fa-arrow-right ml-2 group-hover:ml-3 transition-all duration-300"></i>
              </m.a>
            </div>
            <div className="text-gray-500 text-sm">
              <i className="far fa-clock mr-1"></i> {readTime}
            </div>
          </div>
        </div>
      </div>

      {/* Modal PDF Viewer */}
      {isModalOpen && pdf && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold p-1"
                onClick={closeModal}
                aria-label="Close PDF viewer"
              >
                &times;
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* PDF Preview Section */}
                <div className="lg:w-1/2">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Preview</h4>
                  <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[300px] flex items-center justify-center">
                    {loadingPreview ? (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3"></div>
                        <p className="text-gray-600">Loading preview...</p>
                      </div>
                    ) : pdfPreview ? (
                      <img
                        src={pdfPreview}
                        alt={`Preview of ${title}`}
                        className="max-w-full max-h-[400px] object-contain rounded shadow-md"
                      />
                    ) : (
                      <div className="text-center">
                        <i className="fas fa-file-pdf text-red-500 text-4xl mb-3"></i>
                        <p className="text-gray-600">PDF preview loading...</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Document Info Section */}
                <div className="lg:w-1/2">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Case Study Document</h4>
                  <p className="text-gray-600 mb-4">
                    View our detailed case study analysis and findings for {title}.
                  </p>
                  
                  <div className="space-y-3">
                    <a
                      href={pdf.startsWith("/") ? pdf : `/${pdf}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium w-full text-center"
                    >
                      <i className="fas fa-external-link-alt mr-2"></i>
                      Open Full PDF
                    </a>
                    
                    <a
                      href={pdf.startsWith("/") ? pdf : `/${pdf}`}
                      download
                      className="inline-block px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors duration-200 font-medium w-full text-center"
                    >
                      <i className="fas fa-download mr-2"></i>
                      Download PDF
                    </a>
                    
                    <div className="text-sm text-gray-500 text-center">
                      <p>Click to open the complete document in a new tab</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hidden canvas for PDF rendering */}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      )}
    </>
  );
};

export default CaseStudyCard;
