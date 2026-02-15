import React, { useState, useId } from 'react';
import { LogOut, FileText, ChevronDown, ChevronUp, Phone, Instagram, Download } from 'lucide-react';
import { generateTricologiaAnamnesePdf } from '../utils/pdfGenerator';

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

const DrAgathaArea: React.FC<DrAgathaAreaProps> = ({ onLogout }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => new Set(TRICOLOGIA_SECTION_IDS));
  const [activeTab, setActiveTab] = useState<'tricologia' | 'geral'>('tricologia');
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

  const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <div className="border border-brand-200 rounded-xl overflow-hidden mb-4 bg-white">
      <button
        type="button"
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between px-6 py-4 bg-brand-50 hover:bg-brand-100 transition-colors text-left"
      >
        <span className="font-serif font-medium text-brand-800">{title}</span>
        {expandedSections.has(id) ? <ChevronUp className="w-5 h-5 text-gold-600" /> : <ChevronDown className="w-5 h-5 text-gold-600" />}
      </button>
      {expandedSections.has(id) && (
        <div className="p-6 bg-white border-t border-brand-200 space-y-4" style={{ isolation: 'isolate' }}>
          {children}
        </div>
      )}
    </div>
  );

  const Field = ({ id, label, type = 'text', placeholder = '' }: { id: string; label: string; type?: string; placeholder?: string }) => (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-xs font-medium text-brand-600 uppercase tracking-wide">{label}</label>
      <input
        id={id}
        type={type}
        value={formData[id] ?? ''}
        onChange={(e) => updateField(id, e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full min-h-[44px] px-4 py-2.5 rounded-lg border-2 border-brand-200 bg-brand-50 hover:border-brand-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/50 outline-none text-brand-800 placeholder:text-brand-400 transition-colors"
      />
    </div>
  );

  const SimNaoField = ({ id, label }: { id: string; label: string }) => {
    const uid = useId();
    const value = formData[id] ?? '';
    return (
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={uid} className="text-sm text-brand-700 flex-1">{label}</label>
        <div className="flex gap-4" id={uid}>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name={uid}
              checked={value === 'sim'}
              onChange={() => updateField(id, 'sim')}
              className="border-brand-300 text-gold-600 accent-gold-600"
            />
            <span className="text-sm">Sim</span>
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name={uid}
              checked={value === 'nao'}
              onChange={() => updateField(id, 'nao')}
              className="border-brand-300 text-gold-600 accent-gold-600"
            />
            <span className="text-sm">Não</span>
          </label>
        </div>
      </div>
    );
  };

  const CheckGroup = ({ id, label, options }: { id: string; label: string; options: string[] }) => (
    <div className="space-y-2">
      <span className="text-sm text-brand-700">{label}</span>
      <div className="flex flex-wrap gap-3">
        {options.map(opt => {
          const selected = formData[id] === opt;
          return (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={id}
                checked={selected}
                onChange={() => updateField(id, selected ? '' : opt)}
                className="rounded border-brand-300 text-gold-600 accent-gold-600"
              />
              <span className="text-sm">{opt}</span>
            </label>
          );
        })}
      </div>
    </div>
  );

  const CheckMulti = ({ id, label, options }: { id: string; label: string; options: string[] }) => {
    const selected = (formData[id] || '').split(',').filter(Boolean);
    const toggle = (opt: string) => {
      const next = selected.includes(opt)
        ? selected.filter(o => o !== opt)
        : [...selected, opt];
      updateField(id, next.join(','));
    };
    return (
      <div className="space-y-2">
        <span className="text-sm font-medium text-brand-700">{label}</span>
        <div className="flex flex-wrap gap-3">
          {options.map(opt => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggle(opt)}
                className="rounded border-brand-300 text-gold-600 accent-gold-600"
              />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const TricologiaForm = () => (
    <>
      <div className="mb-8 p-6 bg-brand-500 rounded-2xl text-center">
        <h1 className="text-2xl font-serif text-gold-500 font-bold mb-1">AGATHA SANTOS</h1>
        <p className="text-gold-400 text-sm mb-4">ESTÉTICA AVANÇADA E TRICOLOGIA</p>
        <h2 className="text-lg font-serif text-gold-400 font-medium mb-4">FICHA ANAMNESE - TRICOLOGIA</h2>
        <div className="flex justify-center gap-6 text-gold-400 text-sm">
          <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> (31) 99200-3849</span>
          <span className="flex items-center gap-2"><Instagram className="w-4 h-4" /> @biomed.aga</span>
        </div>
        <p className="text-gold-400/90 text-xs mt-4">Preencha os campos abaixo e clique em Baixar PDF quando terminar.</p>
      </div>

      <Section id="dados-pessoais" title="1. Dados Pessoais">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field id="nomeCompleto" label="Nome completo" placeholder="Digite o nome do paciente" />
          <Field id="dataNascimento" label="Data nascimento" type="date" />
          <Field id="idade" label="Idade" placeholder="Ex: 35" />
          <CheckGroup id="sexo" label="Sexo:" options={['Feminino', 'Masculino']} />
          <Field id="cpf" label="CPF" placeholder="000.000.000-00" />
          <Field id="profissao" label="Profissão" />
          <Field id="telefone" label="Telefone" placeholder="(00) 00000-0000" />
          <Field id="email" label="E-mail" type="email" />
          <div className="md:col-span-2">
            <Field id="cidadeEndereco" label="Cidade/Endereço" placeholder="Cidade e endereço completo" />
          </div>
        </div>
      </Section>

      <Section id="anamnese-capilar" title="2. Anamnese Capilar (Queixas e Sintomas)">
        <Field id="queixaPrincipal" label="Queixa principal" placeholder="Descreva a queixa principal" />
        <div className="space-y-3 pt-2">
          <p className="text-sm font-medium text-brand-700">Sintomas no couro cabeludo:</p>
          <SimNaoField id="coceira" label="Coceira" />
          <SimNaoField id="dor" label="Dor" />
          <SimNaoField id="ardencia" label="Ardência/Queimação" />
        </div>
        <div className="space-y-3 pt-4 border-t border-brand-200">
          <p className="text-sm font-medium text-brand-700">Sobre a Queda:</p>
          <SimNaoField id="quedaAcentuada" label="Queda acentuada?" />
          <Field id="quedaQuantoTempo" label="Há quanto tempo?" placeholder="Ex: 6 meses" />
          <SimNaoField id="faltaSensibilidade" label="Falta de sensibilidade" />
          <SimNaoField id="quedaVoltou" label="Tiveram períodos que a queda cessou e depois voltou?" />
          <SimNaoField id="sensibilidadeExacerbada" label="Sensibilidade exacerbada" />
        </div>
        <div className="space-y-3 pt-4 border-t border-brand-200">
          <p className="text-sm font-medium text-brand-700">Observações Visuais:</p>
          <SimNaoField id="fiosNovos" label="Nota presença de fios novos?" />
          <SimNaoField id="caspa" label="Presença de caspa/descamação" />
          <SimNaoField id="perdaVolume" label="Houve perda de volume?" />
          <CheckGroup id="afinamentoHaste" label="Afinamento da haste:" options={['Presente', 'Ausente']} />
        </div>
        <div className="space-y-3 pt-4 border-t border-brand-200">
          <p className="text-sm font-medium text-brand-700">Características:</p>
          <CheckGroup id="tipoCabelo" label="Tipo de cabelo:" options={['Oleoso em 24h', 'Oleoso em 48h ou mais', 'Seco']} />
          <Field id="frequenciaLavagem" label="Frequência de lavagem" placeholder="Ex: 2x por semana" />
        </div>
        <div className="space-y-3 pt-4 border-t border-brand-200">
          <p className="text-sm font-medium text-brand-700">Histórico:</p>
          <SimNaoField id="perdaOutrosPelos" label="Há perda de pelos em outras partes do corpo?" />
          <SimNaoField id="diagnosticoPrevio" label="Diagnóstico prévio" />
          <SimNaoField id="tratamentoPrevio" label="Tratamento prévio" />
          <SimNaoField id="tratamentoOrientado" label="O tratamento realizado foi orientado por um profissional?" />
          <SimNaoField id="obteveResultados" label="Obteve resultados?" />
          <SimNaoField id="eventoMarcante" label="Houve algum evento marcante que antecedeu a queda?" />
        </div>
      </Section>

      <Section id="historico-saude" title="3. Histórico de Saúde e Familiar">
        <SimNaoField id="problemaSaude" label="Possui algum problema de saúde hoje" />
        <Field id="problemaSaudeQual" label="Se sim, qual" placeholder="Descreva" />
        <SimNaoField id="calvicieFamilia" label="Casos de calvície na família" />
        <Field id="calvicieParentesco" label="Se sim, qual parentesco" placeholder="Ex: pai, avô" />
        <SimNaoField id="doencaCronica" label="Doença crônica" />
        <Field id="doencaCronicaQual" label="Se sim, qual" placeholder="Ex: hipertensão" />
        <CheckMulti id="doencasCronicasTipos" label="Se doente crônico, quais:" options={['Hipertensão', 'Diabetes', 'Arritmia', 'Dislipidemia']} />
      </Section>

      <Section id="fisiologia-habitos" title="4. Fisiologia e Hábitos">
        <CheckGroup id="intestino" label="Funcionamento do intestino:" options={['Regular', 'Constipado']} />
        <Field id="intestinoFrequencia" label="Se constipado, qual frequência" placeholder="Ex: 2x por semana" />
        <SimNaoField id="fonteTermica" label="Uso de fonte térmica (secador/chapinha)" />
        <SimNaoField id="disturbioCirculacao" label="Distúrbio da circulação (trombose, embolia, hemorragia)" />
        <SimNaoField id="desregulacaoHormonal" label="Desregulação hormonal" />
        <Field id="desregulacaoHormonalQual" label="Se sim, qual" />
        <SimNaoField id="tumores" label="Histórico de tumores ou nódulos malignos (Pessoal ou familiar)" />
      </Section>

      <Section id="procedimentos-capilares" title="5. Procedimentos Capilares">
        <SimNaoField id="alisamento" label="Faz alisamento químico" />
        <Field id="alisamentoFrequencia" label="Se sim, qual frequência" />
        <Field id="cosmeticos" label="Quais cosméticos utiliza no cabelo" placeholder="Shampoo, condicionador..." />
        <SimNaoField id="penteadosTracao" label="Usa penteados que causam tração" />
        <Field id="penteadosQual" label="Se sim, qual" placeholder="Ex: coque, tranças" />
        <SimNaoField id="dorTracao" label="Sente dor decorrente dessa tração" />
        <SimNaoField id="transplante" label="Fez transplante capilar" />
      </Section>

      <Section id="medicamentos-vicios" title="6. Medicamentos e Vícios">
        <SimNaoField id="contraceptivo" label="Uso de contraceptivo" />
        <Field id="contraceptivoQual" label="Se sim, qual" />
        <CheckGroup id="bebidaAlcoolica" label="Bebida alcoólica:" options={['Diariamente', 'Socialmente', 'Não']} />
        <SimNaoField id="medicamentoContinuo" label="Faz uso de medicamento contínuo" />
        <SimNaoField id="medicamentoMomento" label="Está fazendo uso de algum medicamento no momento" />
        <Field id="medicamentoQual" label="Se sim, qual" placeholder="Nome dos medicamentos" />
        <SimNaoField id="fuma" label="Fuma" />
        <Field id="fumaQuantoTempo" label="Há quanto tempo?" />
        <SimNaoField id="exercicios" label="Pratica exercícios físicos" />
        <Field id="exerciciosFrequencia" label="Se sim, qual frequência" placeholder="Ex: 3x por semana" />
      </Section>

      <Section id="sono-emocional" title="7. Sono e Emocional">
        <SimNaoField id="problemasSono" label="Possui problemas relacionado ao sono" />
        <Field id="horasSono" label="Quantidade de horas de sono por noite" placeholder="Ex: 7 horas" />
        <div className="space-y-2 pt-2">
          <p className="text-sm font-medium text-brand-700">Perfil Emocional:</p>
          <SimNaoField id="estressada" label="Se julga uma pessoa estressada" />
          <SimNaoField id="ansiosa" label="Ansiosa" />
          <SimNaoField id="depressiva" label="Depressiva" />
          <SimNaoField id="tratamentoPsiquico" label="Faz algum tratamento de cunho psíquico" />
        </div>
      </Section>

      <Section id="historico-medico" title="8. Histórico Médico Adicional">
        <SimNaoField id="alergia" label="Alergia" />
        <Field id="alergiaQual" label="Se sim, qual" />
        <SimNaoField id="cirurgiaRecente" label="Cirurgia recente" />
        <SimNaoField id="gestanteLactante" label="(Mulheres) Gestante ou lactante" />
        <CheckGroup id="cicloMenstrual" label="Ciclo Menstrual:" options={['Regular', 'Irregular']} />
        <CheckGroup id="fluxoMenstrual" label="Fluxo menstrual:" options={['Intenso', 'Moderado', 'Baixo']} />
      </Section>

      <Section id="exame-tricoscopia" title="9. Exame Físico e Tricoscopia">
        <Field id="alimentacao" label="1. Alimentação" placeholder="Avaliação da alimentação" />
        <Field id="exameFisico" label="2. Exame Físico" placeholder="Observações do exame" />
        <div className="pt-4 space-y-4 border-t border-brand-200">
          <p className="font-medium text-brand-800">TRICOSCOPIA</p>
          <CheckGroup id="anomaliasHaste" label="Anomalias/Fragilidades da haste:" options={['Ausente', 'Presente']} />
          <CheckMulti id="ostiosFoliculares" label="Óstios foliculares:" options={['Normal', 'Preto', 'Branco', 'Amarelo', 'Vermelho', 'Cinza/azulado']} />
          <CheckMulti id="descamacao" label="Epiderme peri/interfolicular - Descamação:" options={['Normal (Ausente)', 'Descamação difusa', 'Descamação localizada', 'Descamação perifolicular']} />
          <CheckMulti id="coloracao" label="Coloração:" options={['Cor castanha', 'Cor rosa', 'Cor vermelha', 'Cor amarela', 'Cor branca', 'Cor azul/violáceo']} />
          <Field id="conclusao" label="CONCLUSÃO" placeholder="Conclusão da avaliação" />
        </div>
      </Section>

      <Section id="declaracao" title="10. Declaração e Assinatura">
        <p className="text-brand-700 text-sm leading-relaxed italic mb-6">
          &quot;Eu declaro que todas as informações fornecidas nesta ficha são verdadeiras e completas, e autorizo a utilização destes dados para fins de planejamento e execução de tratamentos estéticos na clínica.&quot;
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field id="assinatura" label="Assinatura do paciente" placeholder="Nome para assinatura" />
          <Field id="data" label="Data" type="date" />
        </div>
      </Section>
    </>
  );

  const ModeloGeralForm = () => (
    <>
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-200/50 rounded-lg mb-4">
          <FileText className="w-5 h-5 text-gold-600" />
          <span className="text-sm font-medium text-brand-700">Ficha de Anamnese Clínica Estética - Modelo Geral</span>
        </div>
      </div>
      <Section id="dados-pessoais" title="1. Identificação / Dados Pessoais">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field id="nomeCompleto" label="Nome Completo" />
          <Field id="dataNascimento" label="Data de Nascimento" type="date" />
          <Field id="cpf" label="CPF" />
          <Field id="profissao" label="Profissão" />
          <Field id="telefone" label="Telefone" />
          <Field id="email" label="E-mail" />
          <div className="md:col-span-2"><Field id="cidadeEndereco" label="Endereço Completo" /></div>
        </div>
      </Section>
      <Section id="contato-emergencia" title="2. Contato de Emergência">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field id="emergencyContactName" label="Nome do Contato" />
          <Field id="emergencyContactRelationship" label="Parentesco" />
          <Field id="emergencyContactPhone" label="Telefone" />
        </div>
      </Section>
    </>
  );

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
      <header className="bg-brand-500 border-b border-gold-500/30 py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-serif text-gold-500 font-semibold">Dr Agatha - Área Restrita</h1>
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

      <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
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

        {activeTab === 'tricologia' ? <TricologiaForm /> : <ModeloGeralForm />}

        <p className="text-center text-xs text-brand-500 mt-8">
          Agatha Santos - Estética Avançada e Tricologia
        </p>
      </main>
    </div>
  );
};

export default DrAgathaArea;
