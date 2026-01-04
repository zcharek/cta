import React from 'react';

const LogoLight = ({ className = "h-10 w-auto" }: { className?: string }) => {
  return (
    <img 
      src="/images/logo-light-icon.svg" 
      alt="Central Test Agency" 
      className={className}
      style={{ background: 'transparent' }}
    />
  );
};

export default LogoLight;
