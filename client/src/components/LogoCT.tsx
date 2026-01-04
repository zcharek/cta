import React from 'react';

type LogoVariant = "dark" | "light";
type LogoLayout = "icon" | "horizontal" | "vertical";

interface LogoCTProps {
  className?: string;
  variant?: LogoVariant;
  layout?: LogoLayout;
}

const LogoCT = ({ 
  className = "h-10 w-auto", 
  variant = "dark",
  layout = "icon"
}: LogoCTProps) => {
  // Déterminer le fichier SVG à utiliser selon le variant et le layout
  const getLogoSrc = (): string => {
    const variantPrefix = variant === "dark" ? "dark" : "light";
    const layoutSuffix = layout === "icon" ? "icon" : layout === "horizontal" ? "horizontal" : "vertical";
    return `/images/logo-${variantPrefix}-${layoutSuffix}.svg`;
  };

  return (
    <img 
      src={getLogoSrc()} 
      alt="Central Test Agency" 
      className={className}
      style={{ background: 'transparent' }}
    />
  );
};

export default LogoCT;
