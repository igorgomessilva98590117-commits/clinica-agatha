import React, { useState, useId } from 'react';
import { LogOut, FileText, ChevronDown, ChevronUp, Phone, Instagram, Download } from 'lucide-react';
import { generateTricologiaAnamnesePdf } from '../utils/pdfGenerator';
import { SignaturePad } from './SignaturePad';
import { FinanceDashboard } from './finance/FinanceDashboard';

export interface TricologiaFormData {
  [key: string]: string;
}

const INITIAL_TRICOLOGIA_DATA: TricologiaFormData = {
  nomeCompleto: '',
  dataNascimento: '',
  idade: '',
  sexo: '',
  cpf: '',
  profissao: '',
  telefone: '',
  email: '',
  cidadeEndereco: '',
  queixaPrincipal: '',
  coceira: '',
  dor: '',
  ardencia: '',
  quedaAcentuada: '',
  quedaQuantoTempo: '',
  faltaSensibilidade: '',
  quedaVoltou: '',
  sensibilidadeExacerbada: '',
  fiosNovos: '',
  caspa: '',
  perdaVolume: '',
  afinamentoHaste: '',
  tipoCabelo: '',
  frequenciaLavagem: '',
  perdaOutrosPelos: '',
  diagnosticoPrevio: '',
  tratamentoPrevio: '',
  tratamentoOrientado: '',
  obteveResultados: '',
  eventoMarcante: '',
  problemaSaude: '',
  problemaSaudeQual: '',
  calvicieFamilia: '',
  calvicieParentesco: '',
  doencaCronica: '',
  doencaCronicaQual: '',
  doencasCronicasTipos: '',
  intestino: '',
  intestinoFrequencia: '',
  fonteTermica: '',
  disturbioCirculacao: '',
  desregulacaoHormonal: '',
  desregulacaoHormonalQual: '',
  tumores: '',
  alisamento: '',
  alisamentoFrequencia: '',
  cosmeticos: '',
  penteadosTracao: '',
  penteadosQual: '',
  dorTracao: '',
  transplante: '',
  contraceptivo: '',
  contraceptivoQual: '',
  bebidaAlcoolica: '',
  medicamentoContinuo: '',
  medicamentoMomento: '',
  medicamentoQual: '',
  fuma: '',
  fumaQuantoTempo: '',
  exercicios: '',
  exerciciosFrequencia: '',
  problemasSono: '',
  horasSono: '',
  estressada: '',
  ansiosa: '',
  depressiva: '',
  tratamentoPsiquico: '',
  alergia: '',
  alergiaQual: '',
  cirurgiaRecente: '',
  gestanteLactante: '',
  cicloMenstrual: '',
  fluxoMenstrual: '',
  alimentacao: '',
  exameFisico: '',
  anomaliasHaste: '',
  ostiosFoliculares: '',
  descamacao: '',
  coloracao: '',
  conclusao: '',
  assinatura: '',
  data: '',
  emergencyContactName: '',
  emergencyContactRelationship: '',
  emergencyContactPhone: '',
};

interface DrAgathaAreaProps {
  onLogout: () => void;
}

const TRICOLOGIA_SECTION_IDS = ['dados-pessoais', 'anamnese-capilar', 'historico-saude', 'fisiologia-habitos', 'procedimentos-capilares', 'medicamentos-vicios', 'sono-emocional', 'historico-medico', 'exame-tricoscopia', 'declaracao'];

const inputClass = "w-full min-h-[44px] px-4 py-2.5 rounded-lg border-2 border-brand-200 bg-brand-50 hover:border-brand-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/50 outline-none text-brand-800 placeholder:text-brand-400 transition-colors text-base";

