import { useState, useEffect, useRef, useCallback } from "react";

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
  const scrollPositionRef = useRef(0);

  const openModal = () => {
    if (pdf) {
      scrollPositionRef.current = window.scrollY;
      setIsModalOpen(true);
    } else {
      alert("Case study details will be available after deployment.");
    }
  };

  const handleClose = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(false);
  }, []);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.body.style.userSelect = "none";
      document.body.style.pointerEvents = "none";
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.userSelect = "";
      document.body.style.pointerEvents = "";

      setTimeout(() => {
        window.scrollTo(0, scrollPositionRef.current);
      }, 0);
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.userSelect = "";
      document.body.style.pointerEvents = "";
    };
  }, [isModalOpen]);

  return (
    <>
      <div
        className="modern-card overflow-hidden group h-full cursor-pointer"
        onClick={openModal}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={altText}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out will-change-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/70 to-secondary/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out backdrop-blur-sm">
            <div className="btn-modern px-6 py-3 bg-white text-primary hover:scale-105 hover:-translate-y-0.5 transition-all duration-200">
              Lire plus
            </div>
          </div>
        </div>
        <div className="p-4 flex flex-col h-full">
          <span className="inline-block px-2 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium mb-3">
            {category}
          </span>
          <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-3 flex-grow">
            {description}
          </p>
          <div className="text-gray-500 text-sm text-right">
            <i className="far fa-clock mr-1"></i> {readTime}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={handleBackdropClick}
          style={{ pointerEvents: "auto" }}
        >
          <div
            className="bg-white rounded-xl sm:rounded-2xl max-w-7xl w-full h-[95vh] sm:h-[90vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ pointerEvents: "auto", userSelect: "auto" }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {category} • {readTime}
                </p>
              </div>
              <button
                onClick={handleClose}
                aria-label="Fermer la modale"
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg ml-4 flex-shrink-0 z-50 cursor-pointer bg-black bg-opacity-20 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-30"
              >
                <i className="fas fa-times text-lg sm:text-xl"></i>
              </button>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 bg-gray-50">
              {pdf ? (
                <iframe
                  src={`${pdf.startsWith("/") ? pdf : `/${pdf}`}#toolbar=1&navpanes=0&scrollbar=0&zoom=page-width&view=FitH&pagemode=none`}
                  title={`Case Study PDF - ${title}`}
                  className="w-full h-full border-0"
                  allow="fullscreen"
                  style={{
                    overflowX: "auto",
                    overflowY: "hidden",
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <i className="fas fa-file-pdf text-gray-400 text-4xl sm:text-6xl mb-4"></i>
                    <p className="text-gray-600 text-sm sm:text-base">
                      No PDF available for this case study.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CaseStudyCard;
