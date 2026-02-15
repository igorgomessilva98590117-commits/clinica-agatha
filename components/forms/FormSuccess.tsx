import React from 'react';
import { Send, Download, Mail } from 'lucide-react';
import { generateFormPdf, getEmailContent } from '../../utils/pdfGenerator';

interface FormSuccessProps {
  onBack: () => void;
  formData?: Record<string, string>;
  serviceName?: string;
}

const FormSuccess: React.FC<FormSuccessProps> = ({ onBack, formData, serviceName }) => {
  const handleDownloadPdf = async () => {
    if (formData && serviceName) {
      await generateFormPdf(formData, serviceName);
    }
  };

  const handleSendEmail = () => {
    if (formData && serviceName) {
      const { subject, body } = getEmailContent(formData, serviceName);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }
  };

  const hasPdfOptions = formData && serviceName;

  return (
    <div className="bg-brand-50 p-10 rounded-xl shadow-lg border border-brand-200 text-center animate-fade-in">
      <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-200">
        <Send className="w-8 h-8 text-gold-600" />
      </div>
      <h3 className="text-2xl font-serif text-brand-800 mb-4">Ficha Enviada com Sucesso</h3>
      <p className="text-brand-700 mb-8 leading-relaxed">
        Obrigada por enviar suas informações. Nossa equipe irá analisar sua ficha e entraremos em contato pelo contato de emergência fornecido para agendar sua consulta.
      </p>
      
      {hasPdfOptions && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button
            onClick={handleDownloadPdf}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            Baixar PDF da Ficha
          </button>
          <button
            onClick={handleSendEmail}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-brand-900 font-medium rounded-lg transition-colors"
          >
            <Mail className="w-5 h-5" />
            Enviar por Email
          </button>
        </div>
      )}
      
      {hasPdfOptions && (
        <p className="text-xs text-brand-500 mb-4">
          Baixe o PDF e anexe ao email, ou use o botão acima para abrir seu cliente de email com os dados preenchidos.
        </p>
      )}
      
      <button 
        onClick={onBack}
        className="text-gold-600 hover:text-gold-700 underline underline-offset-4 text-sm font-medium transition-colors"
      >
        Voltar ao início
      </button>
    </div>
  );
};

export default FormSuccess;
