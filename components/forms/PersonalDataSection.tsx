import React from 'react';
import { User, Phone, Calendar } from 'lucide-react';

interface PersonalDataSectionProps {
  formData: { fullName: string; whatsapp: string; birthDate: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const inputClass = "w-full px-4 py-3 rounded-lg border border-brand-200 bg-brand-50 focus:bg-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all duration-200 placeholder:text-brand-400";
const labelClass = "block text-sm font-medium text-brand-700";

export const PersonalDataSection: React.FC<PersonalDataSectionProps> = ({ formData, onChange }) => (
  <section className="space-y-6">
    <div className="flex items-center gap-2 mb-2 border-b border-brand-100 pb-2">
      <User className="w-5 h-5 text-gold-600" />
      <h3 className="text-lg font-serif font-medium text-brand-800">Dados Pessoais</h3>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="col-span-1 md:col-span-2 space-y-2">
        <label htmlFor="fullName" className={labelClass}>Nome Completo</label>
        <input
          required
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={onChange}
          placeholder="Ex: Maria Eduarda Silva"
          className={inputClass}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="whatsapp" className={`${labelClass} flex items-center gap-1`}>
          WhatsApp <Phone className="w-3 h-3 text-brand-500" />
        </label>
        <input
          required
          type="tel"
          id="whatsapp"
          name="whatsapp"
          value={formData.whatsapp}
          onChange={onChange}
          placeholder="(00) 00000-0000"
          className={inputClass}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="birthDate" className={`${labelClass} flex items-center gap-1`}>
          Data de Nascimento <Calendar className="w-3 h-3 text-brand-500" />
        </label>
        <input
          required
          type="date"
          id="birthDate"
          name="birthDate"
          value={formData.birthDate}
          onChange={onChange}
          className={`${inputClass} text-brand-700`}
        />
      </div>
    </div>
  </section>
);
