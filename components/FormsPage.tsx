import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import ServiceNav, { ServiceType } from './ServiceNav';
import AnamnesisForm from './AnamnesisForm';
import BotoxForm from './forms/BotoxForm';
import SkinManagementForm from './forms/SkinManagementForm';
import IntratermotherapyForm from './forms/IntratermotherapyForm';

const serviceConfig: Record<ServiceType, { title: string; description: string }> = {
  tricologia: {
    title: 'Ficha de Anamnese Preliminar - Tricologia',
    description: 'Para que nossa consulta seja ainda mais produtiva, por favor, preencha as informações abaixo com atenção. Seus dados são confidenciais e fundamentais para um diagnóstico preciso.',
  },
  botox: {
    title: 'Ficha de Avaliação - Botox',
    description: 'Preencha suas informações para agendarmos sua avaliação de toxina botulínica. Nossa equipe analisará sua ficha e entrará em contato para agendar sua consulta.',
  },
  'gerenciamento-pele': {
    title: 'Ficha de Avaliação - Gerenciamento de Pele',
    description: 'Conte-nos sobre sua pele e objetivos para que possamos preparar um plano de tratamento personalizado. Seus dados são confidenciais.',
  },
  intratermoterapia: {
    title: 'Ficha de Avaliação - Intratermoterapia',
    description: 'Preencha as informações para sua avaliação de intratermoterapia. Analisaremos sua ficha e entraremos em contato pelo contato de emergência fornecido para agendar sua consulta.',
  },
};

interface FormsPageProps {
  onBackToHome: () => void;
}

const FormsPage: React.FC<FormsPageProps> = ({ onBackToHome }) => {
  const [activeService, setActiveService] = useState<ServiceType>('tricologia');
  const config = serviceConfig[activeService];

  const renderForm = () => {
    switch (activeService) {
      case 'tricologia':
        return <AnamnesisForm />;
      case 'botox':
        return <BotoxForm />;
      case 'gerenciamento-pele':
        return <SkinManagementForm />;
      case 'intratermoterapia':
        return <IntratermotherapyForm />;
      default:
        return <AnamnesisForm />;
    }
  };

  return (
    <main className="flex-grow container mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-14 max-w-3xl safe-area-x">
      <button
        type="button"
        onClick={onBackToHome}
        className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-800 font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar ao início
      </button>
      <ServiceNav activeService={activeService} onSelect={setActiveService} />
      <div className="text-center mb-10 sm:mb-12 mt-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold text-brand-700 mb-4 sm:mb-5 leading-tight">
          {config.title}
        </h2>
        <p className="text-brand-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          {config.description}
        </p>
      </div>
      {renderForm()}
    </main>
  );
};

export default FormsPage;
