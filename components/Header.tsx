import React from 'react';

interface HeaderProps {
  onDrAgathaClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onDrAgathaClick }) => {
  return (
    <header className="bg-brand-500 backdrop-blur-md sticky top-0 z-50 border-b-2 border-gold-500/40 shadow-xl shadow-brand-900/25 safe-area-top">
      <div className="container mx-auto px-4 sm:px-6 py-4 md:py-5 flex flex-col sm:flex-row items-center justify-center md:justify-between gap-3 md:gap-6">
        <div className="flex items-center justify-center md:justify-start gap-3 sm:gap-4 w-full md:w-auto">
          <div className="shrink-0 flex items-center justify-center ring-2 ring-gold-500/30 rounded-full p-1 bg-brand-600/50">
            <img 
              src="/logo.png" 
              alt="Ágatha Santos - Estética Avançada e Tricologia" 
              className="h-14 sm:h-20 md:h-24 w-auto object-contain logo-blend"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-serif text-gold-500 tracking-wide">
              <span className="font-bold drop-shadow-sm">Ágatha Santos</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg font-light italic text-gold-400/95 mt-0.5">Estética Avançada e Tricologia</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center md:justify-end gap-3 sm:gap-4 w-full md:w-auto">
          <button
            onClick={onDrAgathaClick}
            className="text-sm sm:text-base uppercase tracking-widest text-gold-500 hover:text-gold-300 hover:bg-gold-500/20 font-semibold transition-all duration-200 border-2 border-gold-500/60 hover:border-gold-500 px-5 py-2.5 rounded-lg touch-manipulation shadow-md"
          >
            Área Restrita
          </button>
          <span className="hidden lg:inline text-sm sm:text-base text-gold-400/90 font-medium italic">Saúde Capilar & Bem-estar</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
