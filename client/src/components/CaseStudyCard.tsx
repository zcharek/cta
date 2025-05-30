import { m } from "framer-motion";
import { useState } from "react";

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
    console.log("openModal called, pdf:", pdf);
    if (pdf) {
      console.log("Setting modal open to true");
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
      <div className="modern-card overflow-hidden group h-full">
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={altText}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out will-change-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/70 to-secondary/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out backdrop-blur-sm">
            <button
              className="btn-modern px-6 py-3 bg-white text-primary hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
              onClick={openModal}
            >
              View Case Study
            </button>
          </div>
        </div>
        <div className="p-4">
          <span className="inline-block px-2 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium mb-3">
            {category}
          </span>
          <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">{description}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-primary">
              <button
                className="font-medium hover:underline flex items-center hover:translate-x-1 transition-all duration-200"
                onClick={openModal}
              >
                Read More
                <i className="fas fa-arrow-right ml-2 group-hover:ml-3 transition-all duration-300"></i>
              </button>
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

            {/* PDF Viewer */}
            <div className="flex-1 bg-gray-100">
              <iframe
                src={`${pdf.startsWith("/") ? pdf : `/${pdf}`}#toolbar=1&navpanes=1&scrollbar=1&zoom=page-fit`}
                title={`Case Study PDF - ${title}`}
                className="w-full h-[70vh] border-0"
                allow="fullscreen"
              />
            </div>
            
            {/* Fallback link */}
            <div className="p-4 bg-gray-50 border-t text-center">
              <a
                href={pdf.startsWith("/") ? pdf : `/${pdf}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 font-medium text-sm"
              >
                <i className="fas fa-external-link-alt mr-1"></i>
                Open in new tab if PDF doesn't display properly
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CaseStudyCard;