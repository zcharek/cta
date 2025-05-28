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
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-700 hover:text-gray-900 text-2xl font-bold"
              onClick={closeModal}
              aria-label="Close PDF viewer"
            >
              &times;
            </button>

            <iframe
              src={pdf.startsWith("/") ? pdf : `/${pdf}`}
              title={`Case Study PDF - ${title}`}
              className="w-full h-[90vh]"
              frameBorder="0"
              type="application/pdf"
            />

            {/* Fallback Link */}
            <div className="p-6 text-center">
              <p>
                If the PDF is not visible, you can{" "}
                <a
                  href={pdf.startsWith("/") ? pdf : `/${pdf}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  open it in a new tab
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CaseStudyCard;
