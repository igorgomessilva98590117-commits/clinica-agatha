import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN = 45;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const FONT_SIZE = 10;
const FONT_SIZE_LABEL = 9;
const FONT_SIZE_TITLE = 14;
const FONT_SIZE_SECTION = 11;
const LINE_HEIGHT = 12;
const LABEL_HEIGHT = 11;
const GAP_LABEL_VALUE = 3;
const GAP_BETWEEN_FIELDS = 14;
const GAP_AFTER_SECTION = 22;
const GAP_TITLE_LINE = 6;
const GAP_LINE_CONTENT = 12;
const VALUE_INDENT = 0;
const MAX_CHARS = 72;

const colors = {
  brand: rgb(65 / 255, 3 / 255, 27 / 255),
  brand100: rgb(245 / 255, 226 / 255, 230 / 255),
  brand200: rgb(232 / 255, 196 / 255, 205 / 255),
  brand700: rgb(46 / 255, 1 / 255, 20 / 255),
  brand800: rgb(36 / 255, 1 / 255, 16 / 255),
  gold: rgb(194 / 255, 168 / 255, 119 / 255),
};

const labelMap: Record<string, string> = {
  fullName: 'Nome Completo',
  birthDate: 'Data de Nascimento',
  emergencyContactName: 'Nome do contato',
  emergencyContactPhone: 'Telefone',
  emergencyContactRelationship: 'Parentesco / Relação',
  emergencyContactNotes: 'Informações adicionais',
  mainComplaint: 'Queixa principal',
  hasChemicalHistory: 'Procedimentos químicos nos últimos 6 meses?',
  chemicalDetails: 'Quais procedimentos?',
  healthHistory: 'Diagnósticos médicos, alergias ou medicação contínua?',
  areaOfInterest: 'Áreas para tratamento',
  priorProcedures: 'Aplicações anteriores',
  allergies: 'Alergias e contraindicações',
  skinType: 'Tipo de pele',
  concerns: 'Preocupações com a pele',
  currentRoutine: 'Rotina de skincare atual',
  medications: 'Medicamentos',
  treatmentArea: 'Área de tratamento',
  goal: 'Objetivo',
  priorTreatments: 'Tratamentos anteriores',
  contraindications: 'Contraindicações',
};

const selectLabels: Record<string, Record<string, string>> = {
  hasChemicalHistory: { yes: 'Sim', no: 'Não' },
  emergencyContactRelationship: {
    conjuge: 'Cônjuge', pai: 'Pai', mae: 'Mãe', filho: 'Filho(a)',
    irmao: 'Irmão(ã)', 'outro-familiar': 'Outro familiar', amigo: 'Amigo(a)', outro: 'Outro',
  },
  areaOfInterest: {
    testa: 'Testa (rugas)', olhos: 'Entre as sobrancelhas', 'olhos-pes': 'Pés de galinha',
    multipla: 'Múltiplas áreas', outra: 'Outra',
  },
  skinType: {
    oleosa: 'Oleosa', seca: 'Seca', mista: 'Mista', normal: 'Normal',
    sensivel: 'Sensível', 'nao-sei': 'Não sei',
  },
  treatmentArea: {
    'couro-cabeludo': 'Couro cabeludo', rosto: 'Rosto', corpo: 'Corpo',
    celulite: 'Celulite/Gordura localizada', estrias: 'Estrias', outra: 'Outra',
  },
};

type SectionConfig = { title: string; fields: string[] };

