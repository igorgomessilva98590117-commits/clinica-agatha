import React from 'react';
import { Droplets, Sparkles, ScanFace, Syringe } from 'lucide-react';

export type ServiceType = 'tricologia' | 'botox' | 'gerenciamento-pele' | 'intratermoterapia';

interface ServiceNavProps {
  activeService: ServiceType;
  onSelect: (service: ServiceType) => void;
}

const services: { id: ServiceType; label: string; icon: React.ReactNode }[] = [
  { id: 'tricologia', label: 'Tricologia', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'botox', label: 'Botox', icon: <Droplets className="w-4 h-4" /> },
  { id: 'gerenciamento-pele', label: 'Gerenciamento de Pele', icon: <ScanFace className="w-4 h-4" /> },
  { id: 'intratermoterapia', label: 'Intratermoterapia', icon: <Syringe className="w-4 h-4" /> },
];

const ServiceNav: React.FC<ServiceNavProps> = ({ activeService, onSelect }) => {
  return (
    <nav className="flex flex-wrap justify-center gap-2 py-4 px-4 sm:px-6 bg-gradient-to-b from-brand-600 to-brand-700 border-b-2 border-gold-500/30 safe-area-x shadow-inner">
      {services.map(({ id, label, icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelect(id)}
          className={`
            flex items-center gap-2 px-4 py-3 sm:px-5 sm:py-2.5 rounded-xl text-sm font-medium transition-all duration-200 touch-manipulation min-h-[44px] sm:min-h-0
            ${activeService === id 
              ? 'bg-gold-500 text-brand-900 shadow-lg ring-2 ring-gold-400/50' 
              : 'text-gold-400 hover:bg-gold-500/25 hover:text-gold-300 border border-gold-500/30'}
          `}
        >
          {icon}
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
};

export default ServiceNav;
