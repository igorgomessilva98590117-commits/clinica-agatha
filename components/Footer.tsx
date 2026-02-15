import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-brand-600 to-brand-500 border-t-2 border-gold-500/40 py-10 mt-16 safe-area-bottom shadow-inner">
      <div className="container mx-auto px-4 sm:px-6 text-center safe-area-x">
        <p className="text-gold-400 text-base font-medium">
          &copy; {new Date().getFullYear()} Ágatha Santos - Estética Avançada e Tricologia
        </p>
        <p className="text-gold-500/80 text-sm mt-1">Todos os direitos reservados.</p>
        <div className="mt-4 flex justify-center gap-6 text-sm text-gold-500 font-medium">
          <span>Ética Médica</span>
          <span className="text-gold-500/50">•</span>
          <span>Privacidade</span>
          <span className="text-gold-500/50">•</span>
          <span>Ciência</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;