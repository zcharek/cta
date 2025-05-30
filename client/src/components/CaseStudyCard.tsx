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

  const openPDF = () => {
    if (pdf) {
      // Ouvrir directement dans un nouvel onglet
      window.open(pdf.startsWith("/") ? pdf : `/${pdf}`, '_blank');
    } else {
      alert("Case study details will be available after deployment.");
    }
  };

  return (
    <div className="modern-card overflow-hidden group h-full cursor-pointer" onClick={openPDF}>
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
  );
};

export default CaseStudyCard;