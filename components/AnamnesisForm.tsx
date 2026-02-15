import React, { useState } from 'react';
import { Send, Scissors, Activity, AlertCircle, Download, Mail } from 'lucide-react';
import { PersonalDataSection } from './forms/PersonalDataSection';
import { generateFormPdf, getEmailContent } from '../utils/pdfGenerator';

interface FormData {
  fullName: string;
  birthDate: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  emergencyContactNotes: string;
  mainComplaint: string;
  hasChemicalHistory: string; // "yes" | "no" | ""
  chemicalDetails: string;
  healthHistory: string;
}

const AnamnesisForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    birthDate: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    emergencyContactNotes: '',
    mainComplaint: '',
    hasChemicalHistory: '',
    chemicalDetails: '',
    healthHistory: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Form Submitted:', formData);
      setIsSubmitting(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  if (submitted) {
    const handleDownloadPdf = async () => await generateFormPdf(formData, 'Tricologia');
    const handleSendEmail = () => {
      const { subject, body } = getEmailContent(formData, 'Tricologia');
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };
    return (
      <div className="bg-brand-50 p-10 rounded-xl shadow-lg border border-brand-200 text-center animate-fade-in">
        <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-200">
          <Send className="w-8 h-8 text-gold-600" />
        </div>
        <h3 className="text-2xl font-serif text-brand-800 mb-4">Ficha Enviada com Sucesso</h3>
        <p className="text-brand-700 mb-8 leading-relaxed">
          Obrigada por enviar suas informações. Nossa equipe irá analisar sua ficha e entraremos em contato pelo contato de emergência fornecido para agendar sua consulta.
        </p>
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
        <p className="text-xs text-brand-500 mb-4">
          Baixe o PDF e anexe ao email, ou use o botão acima para abrir seu cliente de email com os dados preenchidos.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="text-gold-600 hover:text-gold-700 underline underline-offset-4 text-sm font-medium transition-colors"
        >
          Voltar ao início
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-brand-50 shadow-xl shadow-brand-600/30 rounded-2xl overflow-hidden border border-brand-200">
      
      {/* Progress Line */}
      <div className="h-1 w-full bg-brand-50">
        <div className="h-full bg-gradient-to-r from-gold-400 to-brand-500 w-1/3 rounded-r-full"></div>
      </div>

      <div className="p-6 md:p-10 space-y-10">
        
        {/* Section 1: Personal Data */}
        <PersonalDataSection formData={formData} onChange={handleChange} />

        {/* Section 2: Main Complaint */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2 border-b border-brand-100 pb-2">
            <AlertCircle className="w-5 h-5 text-gold-600" />
            <h3 className="text-lg font-serif font-medium text-brand-800">Queixa Principal</h3>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="mainComplaint" className="block text-sm font-medium text-brand-700">
              O que mais te incomoda no seu cabelo ou couro cabeludo hoje?
            </label>
            <textarea
              required
              id="mainComplaint"
              name="mainComplaint"
              value={formData.mainComplaint}
              onChange={handleChange}
              rows={4}
              placeholder="Ex: Tenho notado queda excessiva ao lavar, falhas na região frontal e muita coceira..."
              className="w-full px-4 py-3 rounded-lg border border-brand-200 bg-brand-50 focus:bg-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all duration-200 placeholder:text-brand-400 resize-none"
            />
          </div>
        </section>

        {/* Section 3: Hair History */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2 border-b border-brand-100 pb-2">
            <Scissors className="w-5 h-5 text-gold-600" />
            <h3 className="text-lg font-serif font-medium text-brand-800">Histórico Capilar</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="hasChemicalHistory" className="block text-sm font-medium text-brand-700">
                Você realizou procedimentos químicos nos últimos 6 meses?
              </label>
              <div className="relative">
                <select
                  id="hasChemicalHistory"
                  name="hasChemicalHistory"
                  value={formData.hasChemicalHistory}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-brand-200 bg-brand-50 focus:bg-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all duration-200 text-brand-700 appearance-none"
                >
                  <option value="" disabled>Selecione uma opção</option>
                  <option value="no">Não, meu cabelo está natural</option>
                  <option value="yes">Sim, realizei procedimentos</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-600">
                  <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            {formData.hasChemicalHistory === 'yes' && (
              <div className="space-y-2 animate-fade-in-down">
                <label htmlFor="chemicalDetails" className="block text-sm font-medium text-brand-700 pl-4 border-l-2 border-gold-500">
                  Quais procedimentos? (Ex: Progressiva, Luzes, Coloração)
                </label>
                <input
                  type="text"
                  id="chemicalDetails"
                  name="chemicalDetails"
                  value={formData.chemicalDetails}
                  onChange={handleChange}
                  placeholder="Descreva brevemente..."
                  className="w-full px-4 py-3 rounded-lg border border-brand-200 bg-brand-50 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all duration-200"
                />
              </div>
            )}
          </div>
        </section>

        {/* Section 4: General Health */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2 border-b border-brand-100 pb-2">
            <Activity className="w-5 h-5 text-gold-600" />
            <h3 className="text-lg font-serif font-medium text-brand-800">Saúde Geral</h3>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="healthHistory" className="block text-sm font-medium text-brand-700">
              Diagnósticos médicos, alergias ou medicação contínua?
            </label>
            <textarea
              id="healthHistory"
              name="healthHistory"
              value={formData.healthHistory}
              onChange={handleChange}
              rows={3}
              placeholder="Ex: Hipotireoidismo, Anemia, Alergia a Dipirona, Uso anticoncepcional..."
              className="w-full px-4 py-3 rounded-lg border border-brand-200 bg-brand-50 focus:bg-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all duration-200 placeholder:text-brand-400 resize-none"
            />
          </div>
        </section>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full flex items-center justify-center gap-3
              bg-brand-500 hover:bg-brand-600 active:bg-brand-700
              text-white text-lg font-medium tracking-wide
              py-4 rounded-lg shadow-lg shadow-brand-600/40
              transition-all duration-300 transform hover:-translate-y-0.5
              disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
            `}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <span>Enviar Minha Ficha para Análise</span>
                <Send className="w-5 h-5" />
              </>
            )}
          </button>
          <p className="text-center text-xs text-brand-500 mt-4">
            Seus dados estão seguros e serão utilizados apenas para fins clínicos.
          </p>
        </div>

      </div>
    </form>
  );
};

export default AnamnesisForm;