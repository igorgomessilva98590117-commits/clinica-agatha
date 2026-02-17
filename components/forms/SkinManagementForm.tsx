import React, { useState } from 'react';
import { Send, Heart, AlertCircle, Sparkles, Package } from 'lucide-react';
import { PersonalDataSection } from './PersonalDataSection';
import FormSuccess from './FormSuccess';

interface FormData {
  fullName: string;
  birthDate: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  emergencyContactNotes: string;
  skinType: string;
  concerns: string;
  currentRoutine: string;
  medications: string;
}

const SkinManagementForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    birthDate: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    emergencyContactNotes: '',
    skinType: '',
    concerns: '',
    currentRoutine: '',
    medications: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  const inputClass = "w-full px-4 py-3 rounded-lg border border-brand-200 bg-brand-50 focus:bg-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all duration-200 placeholder:text-brand-400";
  const textareaClass = `${inputClass} resize-none`;

  if (submitted) return <FormSuccess onBack={() => setSubmitted(false)} formData={formData} serviceName="Gerenciamento de Pele" />;

  return (
    <form onSubmit={handleSubmit} className="bg-brand-50 shadow-xl shadow-brand-600/30 rounded-2xl overflow-hidden border border-brand-200">
      <div className="h-1 w-full bg-brand-50">
        <div className="h-full bg-gradient-to-r from-gold-400 to-brand-500 w-1/3 rounded-r-full"></div>
      </div>

      <div className="p-6 md:p-10 space-y-10">
        <PersonalDataSection formData={formData} onChange={handleChange} />

        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2 border-b border-brand-100 pb-2">
            <Heart className="w-5 h-5 text-gold-600" />
            <h3 className="text-lg font-serif font-medium text-brand-800">Tipo de Pele</h3>
          </div>
          <div className="space-y-2">
            <label htmlFor="skinType" className="block text-sm font-medium text-brand-700">
              Como você classificaria seu tipo de pele?
            </label>
            <select
              id="skinType"
              name="skinType"
              value={formData.skinType}
              onChange={handleChange}
              required
              className={`${inputClass} text-brand-700 appearance-none`}
            >
              <option value="" disabled>Selecione</option>
              <option value="oleosa">Oleosa</option>
              <option value="seca">Seca</option>
              <option value="mista">Mista</option>
              <option value="normal">Normal</option>
              <option value="sensivel">Sensível</option>
              <option value="nao-sei">Não sei</option>
            </select>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2 border-b border-brand-100 pb-2">
            <Sparkles className="w-5 h-5 text-gold-600" />
            <h3 className="text-lg font-serif font-medium text-brand-800">Preocupações</h3>
          </div>
          <div className="space-y-2">
            <label htmlFor="concerns" className="block text-sm font-medium text-brand-700">
              Quais são suas principais preocupações com a pele?
            </label>
            <textarea
              id="concerns"
              name="concerns"
              value={formData.concerns}
              onChange={handleChange}
              rows={4}
              placeholder="Ex: Acne, manchas, poros dilatados, linhas de expressão, flacidez, oleosidade excessiva..."
              className={textareaClass}
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2 border-b border-brand-100 pb-2">
            <Package className="w-5 h-5 text-gold-600" />
            <h3 className="text-lg font-serif font-medium text-brand-800">Rotina Atual</h3>
          </div>
          <div className="space-y-2">
            <label htmlFor="currentRoutine" className="block text-sm font-medium text-brand-700">
              Quais produtos você usa atualmente na rotina de skincare?
            </label>
            <textarea
              id="currentRoutine"
              name="currentRoutine"
              value={formData.currentRoutine}
              onChange={handleChange}
              rows={3}
              placeholder="Ex: Sabonete, sérum de vitamina C, protetor solar..."
              className={textareaClass}
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2 border-b border-brand-100 pb-2">
            <AlertCircle className="w-5 h-5 text-gold-600" />
            <h3 className="text-lg font-serif font-medium text-brand-800">Medicamentos</h3>
          </div>
          <div className="space-y-2">
            <label htmlFor="medications" className="block text-sm font-medium text-brand-700">
              Usa algum medicamento contínuo ou teve reações a produtos?
            </label>
            <textarea
              id="medications"
              name="medications"
              value={formData.medications}
              onChange={handleChange}
              rows={2}
              placeholder="Ex: Isotretinoína, anticoncepcional, alergias a ácidos..."
              className={textareaClass}
            />
          </div>
        </section>

        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white text-lg font-medium tracking-wide py-4 rounded-lg shadow-lg shadow-brand-600/40 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <span>Enviar Ficha de Gerenciamento de Pele</span>
                <Send className="w-5 h-5" />
              </>
            )}
          </button>
          <p className="text-center text-xs text-brand-500 mt-4">Seus dados estão seguros e serão utilizados apenas para fins clínicos.</p>
        </div>
      </div>
    </form>
  );
};

export default SkinManagementForm;
