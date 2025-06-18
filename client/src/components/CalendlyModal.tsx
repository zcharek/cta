import { useCallback } from 'react';
import CalendlyWidget from "./CalendlyWidget";

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalendlyModal = ({ isOpen, onClose }: CalendlyModalProps) => {
  const handleClose = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  }, [onClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl shadow-2xl relative">
        {/* En-tête de la modale */}
        <div className="bg-gradient-to-br from-green-600 via-blue-600 to-purple-700 text-white p-6 sm:p-8 rounded-t-2xl sm:rounded-t-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <button
            onClick={handleClose}
            aria-label="Fermer la modale"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white hover:text-gray-200 text-3xl sm:text-4xl font-light transition-all duration-200 hover:scale-110 z-50 cursor-pointer bg-black bg-opacity-20 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-opacity-30"
          >
            ×
          </button>
          
          <div className="relative z-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-white drop-shadow-lg">
              Prendre un rendez-vous
            </h2>
            <p className="text-green-100 text-base sm:text-lg">
              Réservez votre créneau pour une consultation gratuite de 30 minutes avec nos experts.
            </p>
          </div>
        </div>

        {/* Widget Calendly */}
        <div className="p-4 sm:p-6">
          <div className="text-center mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Consultation gratuite de 30 minutes
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Choisissez un créneau qui vous convient. La consultation se fera via Google Meet.
            </p>
          </div>
          
          <CalendlyWidget 
            url="https://calendly.com/centraltestagency/30min"
            className="w-full"
          />
        </div>

        {/* Informations supplémentaires */}
        <div className="p-4 sm:p-6 bg-gray-50 border-t">
          <div className="text-center">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              Que se passe-t-il pendant la consultation ?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-xs sm:text-sm">
              <div className="text-center">
                <div className="bg-blue-100 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 font-semibold text-sm sm:text-base">1</span>
                </div>
                <p className="text-gray-700">Analyse de vos besoins et objectifs</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-600 font-semibold text-sm sm:text-base">2</span>
                </div>
                <p className="text-gray-700">Présentation de nos solutions adaptées</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 font-semibold text-sm sm:text-base">3</span>
                </div>
                <p className="text-gray-700">Devis personnalisé et planning</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendlyModal; 