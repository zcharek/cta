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
    <div className="modern-card overflow-hidden group service-card h-full">
      <div className="h-48 overflow-hidden">
        <img
          src={image}
          alt={altText}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 gpu-accelerated"
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
