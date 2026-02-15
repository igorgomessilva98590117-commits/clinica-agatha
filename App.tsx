import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ServiceNav, { ServiceType } from './components/ServiceNav';
import AnamnesisForm from './components/AnamnesisForm';
import BotoxForm from './components/forms/BotoxForm';
import SkinManagementForm from './components/forms/SkinManagementForm';
import IntratermotherapyForm from './components/forms/IntratermotherapyForm';

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
    description: 'Preencha as informações para sua avaliação de intratermoterapia. Analisaremos sua ficha e entraremos em contato pelo WhatsApp para agendar sua consulta.',
  },
};

const App: React.FC = () => {
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
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <ServiceNav activeService={activeService} onSelect={setActiveService} />

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-brand-600 mb-4">
            {config.title}
          </h2>
          <p className="text-brand-700 max-w-xl mx-auto leading-relaxed">
            {config.description}
          </p>
        </div>

        {renderForm()}
      </main>

      <Footer />
    </div>
  );
};

export default App;
