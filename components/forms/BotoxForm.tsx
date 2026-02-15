import React, { useState } from 'react';
import { Send, MapPin, AlertCircle, Activity } from 'lucide-react';
import { PersonalDataSection } from './PersonalDataSection';
import FormSuccess from './FormSuccess';

interface FormData {
  fullName: string;
  whatsapp: string;
  birthDate: string;
  areaOfInterest: string;
  priorProcedures: string;
  allergies: string;
}

const BotoxForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    whatsapp: '',
    birthDate: '',
    areaOfInterest: '',
    priorProcedures: '',
    allergies: ''
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
      console.log('Botox Form:', formData);
      setIsSubmitting(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  const inputClass = "w-full px-4 py-3 rounded-lg border border-brand-200 bg-brand-50 focus:bg-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all duration-200 placeholder:text-brand-400";
  const textareaClass = `${inputClass} resize-none`;

  if (submitted) return <FormSuccess onBack={() => setSubmitted(false)} />;

  return (
    <form onSubmit={handleSubmit} className="bg-brand-50 shadow-xl shadow-brand-600/30 rounded-2xl overflow-hidden border border-brand-200">
      <div className="h-1 w-full bg-brand-50">
        <div className="h-full bg-gradient-to-r from-gold-400 to-brand-500 w-1/3 rounded-r-full"></div>
      </div>

      <div className="p-6 md:p-10 space-y-10">
        <PersonalDataSection formData={formData} onChange={handleChange} />

        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2 border-b border-brand-100 pb-2">
            <MapPin className="w-5 h-5 text-gold-600" />
            <h3 className="text-lg font-serif font-medium text-brand-800">Área de Interesse</h3>
          </div>
          <div className="space-y-2">
            <label htmlFor="areaOfInterest" className="block text-sm font-medium text-brand-700">
              Quais áreas deseja tratar com toxina botulínica?
            </label>
            <select
              id="areaOfInterest"
              name="areaOfInterest"
              value={formData.areaOfInterest}
              onChange={handleChange}
              required
              className={`${inputClass} text-brand-700 appearance-none`}
            >
              <option value="" disabled>Selecione</option>
              <option value="testa">Testa (rugas)</option>
              <option value="olhos">Entre as sobrancelhas (glabela)</option>
              <option value="olhos-pes">Região dos olhos (pés de galinha)</option>
              <option value="multipla">Múltiplas áreas</option>
              <option value="outra">Outra área</option>
            </select>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2 border-b border-brand-100 pb-2">
            <Activity className="w-5 h-5 text-gold-600" />
            <h3 className="text-lg font-serif font-medium text-brand-800">Histórico</h3>
          </div>
          <div className="space-y-2">
            <label htmlFor="priorProcedures" className="block text-sm font-medium text-brand-700">
              Já realizou aplicação de toxina botulínica anteriormente?
            </label>
            <textarea
              id="priorProcedures"
              name="priorProcedures"
              value={formData.priorProcedures}
              onChange={handleChange}
              rows={3}
              placeholder="Se sim, quando foi a última aplicação e como foi a experiência?"
              className={textareaClass}
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2 border-b border-brand-100 pb-2">
            <AlertCircle className="w-5 h-5 text-gold-600" />
            <h3 className="text-lg font-serif font-medium text-brand-800">Alergias e Saúde</h3>
          </div>
          <div className="space-y-2">
            <label htmlFor="allergies" className="block text-sm font-medium text-brand-700">
              Possui alergias, uso de medicamentos ou contraindicações?
            </label>
            <textarea
              id="allergies"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              rows={3}
              placeholder="Ex: Alergia a componentes, uso de anticoagulantes, gestação..."
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
                <span>Enviar Ficha de Botox</span>
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

export default BotoxForm;
