import { m } from "framer-motion";

interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
  altText: string;
}

const ServiceCard = ({
  title,
  description,
  image,
  altText,
}: ServiceCardProps) => {
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
        <p className="text-gray-600 mb-4">{description}</p>
        {/* Bouton "Learn More" retiré */}
      </div>
    </div>
  );
};

export default ServiceCard;
