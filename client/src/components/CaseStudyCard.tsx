import { useState, useEffect, useRef } from "react";

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
      // Sauvegarder la position de scroll avant d'ouvrir la modal
      scrollPositionRef.current = window.scrollY;
      setIsModalOpen(true);
    } else {
      alert("Case study details will be available after deployment.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Empêcher le scroll et la sélection du body quand la modal est ouverte
  useEffect(() => {
    if (isModalOpen) {
      // Bloquer le scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.body.style.userSelect = 'none';
      document.body.style.pointerEvents = 'none';
    } else {
      // Restaurer le scroll normal
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.userSelect = '';
      document.body.style.pointerEvents = '';
      
      // Restaurer la position de scroll exacte avec un petit délai
      setTimeout(() => {
        window.scrollTo(0, scrollPositionRef.current);
      }, 0);
    }

    // Cleanup au démontage du composant
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.userSelect = '';
      document.body.style.pointerEvents = '';
    };
  }, [isModalOpen]);

  return (
    <>
      <div className="modern-card overflow-hidden group h-full cursor-pointer" onClick={openModal}>
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
              View Case Study
            </div>
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
              <span className="font-medium flex items-center">
                Read More
                <i className="fas fa-arrow-right ml-2 transition-all duration-300"></i>
              </span>
            </div>
            <div className="text-gray-500 text-sm">
              <i className="far fa-clock mr-1"></i> {readTime}
            </div>
          </div>
        </div>
      </div>

      {/* Modal PDF Viewer */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
          style={{ pointerEvents: 'auto' }}
        >
          <div
            className="bg-white rounded-xl max-w-7xl w-full h-[90vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ pointerEvents: 'auto', userSelect: 'auto' }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600 mt-1">{category} • {readTime}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg"
              >
                <i className="fas fa-times text-xl"></i>
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
                    overflowX: 'auto',
                    overflowY: 'hidden'
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <i className="fas fa-file-pdf text-gray-400 text-6xl mb-4"></i>
                    <p className="text-gray-600">No PDF available for this case study.</p>
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