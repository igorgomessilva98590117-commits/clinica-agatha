import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-brand-500 backdrop-blur-md sticky top-0 z-50 border-b border-gold-500/30 shadow-lg shadow-brand-900/20">
      <div className="container mx-auto px-6 py-5 flex items-center justify-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <img src="/logo.png" alt="Ágatha Santos - Estética Avançada e Tricologia" className="h-20 md:h-24 w-auto object-contain" />
          </div>
          <h1 className="text-xl md:text-2xl font-serif text-gold-500 tracking-wide">
            <span className="font-semibold">Dra. Agatha</span> <span className="text-gold-400/80 mx-1">|</span> <span className="text-base font-light italic text-gold-400">Tricologia Especializada</span>
          </h1>
        </div>
        
        <div className="hidden md:block">
           <span className="text-xs uppercase tracking-widest text-gold-400 font-medium">Saúde Capilar & Bem-estar</span>
        </div>
      </div>
    </header>
  );
};

export default Header;