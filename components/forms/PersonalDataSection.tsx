import React from 'react';
import { User, Phone, Calendar, Users, MessageSquare } from 'lucide-react';

interface EmergencyContactFormData {
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  emergencyContactNotes: string;
}

interface PersonalDataSectionProps {
  formData: { 
    fullName: string; 
    birthDate: string;
  } & EmergencyContactFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const inputClass = "w-full px-4 py-3 rounded-lg border border-brand-200 bg-brand-50 focus:bg-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all duration-200 placeholder:text-brand-400";
const labelClass = "block text-sm font-medium text-brand-700";
const textareaClass = `${inputClass} resize-none`;

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

    {/* Contato de Emergência */}
    <div className="mt-8 p-4 rounded-xl bg-brand-100/50 border border-brand-200">
      <div className="flex items-center gap-2 mb-4 border-b border-brand-200 pb-2">
        <Users className="w-5 h-5 text-gold-600" />
        <h4 className="text-base font-serif font-medium text-brand-800">Contato de Emergência</h4>
      </div>
      <p className="text-xs text-brand-600 mb-4">
        Pessoa que podemos contatar em caso de necessidade durante ou após o procedimento.
      </p>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="emergencyContactName" className={labelClass}>
              Nome do contato
            </label>
            <input
              required
              type="text"
              id="emergencyContactName"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={onChange}
              placeholder="Ex: João Silva"
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="emergencyContactPhone" className={`${labelClass} flex items-center gap-1`}>
              Telefone <Phone className="w-3 h-3 text-brand-500" />
            </label>
            <input
              required
              type="tel"
              id="emergencyContactPhone"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={onChange}
              placeholder="(00) 00000-0000"
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="emergencyContactRelationship" className={labelClass}>
            Parentesco / Relação
          </label>
          <select
            id="emergencyContactRelationship"
            name="emergencyContactRelationship"
            value={formData.emergencyContactRelationship}
            onChange={onChange}
            required
            className={`${inputClass} text-brand-700 appearance-none`}
          >
            <option value="" disabled>Selecione</option>
            <option value="conjuge">Cônjuge</option>
            <option value="pai">Pai</option>
            <option value="mae">Mãe</option>
            <option value="filho">Filho(a)</option>
            <option value="irmao">Irmão(ã)</option>
            <option value="outro-familiar">Outro familiar</option>
            <option value="amigo">Amigo(a)</option>
            <option value="outro">Outro</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="emergencyContactNotes" className={`${labelClass} flex items-center gap-1`}>
            Informações adicionais <MessageSquare className="w-3 h-3 text-brand-500" />
          </label>
          <textarea
            id="emergencyContactNotes"
            name="emergencyContactNotes"
            value={formData.emergencyContactNotes}
            onChange={onChange}
            rows={3}
            placeholder="Ex: Horário em que está mais disponível, observações de saúde do contato, etc."
            className={textareaClass}
          />
        </div>
      </div>
    </div>
  </section>
);
