import { m } from 'framer-motion';

interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
  altText: string;
}

const ServiceCard = ({ title, description, image, altText }: ServiceCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group service-card h-full">
      <div className="h-48 overflow-hidden">
        <img 
          src={image}
          alt={altText}
          className="w-full h-full object-cover transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
        <p className="text-gray-600 mb-4">
          {description}
        </p>
        <div className="flex items-center text-primary">
          <m.a 
            href={`/services/${title.toLowerCase().replace(/\s+/g, '-')}`}
            className="font-medium hover:underline flex items-center"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById('contact');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Learn More 
            <i className="fas fa-arrow-right ml-2 group-hover:ml-3 transition-all duration-300"></i>
          </m.a>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
