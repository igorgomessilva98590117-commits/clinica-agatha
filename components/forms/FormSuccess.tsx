import React from 'react';
import { Send } from 'lucide-react';

interface FormSuccessProps {
  onBack: () => void;
}

const FormSuccess: React.FC<FormSuccessProps> = ({ onBack }) => (
  <div className="bg-brand-50 p-10 rounded-xl shadow-lg border border-brand-200 text-center animate-fade-in">
    <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-200">
      <Send className="w-8 h-8 text-gold-600" />
    </div>
    <h3 className="text-2xl font-serif text-brand-800 mb-4">Ficha Enviada com Sucesso</h3>
    <p className="text-brand-700 mb-8 leading-relaxed">
      Obrigada por enviar suas informações. Nossa equipe irá analisar sua ficha e entraremos em contato pelo contato de emergência fornecido para agendar sua consulta.
    </p>
    <button 
      onClick={onBack}
      className="text-gold-600 hover:text-gold-700 underline underline-offset-4 text-sm font-medium transition-colors"
    >
      Voltar ao início
    </button>
  </div>
);

export default FormSuccess;