const Section = ({ id, title, expandedSections, onToggle, children }: { id: string; title: string; expandedSections: Set<string>; onToggle: (id: string) => void; children: React.ReactNode }) => (
  <div className="border border-brand-200 rounded-xl overflow-hidden mb-4 bg-white shadow-sm">
    <button
      type="button"
      onClick={() => onToggle(id)}
      className="w-full flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-brand-50 hover:bg-brand-100 active:bg-brand-100 transition-colors text-left touch-manipulation"
    >
      <span className="font-serif font-medium text-brand-800 text-sm sm:text-base">{title}</span>
      {expandedSections.has(id) ? <ChevronUp className="w-5 h-5 text-gold-600 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gold-600 shrink-0" />}
    </button>
    {expandedSections.has(id) && (
      <div className="p-4 sm:p-6 bg-white border-t border-brand-200 space-y-4" style={{ isolation: 'isolate' }}>
        {children}
      </div>
    )}
  </div>
);

const Field = ({ id, label, type = 'text', placeholder = '', multiline = false, rows = 3, value, onChange }: { id: string; label: string; type?: string; placeholder?: string; multiline?: boolean; rows?: number; value: string; onChange: (key: string, value: string) => void }) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-xs font-medium text-brand-600 uppercase tracking-wide">{label}</label>
    {multiline ? (
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        placeholder={placeholder}
        rows={rows}
        autoComplete="off"
        className={`${inputClass} min-h-[80px] resize-y`}
      />
    ) : (
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className={inputClass}
      />
    )}
  </div>
);

const SimNaoField = ({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (key: string, value: string) => void }) => {
  const uid = useId();
  return (
    <div className="flex items-center justify-between gap-4">
      <label htmlFor={uid} className="text-sm text-brand-700 flex-1">{label}</label>
      <div className="flex gap-4" id={uid}>
        <label className="flex items-center gap-1 cursor-pointer">
          <input type="radio" name={uid} checked={value === 'sim'} onChange={() => onChange(id, 'sim')} className="border-brand-300 text-gold-600 accent-gold-600" />
          <span className="text-sm">Sim</span>
        </label>
        <label className="flex items-center gap-1 cursor-pointer">
          <input type="radio" name={uid} checked={value === 'nao'} onChange={() => onChange(id, 'nao')} className="border-brand-300 text-gold-600 accent-gold-600" />
          <span className="text-sm">Não</span>
        </label>
      </div>
    </div>
  );
};

const CheckGroup = ({ id, label, options, value, onChange }: { id: string; label: string; options: string[]; value: string; onChange: (key: string, value: string) => void }) => (
  <div className="space-y-2">
    <span className="text-sm text-brand-700">{label}</span>
    <div className="flex flex-wrap gap-3">
      {options.map(opt => {
        const selected = value === opt;
        return (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name={id} checked={selected} onChange={() => onChange(id, selected ? '' : opt)} className="rounded border-brand-300 text-gold-600 accent-gold-600" />
            <span className="text-sm">{opt}</span>
          </label>
        );
      })}
    </div>
  </div>
);

