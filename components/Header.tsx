import React from 'react';

interface HeaderProps {
  onDrAgathaClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onDrAgathaClick }) => {
  return (
    <header className="bg-brand-500 backdrop-blur-md sticky top-0 z-50 border-b border-gold-500/30 shadow-lg shadow-brand-900/20 safe-area-top">
      <div className="container mx-auto px-4 sm:px-6 py-4 md:py-5 flex flex-col sm:flex-row items-center justify-center md:justify-between gap-3">
        <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-3 w-full md:w-auto">
          <div className="shrink-0 flex items-center justify-center">
            <img 
              src="/logo.png" 
              alt="Dra. Ágatha - Estética Avançada e Tricologia" 
              className="h-14 sm:h-20 md:h-24 w-auto object-contain logo-blend"
            />
          </div>
          <h1 className="text-base sm:text-xl md:text-2xl font-serif text-gold-500 tracking-wide text-center md:text-left">
            <span className="font-semibold">Dra. Ágatha</span>
            <span className="text-gold-400/80 mx-1 hidden sm:inline">|</span>
            <span className="text-sm sm:text-base font-light italic text-gold-400 block sm:inline">Estética Avançada e Tricologia</span>
          </h1>
        </div>
        
        <div className="flex items-center justify-center md:justify-end gap-2 sm:gap-3 w-full md:w-auto">
          <button
            onClick={onDrAgathaClick}
            className="text-xs uppercase tracking-widest text-gold-500 hover:text-gold-400 font-medium transition-colors border border-gold-500/50 hover:border-gold-500 px-4 py-2.5 sm:px-3 sm:py-1.5 rounded touch-manipulation"
          >
            Dra. Ágatha
          </button>
          <span className="hidden lg:inline text-xs uppercase tracking-widest text-gold-400 font-medium">Saúde Capilar & Bem-estar</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
