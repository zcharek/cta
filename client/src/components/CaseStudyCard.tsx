import { m } from 'framer-motion';

interface CaseStudyCardProps {
  title: string;
  description: string;
  image: string;
  altText: string;
  category: string;
  readTime: string;
}

const CaseStudyCard = ({ title, description, image, altText, category, readTime }: CaseStudyCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group h-full">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={image} 
          alt={altText} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-primary/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <m.button 
            className="px-6 py-3 bg-white text-primary rounded-md font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Case Study
          </m.button>
        </div>
      </div>
      <div className="p-6">
        <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-4">
          {category}
        </span>
        <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
        <p className="text-gray-600 mb-4">
          {description}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-primary">
            <m.a 
              href="#" 
              className="font-medium hover:underline flex items-center"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
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
  );
};

export default CaseStudyCard;