const CheckMulti = ({ id, label, options, value, onChange }: { id: string; label: string; options: string[]; value: string; onChange: (key: string, value: string) => void }) => {
  const selected = (value || '').split(',').filter(Boolean);
  const toggle = (opt: string) => {
    const next = selected.includes(opt) ? selected.filter(o => o !== opt) : [...selected, opt];
    onChange(id, next.join(','));
  };
  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-brand-700">{label}</span>
      <div className="flex flex-wrap gap-3">
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)} className="rounded border-brand-300 text-gold-600 accent-gold-600" />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const DrAgathaArea: React.FC<DrAgathaAreaProps> = ({ onLogout }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => new Set(TRICOLOGIA_SECTION_IDS));
  const [activeTab, setActiveTab] = useState<'tricologia' | 'geral' | 'financas'>('tricologia');
  const [formData, setFormData] = useState<TricologiaFormData>(INITIAL_TRICOLOGIA_DATA);

  const updateField = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const fd = (k: string) => formData[k] ?? '';

  const tricologiaContent = (
    <>
      <div className="mb-8 p-6 bg-brand-500 rounded-2xl text-center">
        <h1 className="text-2xl font-serif text-gold-500 font-bold mb-1">ÁGATHA SANTOS</h1>
        <p className="text-gold-400 text-sm mb-4">ESTÉTICA AVANÇADA E TRICOLOGIA</p>
        <h2 className="text-lg font-serif text-gold-400 font-medium mb-4">FICHA ANAMNESE - TRICOLOGIA</h2>
        <div className="flex justify-center gap-6 text-gold-400 text-sm">
          <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> (31) 99200-3849</span>
          <span className="flex items-center gap-2"><Instagram className="w-4 h-4" /> @biomed.aga</span>
        </div>
        <p className="text-gold-400/90 text-xs mt-4">Preencha os campos abaixo e clique em Baixar PDF quando terminar.</p>
      </div>

      <Section id="dados-pessoais" title="1. Dados Pessoais" expandedSections={expandedSections} onToggle={toggleSection}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field id="nomeCompleto" label="Nome completo" placeholder="Digite o nome do paciente" value={fd('nomeCompleto')} onChange={updateField} />
          <Field id="dataNascimento" label="Data nascimento" type="date" value={fd('dataNascimento')} onChange={updateField} />
          <Field id="idade" label="Idade" placeholder="Ex: 35" value={fd('idade')} onChange={updateField} />
          <CheckGroup id="sexo" label="Sexo:" options={['Feminino', 'Masculino']} value={fd('sexo')} onChange={updateField} />
          <Field id="cpf" label="CPF" placeholder="000.000.000-00" value={fd('cpf')} onChange={updateField} />
          <Field id="profissao" label="Profissão" placeholder="Ex: Médica, Engenheira" value={fd('profissao')} onChange={updateField} />
          <Field id="telefone" label="Telefone" placeholder="(00) 00000-0000" value={fd('telefone')} onChange={updateField} />
          <Field id="email" label="E-mail" type="email" value={fd('email')} onChange={updateField} />
          <div className="md:col-span-2">
            <Field id="cidadeEndereco" label="Cidade/Endereço" placeholder="Cidade e endereço completo" multiline rows={2} value={fd('cidadeEndereco')} onChange={updateField} />
          </div>
        </div>
      </Section>

      <Section id="anamnese-capilar" title="2. Anamnese Capilar (Queixas e Sintomas)" expandedSections={expandedSections} onToggle={toggleSection}>
        <Field id="queixaPrincipal" label="Queixa principal" placeholder="Descreva a queixa principal" multiline rows={4} value={fd('queixaPrincipal')} onChange={updateField} />
        <div className="space-y-3 pt-2">
          <p className="text-sm font-medium text-brand-700">Sintomas no couro cabeludo:</p>
          <SimNaoField id="coceira" label="Coceira" value={fd('coceira')} onChange={updateField} />
          <SimNaoField id="dor" label="Dor" value={fd('dor')} onChange={updateField} />
          <SimNaoField id="ardencia" label="Ardência/Queimação" value={fd('ardencia')} onChange={updateField} />
        </div>
        <div className="space-y-3 pt-4 border-t border-brand-200">
          <p className="text-sm font-medium text-brand-700">Sobre a Queda:</p>
          <SimNaoField id="quedaAcentuada" label="Queda acentuada?" value={fd('quedaAcentuada')} onChange={updateField} />
          <Field id="quedaQuantoTempo" label="Há quanto tempo?" placeholder="Ex: 6 meses" value={fd('quedaQuantoTempo')} onChange={updateField} />
          <SimNaoField id="faltaSensibilidade" label="Falta de sensibilidade" value={fd('faltaSensibilidade')} onChange={updateField} />
          <SimNaoField id="quedaVoltou" label="Tiveram períodos que a queda cessou e depois voltou?" value={fd('quedaVoltou')} onChange={updateField} />
          <SimNaoField id="sensibilidadeExacerbada" label="Sensibilidade exacerbada" value={fd('sensibilidadeExacerbada')} onChange={updateField} />
        </div>
        <div className="space-y-3 pt-4 border-t border-brand-200">
          <p className="text-sm font-medium text-brand-700">Observações Visuais:</p>
          <SimNaoField id="fiosNovos" label="Nota presença de fios novos?" value={fd('fiosNovos')} onChange={updateField} />
          <SimNaoField id="caspa" label="Presença de caspa/descamação" value={fd('caspa')} onChange={updateField} />
          <SimNaoField id="perdaVolume" label="Houve perda de volume?" value={fd('perdaVolume')} onChange={updateField} />
          <CheckGroup id="afinamentoHaste" label="Afinamento da haste:" options={['Presente', 'Ausente']} value={fd('afinamentoHaste')} onChange={updateField} />
        </div>
        <div className="space-y-3 pt-4 border-t border-brand-200">
          <p className="text-sm font-medium text-brand-700">Características:</p>
          <CheckGroup id="tipoCabelo" label="Tipo de cabelo:" options={['Oleoso em 24h', 'Oleoso em 48h ou mais', 'Seco']} value={fd('tipoCabelo')} onChange={updateField} />
          <Field id="frequenciaLavagem" label="Frequência de lavagem" placeholder="Ex: 2x por semana" value={fd('frequenciaLavagem')} onChange={updateField} />
        </div>
        <div className="space-y-3 pt-4 border-t border-brand-200">
          <p className="text-sm font-medium text-brand-700">Histórico:</p>
          <SimNaoField id="perdaOutrosPelos" label="Há perda de pelos em outras partes do corpo?" value={fd('perdaOutrosPelos')} onChange={updateField} />
          <SimNaoField id="diagnosticoPrevio" label="Diagnóstico prévio" value={fd('diagnosticoPrevio')} onChange={updateField} />
          <SimNaoField id="tratamentoPrevio" label="Tratamento prévio" value={fd('tratamentoPrevio')} onChange={updateField} />
          <SimNaoField id="tratamentoOrientado" label="O tratamento realizado foi orientado por um profissional?" value={fd('tratamentoOrientado')} onChange={updateField} />
          <SimNaoField id="obteveResultados" label="Obteve resultados?" value={fd('obteveResultados')} onChange={updateField} />
          <SimNaoField id="eventoMarcante" label="Houve algum evento marcante que antecedeu a queda?" value={fd('eventoMarcante')} onChange={updateField} />
        </div>
      </Section>

      <Section id="historico-saude" title="3. Histórico de Saúde e Familiar" expandedSections={expandedSections} onToggle={toggleSection}>
        <SimNaoField id="problemaSaude" label="Possui algum problema de saúde hoje" value={fd('problemaSaude')} onChange={updateField} />
        <Field id="problemaSaudeQual" label="Se sim, qual" placeholder="Descreva" multiline rows={2} value={fd('problemaSaudeQual')} onChange={updateField} />
        <SimNaoField id="calvicieFamilia" label="Casos de calvície na família" value={fd('calvicieFamilia')} onChange={updateField} />
        <Field id="calvicieParentesco" label="Se sim, qual parentesco" placeholder="Ex: pai, avô" multiline rows={2} value={fd('calvicieParentesco')} onChange={updateField} />
        <SimNaoField id="doencaCronica" label="Doença crônica" value={fd('doencaCronica')} onChange={updateField} />
        <Field id="doencaCronicaQual" label="Se sim, qual" placeholder="Ex: hipertensão" multiline rows={2} value={fd('doencaCronicaQual')} onChange={updateField} />
        <CheckMulti id="doencasCronicasTipos" label="Se doente crônico, quais:" options={['Hipertensão', 'Diabetes', 'Arritmia', 'Dislipidemia']} value={fd('doencasCronicasTipos')} onChange={updateField} />
      </Section>

      <Section id="fisiologia-habitos" title="4. Fisiologia e Hábitos" expandedSections={expandedSections} onToggle={toggleSection}>
        <CheckGroup id="intestino" label="Funcionamento do intestino:" options={['Regular', 'Constipado']} value={fd('intestino')} onChange={updateField} />
        <Field id="intestinoFrequencia" label="Se constipado, qual frequência" placeholder="Ex: 2x por semana" value={fd('intestinoFrequencia')} onChange={updateField} />
        <SimNaoField id="fonteTermica" label="Uso de fonte térmica (secador/chapinha)" value={fd('fonteTermica')} onChange={updateField} />
        <SimNaoField id="disturbioCirculacao" label="Distúrbio da circulação (trombose, embolia, hemorragia)" value={fd('disturbioCirculacao')} onChange={updateField} />
        <SimNaoField id="desregulacaoHormonal" label="Desregulação hormonal" value={fd('desregulacaoHormonal')} onChange={updateField} />
        <Field id="desregulacaoHormonalQual" label="Se sim, qual" placeholder="Descreva" multiline rows={2} value={fd('desregulacaoHormonalQual')} onChange={updateField} />
        <SimNaoField id="tumores" label="Histórico de tumores ou nódulos malignos (Pessoal ou familiar)" value={fd('tumores')} onChange={updateField} />
      </Section>

      <Section id="procedimentos-capilares" title="5. Procedimentos Capilares" expandedSections={expandedSections} onToggle={toggleSection}>
        <SimNaoField id="alisamento" label="Faz alisamento químico" value={fd('alisamento')} onChange={updateField} />
        <Field id="alisamentoFrequencia" label="Se sim, qual frequência" value={fd('alisamentoFrequencia')} onChange={updateField} />
        <Field id="cosmeticos" label="Quais cosméticos utiliza no cabelo" placeholder="Shampoo, condicionador..." multiline rows={3} value={fd('cosmeticos')} onChange={updateField} />
        <SimNaoField id="penteadosTracao" label="Usa penteados que causam tração" value={fd('penteadosTracao')} onChange={updateField} />
        <Field id="penteadosQual" label="Se sim, qual" placeholder="Ex: coque, tranças" multiline rows={2} value={fd('penteadosQual')} onChange={updateField} />
        <SimNaoField id="dorTracao" label="Sente dor decorrente dessa tração" value={fd('dorTracao')} onChange={updateField} />
        <SimNaoField id="transplante" label="Fez transplante capilar" value={fd('transplante')} onChange={updateField} />
      </Section>

      <Section id="medicamentos-vicios" title="6. Medicamentos e Vícios" expandedSections={expandedSections} onToggle={toggleSection}>
        <SimNaoField id="contraceptivo" label="Uso de contraceptivo" value={fd('contraceptivo')} onChange={updateField} />
        <Field id="contraceptivoQual" label="Se sim, qual" placeholder="Ex: pílula, DIU" multiline rows={2} value={fd('contraceptivoQual')} onChange={updateField} />
        <CheckGroup id="bebidaAlcoolica" label="Bebida alcoólica:" options={['Diariamente', 'Socialmente', 'Não']} value={fd('bebidaAlcoolica')} onChange={updateField} />
        <SimNaoField id="medicamentoContinuo" label="Faz uso de medicamento contínuo" value={fd('medicamentoContinuo')} onChange={updateField} />
        <SimNaoField id="medicamentoMomento" label="Está fazendo uso de algum medicamento no momento" value={fd('medicamentoMomento')} onChange={updateField} />
        <Field id="medicamentoQual" label="Se sim, qual" placeholder="Nome dos medicamentos" multiline rows={3} value={fd('medicamentoQual')} onChange={updateField} />
        <SimNaoField id="fuma" label="Fuma" value={fd('fuma')} onChange={updateField} />
        <Field id="fumaQuantoTempo" label="Há quanto tempo?" value={fd('fumaQuantoTempo')} onChange={updateField} />
        <SimNaoField id="exercicios" label="Pratica exercícios físicos" value={fd('exercicios')} onChange={updateField} />
        <Field id="exerciciosFrequencia" label="Se sim, qual frequência" placeholder="Ex: 3x por semana" value={fd('exerciciosFrequencia')} onChange={updateField} />
      </Section>

      <Section id="sono-emocional" title="7. Sono e Emocional" expandedSections={expandedSections} onToggle={toggleSection}>
        <SimNaoField id="problemasSono" label="Possui problemas relacionado ao sono" value={fd('problemasSono')} onChange={updateField} />
        <Field id="horasSono" label="Quantidade de horas de sono por noite" placeholder="Ex: 7 horas" value={fd('horasSono')} onChange={updateField} />
        <div className="space-y-2 pt-2">
          <p className="text-sm font-medium text-brand-700">Perfil Emocional:</p>
          <SimNaoField id="estressada" label="Se julga uma pessoa estressada" value={fd('estressada')} onChange={updateField} />
          <SimNaoField id="ansiosa" label="Ansiosa" value={fd('ansiosa')} onChange={updateField} />
          <SimNaoField id="depressiva" label="Depressiva" value={fd('depressiva')} onChange={updateField} />
          <SimNaoField id="tratamentoPsiquico" label="Faz algum tratamento de cunho psíquico" value={fd('tratamentoPsiquico')} onChange={updateField} />
        </div>
      </Section>

      <Section id="historico-medico" title="8. Histórico Médico Adicional" expandedSections={expandedSections} onToggle={toggleSection}>
        <SimNaoField id="alergia" label="Alergia" value={fd('alergia')} onChange={updateField} />
        <Field id="alergiaQual" label="Se sim, qual" placeholder="Descreva a(s) alergia(s)" multiline rows={2} value={fd('alergiaQual')} onChange={updateField} />
        <SimNaoField id="cirurgiaRecente" label="Cirurgia recente" value={fd('cirurgiaRecente')} onChange={updateField} />
        <SimNaoField id="gestanteLactante" label="(Mulheres) Gestante ou lactante" value={fd('gestanteLactante')} onChange={updateField} />
        <CheckGroup id="cicloMenstrual" label="Ciclo Menstrual:" options={['Regular', 'Irregular']} value={fd('cicloMenstrual')} onChange={updateField} />
        <CheckGroup id="fluxoMenstrual" label="Fluxo menstrual:" options={['Intenso', 'Moderado', 'Baixo']} value={fd('fluxoMenstrual')} onChange={updateField} />
      </Section>

      <Section id="exame-tricoscopia" title="9. Exame Físico e Tricoscopia" expandedSections={expandedSections} onToggle={toggleSection}>
        <Field id="alimentacao" label="1. Alimentação" placeholder="Avaliação da alimentação" multiline rows={4} value={fd('alimentacao')} onChange={updateField} />
        <Field id="exameFisico" label="2. Exame Físico" placeholder="Observações do exame" multiline rows={4} value={fd('exameFisico')} onChange={updateField} />
        <div className="pt-4 space-y-4 border-t border-brand-200">
          <p className="font-medium text-brand-800">TRICOSCOPIA</p>
          <CheckGroup id="anomaliasHaste" label="Anomalias/Fragilidades da haste:" options={['Ausente', 'Presente']} value={fd('anomaliasHaste')} onChange={updateField} />
          <CheckMulti id="ostiosFoliculares" label="Óstios foliculares:" options={['Normal', 'Preto', 'Branco', 'Amarelo', 'Vermelho', 'Cinza/azulado']} value={fd('ostiosFoliculares')} onChange={updateField} />
          <CheckMulti id="descamacao" label="Epiderme peri/interfolicular - Descamação:" options={['Normal (Ausente)', 'Descamação difusa', 'Descamação localizada', 'Descamação perifolicular']} value={fd('descamacao')} onChange={updateField} />
          <CheckMulti id="coloracao" label="Coloração:" options={['Cor castanha', 'Cor rosa', 'Cor vermelha', 'Cor amarela', 'Cor branca', 'Cor azul/violáceo']} value={fd('coloracao')} onChange={updateField} />
          <Field id="conclusao" label="CONCLUSÃO" placeholder="Conclusão da avaliação" multiline rows={4} value={fd('conclusao')} onChange={updateField} />
        </div>
      </Section>

      <Section id="declaracao" title="10. Declaração e Assinatura" expandedSections={expandedSections} onToggle={toggleSection}>
        <p className="text-brand-700 text-sm leading-relaxed italic mb-6">
          &quot;Eu declaro que todas as informações fornecidas nesta ficha são verdadeiras e completas, e autorizo a utilização destes dados para fins de planejamento e execução de tratamentos estéticos na clínica.&quot;
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SignaturePad label="Assinatura do paciente" value={fd('assinatura')} onChange={(v) => updateField('assinatura', v)} height={120} />
          <Field id="data" label="Data" type="date" value={fd('data')} onChange={updateField} />
        </div>
      </Section>
    </>
  );

  const modeloGeralContent = (
    <>
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-200/50 rounded-lg mb-4">
          <FileText className="w-5 h-5 text-gold-600" />
          <span className="text-sm font-medium text-brand-700">Ficha de Anamnese Clínica Estética - Modelo Geral</span>
        </div>
      </div>
      <Section id="dados-pessoais" title="1. Identificação / Dados Pessoais" expandedSections={expandedSections} onToggle={toggleSection}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field id="nomeCompleto" label="Nome Completo" value={fd('nomeCompleto')} onChange={updateField} />
          <Field id="dataNascimento" label="Data de Nascimento" type="date" value={fd('dataNascimento')} onChange={updateField} />
          <Field id="cpf" label="CPF" value={fd('cpf')} onChange={updateField} />
          <Field id="profissao" label="Profissão" placeholder="Ex: Médica, Engenheira" value={fd('profissao')} onChange={updateField} />
          <Field id="telefone" label="Telefone" value={fd('telefone')} onChange={updateField} />
          <Field id="email" label="E-mail" value={fd('email')} onChange={updateField} />
          <div className="md:col-span-2"><Field id="cidadeEndereco" label="Endereço Completo" placeholder="Endereço completo" multiline rows={2} value={fd('cidadeEndereco')} onChange={updateField} /></div>
        </div>
      </Section>
      <Section id="contato-emergencia" title="2. Contato de Emergência" expandedSections={expandedSections} onToggle={toggleSection}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field id="emergencyContactName" label="Nome do Contato" value={fd('emergencyContactName')} onChange={updateField} />
          <Field id="emergencyContactRelationship" label="Parentesco" value={fd('emergencyContactRelationship')} onChange={updateField} />
          <Field id="emergencyContactPhone" label="Telefone" value={fd('emergencyContactPhone')} onChange={updateField} />
        </div>
      </Section>
    </>
  );

  const formContent = activeTab === 'financas' ? <FinanceDashboard /> : activeTab === 'tricologia' ? tricologiaContent : modeloGeralContent;

  const handleDownloadPdf = async () => {
    try {
      await generateTricologiaAnamnesePdf(formData);
    } catch (e) {
      console.error('Erro ao gerar PDF:', e);
      alert('Erro ao gerar o PDF. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-100">
      <header className="bg-brand-500 border-b border-gold-500/30 py-3 px-4 sm:py-4 sm:px-6 safe-area-top">
        <div className="container mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <h1 className="text-lg sm:text-xl font-serif text-gold-500 font-semibold">Ágatha Santos - Área Restrita</h1>
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-gold-400 hover:text-gold-300 hover:bg-gold-500/10 rounded-lg transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </header>

      <main className={`flex-grow container mx-auto px-4 sm:px-6 py-6 sm:py-8 safe-area-x ${activeTab === 'financas' ? 'max-w-6xl' : 'max-w-3xl'}`}>
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-6">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setActiveTab('tricologia'); setExpandedSections(new Set(TRICOLOGIA_SECTION_IDS)); }}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'tricologia' ? 'bg-brand-500 text-gold-500' : 'bg-brand-200 text-brand-700 hover:bg-brand-300'}`}
            >
              Tricologia
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('geral'); setExpandedSections(new Set(['dados-pessoais', 'contato-emergencia'])); }}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'geral' ? 'bg-brand-500 text-gold-500' : 'bg-brand-200 text-brand-700 hover:bg-brand-300'}`}
            >
              Modelo Geral
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('financas')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'financas' ? 'bg-brand-500 text-gold-500' : 'bg-brand-200 text-brand-700 hover:bg-brand-300'}`}
            >
              Finanças
            </button>
          </div>
          {activeTab === 'tricologia' && (
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-brand-900 font-medium rounded-lg text-sm transition-colors shadow-md"
            >
              <Download className="w-4 h-4" />
              Baixar PDF
            </button>
          )}
        </div>

        {formContent}

        {activeTab !== 'financas' && (
          <p className="text-center text-xs text-brand-500 mt-8">
            Ágatha Santos - Estética Avançada e Tricologia
          </p>
        )}
      </main>
    </div>
  );
};

export default DrAgathaArea;
