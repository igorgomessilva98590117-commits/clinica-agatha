import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-500 border-t border-gold-500/30 py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gold-400 text-sm font-light">
          &copy; {new Date().getFullYear()} Dra. Agatha Tricologia. Todos os direitos reservados.
        </p>
        <div className="mt-2 flex justify-center gap-4 text-xs text-gold-500">
          <span>Ética Médica</span>
          <span>•</span>
          <span>Privacidade</span>
          <span>•</span>
          <span>Ciência</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;