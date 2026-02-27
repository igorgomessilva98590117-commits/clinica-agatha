import React from 'react';
import { FileText, Instagram, ArrowRight, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onGoToForms: () => void;
  onDrAgathaClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGoToForms, onDrAgathaClick }) => {
  return (
    <>
      <main className="flex-grow flex flex-col">
        <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-24 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-100 via-brand-50/80 to-brand-100" aria-hidden="true" />
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl" aria-hidden="true" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-brand-400/10 rounded-full blur-3xl" aria-hidden="true" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-200/60 text-brand-700 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 text-gold-600" />
              Estética Avançada e Tricologia
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-brand-800 tracking-tight mb-4">
              Ágatha Santos
            </h1>
            <p className="text-xl sm:text-2xl text-brand-600 font-light mb-2">
              Biomedicina · Saúde capilar · Bem-estar
            </p>
            <p className="text-brand-500 text-base sm:text-lg max-w-lg mx-auto mb-12">
              Cuidado personalizado com base em ciência e ética. Sua jornada capilar e estética começa aqui.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                type="button"
                onClick={onGoToForms}
                className="inline-flex items-center gap-2 px-8 py-4 bg-brand-500 hover:bg-brand-600 text-gold-500 font-semibold rounded-xl shadow-lg shadow-brand-900/25 hover:shadow-xl transition-all duration-200 border-2 border-gold-500/50 hover:border-gold-500 touch-manipulation"
              >
                <FileText className="w-5 h-5" />
                Fichas de Avaliação
                <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="https://www.instagram.com/biomed.aga/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-brand-700 hover:text-brand-800 bg-white hover:bg-brand-100 border-2 border-brand-200 rounded-xl font-medium transition-all duration-200 shadow-sm"
              >
                <Instagram className="w-5 h-5" />
                @biomed.aga
              </a>
            </div>
          </div>
        </section>

        <section className="border-t border-brand-200 bg-white/60 py-12 px-4 sm:px-6">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-xl font-serif font-semibold text-brand-800 mb-4">Por que preencher a ficha?</h2>
            <p className="text-brand-600 leading-relaxed">
              Nossas fichas de avaliação permitem que nossa equipe conheça seu histórico e objetivos antes da consulta,
              tornando seu atendimento mais personalizado e eficiente. Escolha a ficha do serviço desejado e preencha com calma.
            </p>
            <button
              type="button"
              onClick={onGoToForms}
              className="mt-6 text-gold-600 hover:text-gold-500 font-medium underline underline-offset-2"
            >
              Ir para as fichas →
            </button>
          </div>
        </section>

        <section className="py-8 px-4 sm:px-6 border-t border-brand-200">
          <div className="container mx-auto max-w-xl text-center">
            <p className="text-sm text-brand-500">
              Profissional de saúde · Ética e sigilo
            </p>
            <button
              type="button"
              onClick={onDrAgathaClick}
              className="mt-2 text-xs text-brand-400 hover:text-brand-600 uppercase tracking-wider"
            >
              Área restrita
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default LandingPage;
