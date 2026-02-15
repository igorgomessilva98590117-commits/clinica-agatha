import React, { useState, useId } from 'react';
import { LogOut, FileText, ChevronDown, ChevronUp, Phone, Instagram, Download } from 'lucide-react';
import { generateTricologiaAnamnesePdf } from '../utils/pdfGenerator';

interface DrAgathaAreaProps {
  onLogout: () => void;
}

const DrAgathaArea: React.FC<DrAgathaAreaProps> = ({ onLogout }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('dados-pessoais');
  const [activeTab, setActiveTab] = useState<'tricologia' | 'geral'>('tricologia');

  const toggleSection = (id: string) => {
    setExpandedSection(prev => prev === id ? null : id);
  };

  const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <div className="border border-brand-200 rounded-xl overflow-hidden mb-4">
      <button
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between px-6 py-4 bg-brand-50 hover:bg-brand-100 transition-colors text-left"
      >
        <span className="font-serif font-medium text-brand-800">{title}</span>
        {expandedSection === id ? <ChevronUp className="w-5 h-5 text-gold-600" /> : <ChevronDown className="w-5 h-5 text-gold-600" />}
      </button>
      {expandedSection === id && (
        <div className="p-6 bg-white border-t border-brand-200 space-y-4">
          {children}
        </div>
      )}
    </div>
  );

  const Field = ({ label }: { label: string }) => (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-brand-600 uppercase tracking-wide">{label}</label>
      <div className="min-h-[40px] px-4 py-2 rounded-lg border border-brand-200 bg-brand-50/50 text-brand-800"></div>
    </div>
  );

  const SimNaoField = ({ label }: { label: string }) => {
    const id = useId();
    return (
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-sm text-brand-700 flex-1">{label}</label>
        <div className="flex gap-4" id={id}>
          <label className="flex items-center gap-1 cursor-pointer">
            <input type="radio" name={id} className="border-brand-300 text-gold-600 accent-gold-600" />
            <span className="text-sm">Sim</span>
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input type="radio" name={id} className="border-brand-300 text-gold-600 accent-gold-600" />
            <span className="text-sm">Não</span>
          </label>
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
      </div>

      <Section id="dados-pessoais" title="1. Dados Pessoais">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nome completo" />
          <Field label="Data nascimento" />
          <Field label="Idade" />
          <div className="flex items-center gap-4">
            <span className="text-sm text-brand-700">Sexo:</span>
            <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Femin.</label>
            <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Masc.</label>
          </div>
          <Field label="CPF" />
          <Field label="Profissão" />
          <Field label="Telefone" />
          <Field label="E-mail" />
          <div className="md:col-span-2"><Field label="Cidade/Endereço" /></div>
        </div>
      </Section>

      <Section id="anamnese-capilar" title="2. Anamnese Capilar (Queixas e Sintomas)">
        <Field label="Queixa principal" />
        <div className="space-y-3 pt-2">
          <p className="text-sm font-medium text-brand-700">Sintomas no couro cabeludo:</p>
          <SimNaoField label="Coceira" />
          <SimNaoField label="Dor" />
          <SimNaoField label="Ardência/Queimação" />
        </div>
        <div className="space-y-3 pt-4 border-t border-brand-200">
          <p className="text-sm font-medium text-brand-700">Sobre a Queda:</p>
          <SimNaoField label="Queda acentuada?" />
          <Field label="Há quanto tempo?" />
          <SimNaoField label="Falta de sensibilidade" />
          <SimNaoField label="Tiveram períodos que a queda cessou e depois voltou?" />
          <SimNaoField label="Sensibilidade exacerbada" />
        </div>
        <div className="space-y-3 pt-4 border-t border-brand-200">
          <p className="text-sm font-medium text-brand-700">Observações Visuais:</p>
          <SimNaoField label="Nota presença de fios novos?" />
          <SimNaoField label="Presença de caspa/descamação" />
          <SimNaoField label="Houve perda de volume?" />
          <div className="flex items-center gap-4">
            <span className="text-sm text-brand-700">Afinamento da haste:</span>
            <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Presente</label>
            <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Ausente</label>
          </div>
        </div>
        <div className="space-y-3 pt-4 border-t border-brand-200">
          <p className="text-sm font-medium text-brand-700">Características:</p>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Oleoso em 24h</label>
            <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Oleoso em 48h ou mais</label>
            <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Seco</label>
          </div>
          <Field label="Frequência de lavagem" />
        </div>
        <div className="space-y-3 pt-4 border-t border-brand-200">
          <p className="text-sm font-medium text-brand-700">Histórico:</p>
          <SimNaoField label="Há perda de pelos em outras partes do corpo?" />
          <SimNaoField label="Diagnóstico prévio" />
          <SimNaoField label="Tratamento prévio" />
          <SimNaoField label="O tratamento realizado foi orientado por um profissional?" />
          <SimNaoField label="Obteve resultados?" />
          <SimNaoField label="Houve algum evento marcante que antecedeu a queda?" />
        </div>
      </Section>

      <Section id="historico-saude" title="3. Histórico de Saúde e Familiar">
        <SimNaoField label="Possui algum problema de saúde hoje" />
        <Field label="Se sim, qual" />
        <SimNaoField label="Casos de calvície na família" />
        <Field label="Se sim, qual parentesco" />
        <SimNaoField label="Doença crônica" />
        <Field label="Se sim, qual" />
        <div className="flex flex-wrap gap-4 pt-2">
          <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Hipertensão</label>
          <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Diabetes</label>
          <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Arritmia</label>
          <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Dislipidemia</label>
        </div>
      </Section>

      <Section id="fisiologia-habitos" title="4. Fisiologia e Hábitos">
        <div className="flex gap-4">
          <span className="text-sm text-brand-700">Funcionamento do intestino:</span>
          <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Regular</label>
          <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Constipado</label>
        </div>
        <Field label="Se sim (constipado), qual frequência" />
        <SimNaoField label="Uso de fonte térmica (secador/chapinha)" />
        <SimNaoField label="Distúrbio da circulação (trombose, embolia, hemorragia)" />
        <SimNaoField label="Desregulação hormonal" />
        <Field label="Se sim, qual" />
        <SimNaoField label="Histórico de tumores ou nódulos malignos (Pessoal ou familiar)" />
      </Section>

      <Section id="procedimentos-capilares" title="5. Procedimentos Capilares">
        <SimNaoField label="Faz alisamento químico" />
        <Field label="Se sim, qual frequência" />
        <Field label="Quais cosméticos utiliza no cabelo" />
        <SimNaoField label="Usa penteados que causam tração" />
        <Field label="Se sim, qual" />
        <SimNaoField label="Sente dor decorrente dessa tração" />
        <SimNaoField label="Fez transplante capilar" />
      </Section>

      <Section id="medicamentos-vicios" title="6. Medicamentos e Vícios">
        <SimNaoField label="Uso de contraceptivo" />
        <Field label="Se sim, qual" />
        <div className="flex flex-wrap gap-4">
          <span className="text-sm text-brand-700">Bebida alcoólica:</span>
          <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Diariamente</label>
          <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Socialmente</label>
          <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Não</label>
        </div>
        <SimNaoField label="Faz uso de medicamento contínuo" />
        <SimNaoField label="Está fazendo uso de algum medicamento no momento" />
        <Field label="Se sim, qual" />
        <SimNaoField label="Fuma" />
        <Field label="Há quanto tempo?" />
        <SimNaoField label="Pratica exercícios físicos" />
        <Field label="Se sim, qual frequência" />
      </Section>

      <Section id="sono-emocional" title="7. Sono e Emocional">
        <SimNaoField label="Possui problemas relacionado ao sono" />
        <Field label="Quantidade de horas de sono por noite" />
        <div className="space-y-2 pt-2">
          <p className="text-sm font-medium text-brand-700">Perfil Emocional:</p>
          <SimNaoField label="Se julga uma pessoa estressada" />
          <SimNaoField label="Ansiosa" />
          <SimNaoField label="Depressiva" />
          <SimNaoField label="Faz algum tratamento de cunho psíquico" />
        </div>
      </Section>

      <Section id="historico-medico" title="8. Histórico Médico Adicional">
        <SimNaoField label="Alergia" />
        <Field label="Se sim, qual" />
        <SimNaoField label="Cirurgia recente" />
        <SimNaoField label="(Mulheres) Gestante ou lactante" />
        <div className="flex gap-4">
          <span className="text-sm text-brand-700">Ciclo Menstrual:</span>
          <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Regular</label>
          <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Irregular</label>
        </div>
        <div className="flex flex-wrap gap-4">
          <span className="text-sm text-brand-700">Fluxo menstrual:</span>
          <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Intenso</label>
          <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Moderado</label>
          <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Baixo</label>
        </div>
      </Section>

      <Section id="exame-tricoscopia" title="9. Exame Físico e Tricoscopia">
        <Field label="1. Alimentação" />
        <Field label="2. Exame Físico" />
        <div className="pt-4 space-y-4 border-t border-brand-200">
          <p className="font-medium text-brand-800">TRICOSCOPIA</p>
          <div className="flex gap-4">
            <span className="text-sm text-brand-700">Anomalias/Fragilidades da haste:</span>
            <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Ausente</label>
            <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Presente</label>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-brand-700">Óstios foliculares:</p>
            <div className="flex flex-wrap gap-3">
              {['Normal', 'Preto', 'Branco', 'Amarelo', 'Vermelho', 'Cinza/azulado'].map(opt => (
                <label key={opt} className="flex items-center gap-2"><input type="checkbox" className="rounded" /> {opt}</label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-brand-700">Epiderme peri/interfolicular - Descamação:</p>
            <div className="flex flex-wrap gap-3">
              {['Normal (Ausente)', 'Descamação difusa', 'Descamação localizada', 'Descamação perifolicular'].map(opt => (
                <label key={opt} className="flex items-center gap-2"><input type="checkbox" className="rounded" /> {opt}</label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-brand-700">Coloração:</p>
            <div className="flex flex-wrap gap-3">
              {['Cor castanha', 'Cor rosa', 'Cor vermelha', 'Cor amarela', 'Cor branca', 'Cor azul/violáceo'].map(opt => (
                <label key={opt} className="flex items-center gap-2"><input type="checkbox" className="rounded" /> {opt}</label>
              ))}
            </div>
          </div>
          <Field label="CONCLUSÃO" />
        </div>
      </Section>

      <Section id="declaracao" title="10. Declaração e Assinatura">
        <p className="text-brand-700 text-sm leading-relaxed italic mb-6">
          &quot;Eu declaro que todas as informações fornecidas nesta ficha são verdadeiras e completas, e autorizo a utilização destes dados para fins de planejamento e execução de tratamentos estéticos na clínica.&quot;
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Assinatura do paciente" />
          <Field label="Data" />
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
          <Field label="Nome Completo" />
          <Field label="Data de Nascimento" />
          <Field label="CPF" />
          <Field label="Profissão" />
          <Field label="Telefone" />
          <Field label="E-mail" />
          <div className="md:col-span-2"><Field label="Endereço Completo" /></div>
        </div>
      </Section>
      <Section id="contato-emergencia" title="2. Contato de Emergência">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nome do Contato" />
          <Field label="Parentesco" />
          <Field label="Telefone" />
        </div>
      </Section>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-100">
      <header className="bg-brand-500 border-b border-gold-500/30 py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-serif text-gold-500 font-semibold">Dr Agatha - Área Restrita</h1>
          <button
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
              onClick={() => { setActiveTab('tricologia'); setExpandedSection('dados-pessoais'); }}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'tricologia' ? 'bg-brand-500 text-gold-500' : 'bg-brand-200 text-brand-700 hover:bg-brand-300'}`}
            >
              Tricologia
            </button>
            <button
              onClick={() => { setActiveTab('geral'); setExpandedSection('dados-pessoais'); }}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'geral' ? 'bg-brand-500 text-gold-500' : 'bg-brand-200 text-brand-700 hover:bg-brand-300'}`}
            >
              Modelo Geral
            </button>
          </div>
          {activeTab === 'tricologia' && (
            <button
              onClick={async () => {
                try {
                  await generateTricologiaAnamnesePdf();
                } catch (e) {
                  console.error('Erro ao gerar PDF:', e);
                  alert('Erro ao gerar o PDF. Tente novamente.');
                }
              }}
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
