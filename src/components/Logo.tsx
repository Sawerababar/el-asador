import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  variant = 'dark',
  size = 'md' 
}) => {
  const isLight = variant === 'light';
  
  const sizeClasses = {
    sm: {
      crest: 'w-8 h-8',
      title: 'text-lg',
      sub: 'text-[9px] tracking-[0.2em]',
      tag: 'text-[8px]',
    },
    md: {
      crest: 'w-10 h-10',
      title: 'text-xl',
      sub: 'text-[10px] tracking-[0.22em]',
      tag: 'text-[9px]',
    },
    lg: {
      crest: 'w-14 h-14',
      title: 'text-3xl',
      sub: 'text-xs tracking-[0.25em]',
      tag: 'text-[10px]',
    },
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="flex flex-col text-left leading-none">
        <div className="flex items-center gap-1.5">
          <span 
            className={`font-serif font-bold uppercase tracking-wide ${sizeClasses.title} ${
              isLight ? 'text-white' : 'text-[#1F1A17]'
            }`}
          >
            El Asador
          </span>
          <span className="text-[#C85227] font-semibold text-xs">•</span>
        </div>
        <span 
          className={`font-sans font-semibold uppercase mt-0.5 ${sizeClasses.sub} ${
            isLight ? 'text-[#D9822B]' : 'text-[#C85227]'
          }`}
        >
          Margarita Ranch Grill
        </span>
        <span 
          className={`font-sans font-medium uppercase mt-0.5 tracking-wider ${sizeClasses.tag} ${
            isLight ? 'text-[#B5A89C]' : 'text-[#7D7166]'
          }`}
        >
          Austin, Texas
        </span>
      </div>
    </div>
  );
};
