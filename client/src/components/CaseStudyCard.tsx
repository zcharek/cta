import { m } from "framer-motion";
import { useState } from "react";
import PdfPreview from "./PdfPreview";

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

  const openModal = () => {
    if (pdf) {
      setIsModalOpen(true);
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
          {pdf ? (
            <PdfPreview
              pdfUrl={pdf}
              altText={altText}
              className="w-full h-full"
            />
          ) : (
            <img
              src={image}
              alt={altText}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
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

            <div className="p-6 text-center bg-gray-50">
              <div className="mb-4">
                <i className="fas fa-file-pdf text-red-500 text-4xl mb-3"></i>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Case Study Document</h4>
                <p className="text-gray-600 mb-4">
                  View our detailed case study analysis and findings.
                </p>
              </div>
              
              <div className="space-y-3">
                <a
                  href={pdf.startsWith("/") ? pdf : `/${pdf}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium"
                >
                  <i className="fas fa-external-link-alt mr-2"></i>
                  Open PDF in New Tab
                </a>
                
                <div className="text-sm text-gray-500">
                  <p>The PDF will open in a new browser tab for the best viewing experience.</p>
                </div>
              </div>
            </div>

            {/* Try to embed PDF with better fallback */}
            <div className="hidden">
              <iframe
                src={`${pdf.startsWith("/") ? pdf : `/${pdf}`}#toolbar=1&navpanes=0&scrollbar=1`}
                title={`Case Study PDF - ${title}`}
                className="w-full h-[70vh]"
                frameBorder="0"
                onLoad={(e) => {
                  // If iframe loads successfully, show it
                  const iframe = e.target as HTMLIFrameElement;
                  const container = iframe.parentElement;
                  if (container) {
                    container.classList.remove('hidden');
                    const fallback = container.previousElementSibling;
                    if (fallback) {
                      (fallback as HTMLElement).style.display = 'none';
                    }
                  }
                }}
                onError={() => {
                  // Keep fallback visible if iframe fails
                  console.log('PDF iframe failed to load, showing fallback');
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CaseStudyCard;
