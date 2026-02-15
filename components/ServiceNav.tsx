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
    <nav className="flex flex-wrap justify-center gap-2 py-3 px-4 sm:px-6 bg-brand-600/80 border-b border-gold-500/20 safe-area-x">
      {services.map(({ id, label, icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelect(id)}
          className={`
            flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 touch-manipulation min-h-[44px] sm:min-h-0
            ${activeService === id 
              ? 'bg-gold-500 text-brand-900 shadow-md' 
              : 'text-gold-400 hover:bg-gold-500/20 hover:text-gold-400'}
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