const formSections: Record<string, SectionConfig[]> = {
  Tricologia: [
    { title: 'Dados Pessoais', fields: ['fullName', 'birthDate'] },
    { title: 'Contato de Emergência', fields: ['emergencyContactName', 'emergencyContactPhone', 'emergencyContactRelationship', 'emergencyContactNotes'] },
    { title: 'Queixa Principal', fields: ['mainComplaint'] },
    { title: 'Histórico Capilar', fields: ['hasChemicalHistory', 'chemicalDetails'] },
    { title: 'Saúde Geral', fields: ['healthHistory'] },
  ],
  Botox: [
    { title: 'Dados Pessoais', fields: ['fullName', 'birthDate'] },
    { title: 'Contato de Emergência', fields: ['emergencyContactName', 'emergencyContactPhone', 'emergencyContactRelationship', 'emergencyContactNotes'] },
    { title: 'Área de Interesse', fields: ['areaOfInterest'] },
    { title: 'Histórico', fields: ['priorProcedures'] },
    { title: 'Alergias e Saúde', fields: ['allergies'] },
  ],
  'Gerenciamento de Pele': [
    { title: 'Dados Pessoais', fields: ['fullName', 'birthDate'] },
    { title: 'Contato de Emergência', fields: ['emergencyContactName', 'emergencyContactPhone', 'emergencyContactRelationship', 'emergencyContactNotes'] },
    { title: 'Tipo de Pele', fields: ['skinType'] },
    { title: 'Preocupações', fields: ['concerns'] },
    { title: 'Rotina Atual', fields: ['currentRoutine'] },
    { title: 'Medicamentos', fields: ['medications'] },
  ],
  Intratermoterapia: [
    { title: 'Dados Pessoais', fields: ['fullName', 'birthDate'] },
    { title: 'Contato de Emergência', fields: ['emergencyContactName', 'emergencyContactPhone', 'emergencyContactRelationship', 'emergencyContactNotes'] },
    { title: 'Área de Tratamento', fields: ['treatmentArea'] },
    { title: 'Objetivo', fields: ['goal'] },
    { title: 'Tratamentos Anteriores', fields: ['priorTreatments'] },
    { title: 'Contraindicações', fields: ['contraindications'] },
  ],
};

function getDisplayValue(key: string, value: string): string {
  const map = selectLabels[key];
  return (map && value ? map[value] : value) || '-';
}

function wrapText(text: string, maxChars: number): string[] {
  const words = (text || '-').split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (test.length <= maxChars) {
      line = test;
    } else {
      if (line) lines.push(line);
      line = word.length > maxChars ? word.substring(0, maxChars) : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function calcEmergencyBoxHeight(section: SectionConfig, formData: Record<string, string>): number {
  let h = FONT_SIZE_SECTION + GAP_TITLE_LINE + 1 + GAP_LINE_CONTENT + 14;
  let isFirst = true;
  for (const key of section.fields) {
    const value = formData[key];
    if (value === undefined && key !== 'chemicalDetails') continue;
    if (key === 'chemicalDetails' && formData.hasChemicalHistory !== 'yes') continue;
    if (!isFirst) h += GAP_BETWEEN_FIELDS;
    isFirst = false;
    const displayValue = getDisplayValue(key, value);
    const lines = wrapText(displayValue, MAX_CHARS);
    h += LABEL_HEIGHT + GAP_LABEL_VALUE + lines.length * LINE_HEIGHT;
  }
  return h + 20;
}

function drawSection(
  page: any,
  font: any,
  fontBold: any,
  section: SectionConfig,
  formData: Record<string, string>,
  y: number,
  isEmergencyContact: boolean
): number {
  if (isEmergencyContact) {
    const boxHeight = calcEmergencyBoxHeight(section, formData);
    page.drawRectangle({
      x: MARGIN - 8,
      y: y - boxHeight,
      width: CONTENT_WIDTH + 16,
      height: boxHeight,
      borderColor: colors.brand200,
      borderWidth: 0.5,
      color: colors.brand100,
    });
  }

  page.drawText(section.title, {
    x: MARGIN,
    y,
    size: FONT_SIZE_SECTION,
    font: fontBold,
    color: colors.brand800,
  });
  y -= FONT_SIZE_SECTION + GAP_TITLE_LINE;

  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_WIDTH - MARGIN, y },
    thickness: 0.5,
    color: colors.brand200,
  });
  y -= GAP_LINE_CONTENT;

  if (isEmergencyContact) {
    page.drawText('Pessoa que podemos contatar em caso de necessidade durante ou após o procedimento.', {
      x: MARGIN,
      y,
      size: 8,
      font: font,
      color: colors.brand700,
    });
    y -= 14;
  }

  for (const key of section.fields) {
    const value = formData[key];
    if (value === undefined && key !== 'chemicalDetails') continue;
    if (key === 'chemicalDetails' && formData.hasChemicalHistory !== 'yes') continue;

    const label = labelMap[key] || key;
    const displayValue = getDisplayValue(key, value);
    const lines = wrapText(displayValue, MAX_CHARS);

    if (y < 70) break;

    page.drawText(label, {
      x: MARGIN,
      y,
      size: FONT_SIZE_LABEL,
      font: fontBold,
      color: colors.brand700,
    });
    y -= LABEL_HEIGHT + GAP_LABEL_VALUE;

    const valueX = MARGIN + VALUE_INDENT;
    for (const line of lines) {
      if (y < 70) break;
      page.drawText(line, {
        x: valueX,
        y,
        size: FONT_SIZE,
        font: font,
        color: colors.brand800,
      });
      y -= LINE_HEIGHT;
    }
    y -= GAP_BETWEEN_FIELDS;
  }

  y -= GAP_AFTER_SECTION;
  return y;
}

