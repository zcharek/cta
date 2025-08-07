import React, { createContext, useContext, useEffect, useState } from 'react';

interface AccessibilityContextType {
  isHighContrast: boolean;
  isReducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [fontSize, setFontSizeState] = useState<'small' | 'medium' | 'large'>('medium');

  useEffect(() => {
    // Vérifier les préférences système
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsReducedMotion(prefersReducedMotion);

    // Charger les préférences sauvegardées
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    const savedFontSize = localStorage.getItem('fontSize') as 'small' | 'medium' | 'large';
    
    setIsHighContrast(savedHighContrast);
    if (savedFontSize) {
      setFontSizeState(savedFontSize);
    }

    // Appliquer les styles d'accessibilité
    applyAccessibilityStyles(savedHighContrast, savedFontSize || 'medium', prefersReducedMotion);
  }, []);

  const applyAccessibilityStyles = (
    highContrast: boolean, 
    size: 'small' | 'medium' | 'large', 
    reducedMotion: boolean
  ) => {
    const root = document.documentElement;
    
    // Appliquer le contraste élevé
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Appliquer la taille de police
    root.classList.remove('font-small', 'font-medium', 'font-large');
    root.classList.add(`font-${size}`);

    // Appliquer la réduction de mouvement
    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  };

  const toggleHighContrast = () => {
    const newValue = !isHighContrast;
    setIsHighContrast(newValue);
    localStorage.setItem('highContrast', newValue.toString());
    applyAccessibilityStyles(newValue, fontSize, isReducedMotion);
  };

  const toggleReducedMotion = () => {
    const newValue = !isReducedMotion;
    setIsReducedMotion(newValue);
    applyAccessibilityStyles(isHighContrast, fontSize, newValue);
  };

  const setFontSize = (size: 'small' | 'medium' | 'large') => {
    setFontSizeState(size);
    localStorage.setItem('fontSize', size);
    applyAccessibilityStyles(isHighContrast, size, isReducedMotion);
  };

  const value: AccessibilityContextType = {
    isHighContrast,
    isReducedMotion,
    fontSize,
    toggleHighContrast,
    toggleReducedMotion,
    setFontSize,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Composant pour les contrôles d'accessibilité
export const AccessibilityControls: React.FC = () => {
  const { 
    isHighContrast, 
    isReducedMotion, 
    fontSize, 
    toggleHighContrast, 
    toggleReducedMotion, 
    setFontSize 
  } = useAccessibility();

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
      <h3 className="text-sm font-semibold mb-3 text-gray-800">Accessibilité</h3>
      
      <div className="space-y-3">
        <button
          onClick={toggleHighContrast}
          className={`w-full px-3 py-2 text-xs rounded-md transition-colors ${
            isHighContrast 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          aria-label={isHighContrast ? 'Désactiver le contraste élevé' : 'Activer le contraste élevé'}
        >
          {isHighContrast ? 'Contraste élevé activé' : 'Contraste élevé'}
        </button>

        <button
          onClick={toggleReducedMotion}
          className={`w-full px-3 py-2 text-xs rounded-md transition-colors ${
            isReducedMotion 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          aria-label={isReducedMotion ? 'Désactiver la réduction de mouvement' : 'Activer la réduction de mouvement'}
        >
          {isReducedMotion ? 'Mouvement réduit activé' : 'Mouvement réduit'}
        </button>

        <div className="space-y-1">
          <label className="text-xs text-gray-600">Taille de police</label>
          <div className="flex space-x-1">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`px-2 py-1 text-xs rounded ${
                  fontSize === size 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label={`Taille de police ${size}`}
              >
                {size === 'small' ? 'A' : size === 'medium' ? 'A' : 'A'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 