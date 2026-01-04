import React from 'react';

const Logo = ({ className = "h-10 w-auto" }: { className?: string }) => {
  return (
    <img 
      src="/images/logo-dark-icon.svg" 
      alt="Central Test Agency" 
      className={className}
      style={{ background: 'transparent' }}
    />
  );
};

export default Logo;