export async function generateFormPdf(
  formData: Record<string, string>,
  serviceName: string,
  fileName?: string
): Promise<void> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  page.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - 50,
    width: PAGE_WIDTH,
    height: 50,
    color: colors.brand,
  });

  page.drawText('Clínica Ágatha Santos', {
    x: MARGIN,
    y: PAGE_HEIGHT - 34,
    size: 16,
    font: fontBold,
    color: colors.gold,
  });

  page.drawText('Estética Avançada e Tricologia', {
    x: MARGIN,
    y: PAGE_HEIGHT - 48,
    size: 9,
    font: font,
    color: colors.gold,
  });

  let y = PAGE_HEIGHT - 72;

  page.drawRectangle({
    x: 0,
    y: y,
    width: PAGE_WIDTH,
    height: 4,
    color: colors.brand100,
  });
  page.drawRectangle({
    x: 0,
    y: y,
    width: PAGE_WIDTH * 0.35,
    height: 4,
    color: colors.gold,
  });
  y -= 28;

  page.drawText(`Ficha de Avaliação - ${serviceName}`, {
    x: MARGIN,
    y,
    size: FONT_SIZE_TITLE,
    font: fontBold,
    color: colors.brand800,
  });
  y -= 24;

  const sections = formSections[serviceName] || formSections.Tricologia;

  for (const section of sections) {
    const isEmergency = section.title === 'Contato de Emergência';
    y = drawSection(page, font, fontBold, section, formData, y, isEmergency);
  }

  const pages = pdfDoc.getPages();
  const lastPage = pages[pages.length - 1];
  lastPage.drawText(
    `Gerado em ${new Date().toLocaleString('pt-BR')} • Dra. Ágatha Santos • Estética Avançada e Tricologia`,
    {
      x: MARGIN,
      y: 28,
      size: 7,
      font: font,
      color: colors.brand200,
    }
  );

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeName = (formData.fullName || 'ficha').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
  link.download = fileName || `ficha_${serviceName.replace(/\s/g, '_')}_${safeName}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}

const BOX = '[ ]'; // Marcador de checkbox (ASCII para compatibilidade PDF)

function drawTricologiaHeader(page: any, font: any, fontBold: any, y: number): number {
  page.drawRectangle({
    x: 0,
    y: y - 70,
    width: PAGE_WIDTH,
    height: 70,
    color: colors.brand,
  });
  page.drawText('AGATHA SANTOS', {
    x: MARGIN,
    y: y - 26,
    size: 18,
    font: fontBold,
    color: colors.gold,
  });
  page.drawText('ESTÉTICA AVANÇADA E TRICOLOGIA', {
    x: MARGIN,
    y: y - 42,
    size: 9,
    font: font,
    color: colors.gold,
  });
  page.drawText('FICHA ANAMNESE - TRICOLOGIA', {
    x: MARGIN,
    y: y - 56,
    size: 11,
    font: fontBold,
    color: colors.gold,
  });
  page.drawText('Contato: (31) 99200-3849  •  Instagram: @biomed.aga', {
    x: MARGIN,
    y: y - 66,
    size: 8,
    font: font,
    color: colors.gold,
  });
  return y - 85;
}

const CHECK = '[X]';

function drawSimNao(page: any, font: any, fontBold: any, label: string, x: number, y: number, value?: string): number {
  page.drawText(label, { x, y, size: FONT_SIZE_LABEL, font: fontBold, color: colors.brand700 });
  const simX = PAGE_WIDTH - MARGIN - 110;
  const simText = value === 'sim' ? `${CHECK} Sim  ${BOX} Nao` : value === 'nao' ? `${BOX} Sim  ${CHECK} Nao` : `${BOX} Sim  ${BOX} Nao`;
  page.drawText(simText, { x: simX, y, size: FONT_SIZE_LABEL, font: font, color: colors.brand800 });
  return y - LINE_HEIGHT - 2;
}

function drawFieldLine(page: any, font: any, fontBold: any, label: string, x: number, y: number, value?: string): number {
  page.drawText(label, { x, y, size: FONT_SIZE_LABEL, font: fontBold, color: colors.brand700 });
  y -= LABEL_HEIGHT + 2;
  const text = (value || '').trim();
  if (text) {
    const lines = wrapText(text, MAX_CHARS);
    for (const line of lines) {
      page.drawText(line, { x, y, size: FONT_SIZE, font: font, color: colors.brand800 });
      y -= LINE_HEIGHT;
    }
    return y - 4;
  }
  page.drawLine({
    start: { x, y: y + 4 },
    end: { x: PAGE_WIDTH - MARGIN, y: y + 4 },
    thickness: 0.3,
    color: colors.brand200,
  });
  return y - 6;
}

function drawCheckOptions(page: any, font: any, label: string, options: string[], x: number, y: number, selected?: string): number {
  page.drawText(label, { x, y, size: FONT_SIZE_LABEL, font: font, color: colors.brand700 });
  y -= LINE_HEIGHT;
  const sel = (selected || '').split(',').map(s => s.trim()).filter(Boolean);
  let optX = x;
  for (const opt of options) {
    if (optX > PAGE_WIDTH - MARGIN - 80) {
      optX = x;
      y -= LINE_HEIGHT;
    }
    const isSel = sel.some(s => opt.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(opt.toLowerCase().split(' ')[0]));
    const prefix = isSel ? CHECK : BOX;
    page.drawText(`${prefix} ${opt.substring(0, 12)}`, { x: optX, y, size: FONT_SIZE_LABEL, font: font, color: colors.brand800 });
    optX += 55;
  }
  return y - 8;
}

export async function generateTricologiaAnamnesePdf(formData: Record<string, string> = {}): Promise<void> {
  const d = (k: string) => formData[k] || '';
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pages = [pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])];
  let pageIdx = 0;
  let page = pages[0];
  let y = PAGE_HEIGHT - MARGIN;

  const needsNewPage = (required: number) => {
    if (y < required) {
      pages.push(pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]));
      pageIdx++;
      page = pages[pageIdx];
      y = PAGE_HEIGHT - MARGIN;
      page.drawText('AGATHA SANTOS - FICHA ANAMNESE TRICOLOGIA', {
        x: MARGIN, y, size: 8, font: font, color: colors.brand200,
      });
      y -= 20;
    }
  };

  y = drawTricologiaHeader(page, font, fontBold, y);

  const drawSectionTitle = (title: string) => {
    needsNewPage(40);
    page.drawText(title, { x: MARGIN, y, size: FONT_SIZE_SECTION, font: fontBold, color: colors.brand800 });
    y -= FONT_SIZE_SECTION + 4;
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE_WIDTH - MARGIN, y },
      thickness: 0.5,
      color: colors.brand200,
    });
    y -= 12;
  };

  drawSectionTitle('1. Dados Pessoais');
  y = drawFieldLine(page, font, fontBold, 'Nome completo:', MARGIN, y, d('nomeCompleto'));
  y = drawFieldLine(page, font, fontBold, 'Data nascimento:', MARGIN, y, d('dataNascimento'));
  y = drawFieldLine(page, font, fontBold, 'Idade:', MARGIN, y, d('idade'));
  needsNewPage(30);
  const sexoMark = d('sexo').toLowerCase();
  page.drawText(`Sexo: ${sexoMark.includes('fem') ? CHECK : BOX} Femin.  ${sexoMark.includes('masc') ? CHECK : BOX} Masc.`, { x: MARGIN, y, size: FONT_SIZE_LABEL, font: font, color: colors.brand700 });
  y -= LINE_HEIGHT + 6;
  y = drawFieldLine(page, font, fontBold, 'CPF:', MARGIN, y, d('cpf'));
  y = drawFieldLine(page, font, fontBold, 'Profissao:', MARGIN, y, d('profissao'));
  y = drawFieldLine(page, font, fontBold, 'Telefone:', MARGIN, y, d('telefone'));
  y = drawFieldLine(page, font, fontBold, 'E-mail:', MARGIN, y, d('email'));
  y = drawFieldLine(page, font, fontBold, 'Cidade/Endereco:', MARGIN, y, d('cidadeEndereco'));

  drawSectionTitle('2. Anamnese Capilar (Queixas e Sintomas)');
  y = drawFieldLine(page, font, fontBold, 'Queixa principal:', MARGIN, y, d('queixaPrincipal'));
  needsNewPage(30);
  page.drawText('Sintomas no couro cabeludo:', { x: MARGIN, y, size: FONT_SIZE_LABEL, font: fontBold, color: colors.brand700 });
  y -= LINE_HEIGHT;
  y = drawSimNao(page, font, fontBold, 'Coceira:', MARGIN, y, d('coceira'));
  y = drawSimNao(page, font, fontBold, 'Dor:', MARGIN, y, d('dor'));
  y = drawSimNao(page, font, fontBold, 'Ardencia/Queimacao:', MARGIN, y, d('ardencia'));
  page.drawText('Sobre a Queda:', { x: MARGIN, y, size: FONT_SIZE_LABEL, font: fontBold, color: colors.brand700 });
  y -= LINE_HEIGHT;
  y = drawSimNao(page, font, fontBold, 'Queda acentuada?:', MARGIN, y, d('quedaAcentuada'));
  y = drawFieldLine(page, font, fontBold, 'Ha quanto tempo?:', MARGIN, y, d('quedaQuantoTempo'));
  y = drawSimNao(page, font, fontBold, 'Falta de sensibilidade:', MARGIN, y, d('faltaSensibilidade'));
  y = drawSimNao(page, font, fontBold, 'Queda cessou e voltou?:', MARGIN, y, d('quedaVoltou'));
  y = drawSimNao(page, font, fontBold, 'Sensibilidade exacerbada:', MARGIN, y, d('sensibilidadeExacerbada'));
  page.drawText('Observacoes Visuais:', { x: MARGIN, y, size: FONT_SIZE_LABEL, font: fontBold, color: colors.brand700 });
  y -= LINE_HEIGHT;
  y = drawSimNao(page, font, fontBold, 'Nota presenca de fios novos?:', MARGIN, y, d('fiosNovos'));
  y = drawSimNao(page, font, fontBold, 'Presenca de caspa/descamacao:', MARGIN, y, d('caspa'));
  y = drawSimNao(page, font, fontBold, 'Houve perda de volume?:', MARGIN, y, d('perdaVolume'));
  const afinH = d('afinamentoHaste').toLowerCase();
  page.drawText(`Afinamento da haste: ${afinH.includes('presente') ? CHECK : BOX} Presente  ${afinH.includes('ausente') ? CHECK : BOX} Ausente`, { x: MARGIN, y, size: FONT_SIZE_LABEL, font: font, color: colors.brand700 });
  y -= LINE_HEIGHT + 6;
  y = drawCheckOptions(page, font, 'Tipo de cabelo:', ['Oleoso 24h', 'Oleoso 48h+', 'Seco'], MARGIN, y, d('tipoCabelo'));
  y = drawFieldLine(page, font, fontBold, 'Frequencia de lavagem:', MARGIN, y, d('frequenciaLavagem'));
  page.drawText('Historico:', { x: MARGIN, y, size: FONT_SIZE_LABEL, font: fontBold, color: colors.brand700 });
  y -= LINE_HEIGHT;
  y = drawSimNao(page, font, fontBold, 'Perda de pelos em outras partes?:', MARGIN, y, d('perdaOutrosPelos'));
  y = drawSimNao(page, font, fontBold, 'Diagnostico previo:', MARGIN, y, d('diagnosticoPrevio'));
  y = drawSimNao(page, font, fontBold, 'Tratamento previo:', MARGIN, y, d('tratamentoPrevio'));
  y = drawSimNao(page, font, fontBold, 'Tratamento orientado por profissional?:', MARGIN, y, d('tratamentoOrientado'));
  y = drawSimNao(page, font, fontBold, 'Obteve resultados?:', MARGIN, y, d('obteveResultados'));
  y = drawSimNao(page, font, fontBold, 'Evento marcante antecedeu a queda?:', MARGIN, y, d('eventoMarcante'));

  drawSectionTitle('3. Historico de Saude e Familiar');
  y = drawSimNao(page, font, fontBold, 'Possui problema de saude hoje:', MARGIN, y, d('problemaSaude'));
  y = drawFieldLine(page, font, fontBold, 'Se sim, qual:', MARGIN, y, d('problemaSaudeQual'));
  y = drawSimNao(page, font, fontBold, 'Casos de calvicie na familia:', MARGIN, y, d('calvicieFamilia'));
  y = drawFieldLine(page, font, fontBold, 'Se sim, qual parentesco:', MARGIN, y, d('calvicieParentesco'));
  y = drawSimNao(page, font, fontBold, 'Doenca cronica:', MARGIN, y, d('doencaCronica'));
  y = drawFieldLine(page, font, fontBold, 'Se sim, qual:', MARGIN, y, d('doencaCronicaQual'));
  const doencas = d('doencasCronicasTipos').toLowerCase();
  page.drawText(`${doencas.includes('hipert') ? CHECK : BOX} Hipertensao  ${doencas.includes('diab') ? CHECK : BOX} Diabetes  ${doencas.includes('arrit') ? CHECK : BOX} Arritmia  ${doencas.includes('dislip') ? CHECK : BOX} Dislipidemia`, { x: MARGIN, y, size: FONT_SIZE_LABEL, font: font, color: colors.brand700 });
  y -= LINE_HEIGHT + 8;

  drawSectionTitle('4. Fisiologia e Habitos');
  const intest = d('intestino').toLowerCase();
  page.drawText(`Funcionamento intestino: ${intest.includes('regular') ? CHECK : BOX} Regular  ${intest.includes('constip') ? CHECK : BOX} Constipado`, { x: MARGIN, y, size: FONT_SIZE_LABEL, font: font, color: colors.brand700 });
  y -= LINE_HEIGHT + 2;
  y = drawFieldLine(page, font, fontBold, 'Se constipado, qual frequencia:', MARGIN, y, d('intestinoFrequencia'));
  y = drawSimNao(page, font, fontBold, 'Uso de fonte termica (secador/chapinha):', MARGIN, y, d('fonteTermica'));
  y = drawSimNao(page, font, fontBold, 'Disturbio circulacao:', MARGIN, y, d('disturbioCirculacao'));
  y = drawSimNao(page, font, fontBold, 'Desregulacao hormonal:', MARGIN, y, d('desregulacaoHormonal'));
  y = drawFieldLine(page, font, fontBold, 'Se sim, qual:', MARGIN, y, d('desregulacaoHormonalQual'));
  y = drawSimNao(page, font, fontBold, 'Historico tumores/nodulos malignos:', MARGIN, y, d('tumores'));

  drawSectionTitle('5. Procedimentos Capilares');
  y = drawSimNao(page, font, fontBold, 'Faz alisamento quimico:', MARGIN, y, d('alisamento'));
  y = drawFieldLine(page, font, fontBold, 'Se sim, qual frequencia:', MARGIN, y, d('alisamentoFrequencia'));
  y = drawFieldLine(page, font, fontBold, 'Quais cosmeticos utiliza:', MARGIN, y, d('cosmeticos'));
  y = drawSimNao(page, font, fontBold, 'Penteados que causam tracao:', MARGIN, y, d('penteadosTracao'));
  y = drawFieldLine(page, font, fontBold, 'Se sim, qual:', MARGIN, y, d('penteadosQual'));
  y = drawSimNao(page, font, fontBold, 'Sente dor pela tracao:', MARGIN, y, d('dorTracao'));
  y = drawSimNao(page, font, fontBold, 'Fez transplante capilar:', MARGIN, y, d('transplante'));

  drawSectionTitle('6. Medicamentos e Vicios');
  y = drawSimNao(page, font, fontBold, 'Uso de contraceptivo:', MARGIN, y, d('contraceptivo'));
  y = drawFieldLine(page, font, fontBold, 'Se sim, qual:', MARGIN, y, d('contraceptivoQual'));
  const bebida = d('bebidaAlcoolica').toLowerCase();
  page.drawText(`Bebida alcoolica: ${bebida.includes('diar') ? CHECK : BOX} Diariamente  ${bebida.includes('soc') ? CHECK : BOX} Socialmente  ${bebida.includes('nao') || bebida === 'não' ? CHECK : BOX} Nao`, { x: MARGIN, y, size: FONT_SIZE_LABEL, font: font, color: colors.brand700 });
  y -= LINE_HEIGHT + 6;
  y = drawSimNao(page, font, fontBold, 'Medicamento continuo:', MARGIN, y, d('medicamentoContinuo'));
  y = drawSimNao(page, font, fontBold, 'Medicamento no momento:', MARGIN, y, d('medicamentoMomento'));
  y = drawFieldLine(page, font, fontBold, 'Se sim, qual:', MARGIN, y, d('medicamentoQual'));
  y = drawSimNao(page, font, fontBold, 'Fuma:', MARGIN, y, d('fuma'));
  y = drawFieldLine(page, font, fontBold, 'Ha quanto tempo?:', MARGIN, y, d('fumaQuantoTempo'));
  y = drawSimNao(page, font, fontBold, 'Pratica exercicios fisicos:', MARGIN, y, d('exercicios'));
  y = drawFieldLine(page, font, fontBold, 'Se sim, qual frequencia:', MARGIN, y, d('exerciciosFrequencia'));

  drawSectionTitle('7. Sono e Emocional');
  y = drawSimNao(page, font, fontBold, 'Problemas com o sono:', MARGIN, y, d('problemasSono'));
  y = drawFieldLine(page, font, fontBold, 'Horas de sono por noite:', MARGIN, y, d('horasSono'));
  page.drawText('Perfil Emocional:', { x: MARGIN, y, size: FONT_SIZE_LABEL, font: fontBold, color: colors.brand700 });
  y -= LINE_HEIGHT;
  y = drawSimNao(page, font, fontBold, 'Estressada:', MARGIN, y, d('estressada'));
  y = drawSimNao(page, font, fontBold, 'Ansiosa:', MARGIN, y, d('ansiosa'));
  y = drawSimNao(page, font, fontBold, 'Depressiva:', MARGIN, y, d('depressiva'));
  y = drawSimNao(page, font, fontBold, 'Tratamento psiquico:', MARGIN, y, d('tratamentoPsiquico'));

  drawSectionTitle('8. Historico Medico Adicional');
  y = drawSimNao(page, font, fontBold, 'Alergia:', MARGIN, y, d('alergia'));
  y = drawFieldLine(page, font, fontBold, 'Se sim, qual:', MARGIN, y, d('alergiaQual'));
  y = drawSimNao(page, font, fontBold, 'Cirurgia recente:', MARGIN, y, d('cirurgiaRecente'));
  y = drawSimNao(page, font, fontBold, '(Mulheres) Gestante ou lactante:', MARGIN, y, d('gestanteLactante'));
  const ciclo = d('cicloMenstrual').toLowerCase();
  page.drawText(`Ciclo Menstrual: ${ciclo.includes('regular') ? CHECK : BOX} Regular  ${ciclo.includes('irreg') ? CHECK : BOX} Irregular`, { x: MARGIN, y, size: FONT_SIZE_LABEL, font: font, color: colors.brand700 });
  y -= LINE_HEIGHT + 2;
  const fluxo = d('fluxoMenstrual').toLowerCase();
  page.drawText(`Fluxo menstrual: ${fluxo.includes('intenso') ? CHECK : BOX} Intenso  ${fluxo.includes('moderado') ? CHECK : BOX} Moderado  ${fluxo.includes('baixo') ? CHECK : BOX} Baixo`, { x: MARGIN, y, size: FONT_SIZE_LABEL, font: font, color: colors.brand700 });
  y -= LINE_HEIGHT + 8;

  drawSectionTitle('9. Exame Fisico e Tricoscopia');
  y = drawFieldLine(page, font, fontBold, '1. Alimentacao:', MARGIN, y, d('alimentacao'));
  y = drawFieldLine(page, font, fontBold, '2. Exame Fisico:', MARGIN, y, d('exameFisico'));
  page.drawText('TRICOSCOPIA', { x: MARGIN, y, size: FONT_SIZE_SECTION, font: fontBold, color: colors.brand800 });
  y -= LINE_HEIGHT + 4;
  const anomH = d('anomaliasHaste').toLowerCase();
  page.drawText(`Anomalias/Fragilidades haste: ${anomH.includes('ausente') ? CHECK : BOX} Ausente  ${anomH.includes('presente') ? CHECK : BOX} Presente`, { x: MARGIN, y, size: FONT_SIZE_LABEL, font: font, color: colors.brand700 });
  y -= LINE_HEIGHT + 2;
  const ostios = d('ostiosFoliculares').toLowerCase();
  page.drawText('Ostios foliculares:', { x: MARGIN, y, size: FONT_SIZE_LABEL, font: fontBold, color: colors.brand700 });
  y -= LINE_HEIGHT;
  page.drawText(`${ostios.includes('normal') ? CHECK : BOX} Normal  ${ostios.includes('preto') ? CHECK : BOX} Preto  ${ostios.includes('branco') ? CHECK : BOX} Branco  ${ostios.includes('amarelo') ? CHECK : BOX} Amarelo  ${ostios.includes('vermelho') ? CHECK : BOX} Vermelho  ${ostios.includes('cinza') ? CHECK : BOX} Cinza/azulado`, { x: MARGIN, y, size: FONT_SIZE_LABEL, font: font, color: colors.brand800 });
  y -= LINE_HEIGHT + 4;
  const desc = d('descamacao').toLowerCase();
  page.drawText('Epiderme - Descamacao:', { x: MARGIN, y, size: FONT_SIZE_LABEL, font: fontBold, color: colors.brand700 });
  y -= LINE_HEIGHT;
  page.drawText(`${desc.includes('normal') && !desc.includes('difusa') && !desc.includes('local') && !desc.includes('perif') ? CHECK : BOX} Normal  ${desc.includes('difusa') ? CHECK : BOX} Difusa  ${desc.includes('localizada') ? CHECK : BOX} Localizada  ${desc.includes('perif') ? CHECK : BOX} Perifolicular`, { x: MARGIN, y, size: FONT_SIZE_LABEL, font: font, color: colors.brand800 });
  y -= LINE_HEIGHT + 4;
  const color = d('coloracao').toLowerCase();
  page.drawText('Coloracao:', { x: MARGIN, y, size: FONT_SIZE_LABEL, font: fontBold, color: colors.brand700 });
  y -= LINE_HEIGHT;
  page.drawText(`${color.includes('castanha') ? CHECK : BOX} Castanha  ${color.includes('rosa') ? CHECK : BOX} Rosa  ${color.includes('vermelha') ? CHECK : BOX} Vermelha  ${color.includes('amarela') ? CHECK : BOX} Amarela  ${color.includes('branca') ? CHECK : BOX} Branca  ${color.includes('azul') || color.includes('violaceo') ? CHECK : BOX} Azul/violaceo`, { x: MARGIN, y, size: FONT_SIZE_LABEL, font: font, color: colors.brand800 });
  y -= LINE_HEIGHT + 6;
  y = drawFieldLine(page, font, fontBold, 'CONCLUSAO:', MARGIN, y, d('conclusao'));

  drawSectionTitle('10. Declaracao e Assinatura');
  const decl = '"Eu declaro que todas as informações fornecidas nesta ficha são verdadeiras e completas, e autorizo a utilização destes dados para fins de planejamento e execução de tratamentos estéticos na clínica."';
  const words = decl.split(/\s+/);
  let line = '';
  const declLines: string[] = [];
  for (const w of words) {
    if ((line + (line ? ' ' : '') + w).length <= 68) {
      line = line ? line + ' ' + w : w;
    } else {
      if (line) declLines.push(line);
      line = w;
    }
  }
  if (line) declLines.push(line);
  let declY = y;
  for (const ln of declLines) {
    page.drawText(ln, { x: MARGIN, y: declY, size: 9, font: font, color: colors.brand700 });
    declY -= 11;
  }
  y = declY - 12;
  y = drawFieldLine(page, font, fontBold, 'Assinatura do paciente:', MARGIN, y, d('assinatura'));
  y = drawFieldLine(page, font, fontBold, 'Data:', MARGIN, y, d('data'));

  for (const p of pages) {
    p.drawText(`Gerado em ${new Date().toLocaleString('pt-BR')} • Agatha Santos`, {
      x: MARGIN, y: 22, size: 7, font: font, color: colors.brand200,
    });
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const nome = (d('nomeCompleto') || 'ficha').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
  link.download = `ficha_tricologia_${nome}_${new Date().toISOString().slice(0, 10)}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}

export function getEmailContent(formData: Record<string, string>, serviceName: string): {
  subject: string;
  body: string;
} {
  const subject = encodeURIComponent(`Ficha de Avaliação - ${serviceName} - ${formData.fullName || 'Paciente'}`);
  let body = `Segue a ficha de avaliação preenchida:\n\n--- FICHA - ${serviceName} ---\n\n`;

  const sections = formSections[serviceName] || formSections.Tricologia;
  for (const section of sections) {
    body += `\n${section.title}\n`;
    for (const key of section.fields) {
      const value = formData[key];
      if (value === undefined && key !== 'chemicalDetails') continue;
      if (key === 'chemicalDetails' && formData.hasChemicalHistory !== 'yes') continue;
      const label = labelMap[key] || key;
      body += `${label}: ${getDisplayValue(key, value)}\n`;
    }
  }
  body += `\n---\nPor favor, anexe o PDF ao enviar este email.`;
  return { subject, body: encodeURIComponent(body) };
}
