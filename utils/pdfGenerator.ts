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

function drawSimNao(page: any, font: any, fontBold: any, label: string, x: number, y: number): number {
  page.drawText(label, { x, y, size: FONT_SIZE_LABEL, font: fontBold, color: colors.brand700 });
  const simX = PAGE_WIDTH - MARGIN - 110;
  page.drawText(`${BOX} Sim  ${BOX} Não`, { x: simX, y, size: FONT_SIZE_LABEL, font: font, color: colors.brand800 });
  return y - LINE_HEIGHT - 2;
}

function drawFieldLine(page: any, font: any, fontBold: any, label: string, x: number, y: number): number {
  page.drawText(label, { x, y, size: FONT_SIZE_LABEL, font: fontBold, color: colors.brand700 });
  y -= LABEL_HEIGHT + 2;
  page.drawLine({
    start: { x, y: y + 4 },
    end: { x: PAGE_WIDTH - MARGIN, y: y + 4 },
    thickness: 0.3,
    color: colors.brand200,
  });
  return y - 6;
}

function drawCheckOptions(page: any, font: any, label: string, options: string[], x: number, y: number): number {
  page.drawText(label, { x, y, size: FONT_SIZE_LABEL, font: font, color: colors.brand700 });
  y -= LINE_HEIGHT;
  let optX = x;
  for (const opt of options) {
    if (optX > PAGE_WIDTH - MARGIN - 80) {
      optX = x;
      y -= LINE_HEIGHT;
    }
    page.drawText(`${BOX} ${opt}`, { x: optX, y, size: FONT_SIZE_LABEL, font: font, color: colors.brand800 });
    optX += 55;
  }
  return y - 8;
}

export async function generateTricologiaAnamnesePdf(): Promise<void> {
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
  y = drawFieldLine(page, font, fontBold, 'Nome completo:', MARGIN, y);
  y = drawFieldLine(page, font, fontBold, 'Data nascimento:', MARGIN, y);
  y = drawFieldLine(page, font, fontBold, 'Idade:', MARGIN, y);
  needsNewPage(30);
  page.drawText(`Sexo: ${BOX} Femin.  ${BOX} Masc.`, { x: MARGIN, y, size: FONT_SIZE_LABEL, font: font, color: colors.brand700 });
  y -= LINE_HEIGHT + 6;
  y = drawFieldLine(page, font, fontBold, 'CPF:', MARGIN, y);
  y = drawFieldLine(page, font, fontBold, 'Profissão:', MARGIN, y);
  y = drawFieldLine(page, font, fontBold, 'Telefone:', MARGIN, y);
  y = drawFieldLine(page, font, fontBold, 'E-mail:', MARGIN, y);
  y = drawFieldLine(page, font, fontBold, 'Cidade/Endereço:', MARGIN, y);

  drawSectionTitle('2. Anamnese Capilar (Queixas e Sintomas)');
  y = drawFieldLine(page, font, fontBold, 'Queixa principal:', MARGIN, y);
  needsNewPage(30);
  page.drawText('Sintomas no couro cabeludo:', { x: MARGIN, y, size: FONT_SIZE_LABEL, font: fontBold, color: colors.brand700 });
  y -= LINE_HEIGHT;
  y = drawSimNao(page, font, fontBold, 'Coceira:', MARGIN, y);
  y = drawSimNao(page, font, fontBold, 'Dor:', MARGIN, y);
  y = drawSimNao(page, font, fontBold, 'Ardência/Queimação:', MARGIN, y);
  page.drawText('Sobre a Queda:', { x: MARGIN, y, size: FONT_SIZE_LABEL, font: fontBold, color: colors.brand700 });
  y -= LINE_HEIGHT;
  y = drawSimNao(page, font, fontBold, 'Queda acentuada?:', MARGIN, y);
  y = drawFieldLine(page, font, fontBold, 'Há quanto tempo?:', MARGIN, y);
  y = drawSimNao(page, font, fontBold, 'Falta de sensibilidade:', MARGIN, y);
  y = drawSimNao(page, font, fontBold, 'Queda cessou e voltou?:', MARGIN, y);
  y = drawSimNao(page, font, fontBold, 'Sensibilidade exacerbada:', MARGIN, y);
  page.drawText('Observações Visuais:', { x: MARGIN, y, size: FONT_SIZE_LABEL, font: fontBold, color: colors.brand700 });
  y -= LINE_HEIGHT;
  y = drawSimNao(page, font, fontBold, 'Nota presença de fios novos?:', MARGIN, y);
  y = drawSimNao(page, font, fontBold, 'Presença de caspa/descamação:', MARGIN, y);
  y = drawSimNao(page, font, fontBold, 'Houve perda de volume?:', MARGIN, y);
  page.drawText(`Afinamento da haste: ${BOX} Presente  ${BOX} Ausente`, { x: MARGIN, y, size: FONT_SIZE_LABEL, font: font, color: colors.brand700 });
  y -= LINE_HEIGHT + 6;
  y = drawCheckOptions(page, font, 'Características - Tipo de cabelo:', ['Oleoso 24h', 'Oleoso 48h+', 'Seco'], MARGIN, y);
  y = drawFieldLine(page, font, fontBold, 'Frequência de lavagem:', MARGIN, y);
  page.drawText('Histórico:', { x: MARGIN, y, size: FONT_SIZE_LABEL, font: fontBold, color: colors.brand700 });
  y -= LINE_HEIGHT;
  y = drawSimNao(page, font, fontBold, 'Perda de pelos em outras partes?:', MARGIN, y);
  y = drawSimNao(page, font, fontBold, 'Diagnóstico prévio:', MARGIN, y);
  y = drawSimNao(page, font, fontBold, 'Tratamento prévio:', MARGIN, y);
  y = drawSimNao(page, font, fontBold, 'Tratamento orientado por profissional?:', MARGIN, y);
  y = drawSimNao(page, font, fontBold, 'Obteve resultados?:', MARGIN, y);
  y = drawSimNao(page, font, fontBold, 'Evento marcante antecedeu a queda?:', MARGIN, y);

  drawSectionTitle('3. Histórico de Saúde e Familiar');
  y = drawSimNao(page, font, fontBold, 'Possui problema de saúde hoje:', MARGIN, y);
  y = drawFieldLine(page, font, fontBold, 'Se sim, qual:', MARGIN, y);
  y = drawSimNao(page, font, fontBold, 'Casos de calvície na família:', MARGIN, y);
  y = drawFieldLine(page, font, fontBold, 'Se sim, qual parentesco:', MARGIN, y);
  y = drawSimNao(page, font, fontBold, 'Doença crônica:', MARGIN, y);
  y = drawFieldLine(page, font, fontBold, 'Se sim, qual:', MARGIN, y);
  page.drawText(`${BOX} Hipertensão  ${BOX} Diabetes  ${BOX} Arritmia  ${BOX} Dislipidemia`, { x: MARGIN, y, size: FONT_SIZE_LABEL, font: font, color: colors.brand700 });
  y -= LINE_HEIGHT + 8;

  drawSectionTitle('4. Fisiologia e Hábitos');
  page.drawText(`Funcionamento intestino: ${BOX} Regular  ${BOX} Constipado`, { x: MARGIN, y, size: FONT_SIZE_LABEL, font: font, color: colors.brand700 });
  y -= LINE_HEIGHT + 2;
  y = drawFieldLine(page, font, fontBold, 'Se constipado, qual frequência:', MARGIN, y);
  y = drawSimNao(page, font, fontBold, 'Uso de fonte térmica (secador/chapinha):', MARGIN, y);
  y = drawSimNao(page, font, fontBold, 'Distúrbio circulação:', MARGIN, y);
  y = drawSimNao(page, font, fontBold, 'Desregulação hormonal:', MARGIN, y);
  y = drawFieldLine(page, font, fontBold, 'Se sim, qual:', MARGIN, y);
  y = drawSimNao(page, font, fontBold, 'Histórico tumores/nódulos malignos:', MARGIN, y);

  drawSectionTitle('5. Procedimentos Capilares');
  y = drawSimNao(page, font, fontBold, 'Faz alisamento químico:', MARGIN, y);
  y = drawFieldLine(page, font, fontBold, 'Se sim, qual frequência:', MARGIN, y);
  y = drawFieldLine(page, font, fontBold, 'Quais cosméticos utiliza:', MARGIN, y);
  y = drawSimNao(page, font, fontBold, 'Penteados que causam tração:', MARGIN, y);
  y = drawFieldLine(page, font, fontBold, 'Se sim, qual:', MARGIN, y);
  y = drawSimNao(page, font, fontBold, 'Sente dor pela tração:', MARGIN, y);
  y = drawSimNao(page, font, fontBold, 'Fez transplante capilar:', MARGIN, y);

  drawSectionTitle('6. Medicamentos e Vícios');
  y = drawSimNao(page, font, fontBold, 'Uso de contraceptivo:', MARGIN, y);
  y = drawFieldLine(page, font, fontBold, 'Se sim, qual:', MARGIN, y);
  page.drawText(`Bebida alcoólica: ${BOX} Diariamente  ${BOX} Socialmente  ${BOX} Não`, { x: MARGIN, y, size: FONT_SIZE_LABEL, font: font, color: colors.brand700 });
  y -= LINE_HEIGHT + 6;
  y = drawSimNao(page, font, fontBold, 'Medicamento contínuo:', MARGIN, y);
  y = drawSimNao(page, font, fontBold, 'Medicamento no momento:', MARGIN, y);
  y = drawFieldLine(page, font, fontBold, 'Se sim, qual:', MARGIN, y);
  y = drawSimNao(page, font, fontBold, 'Fuma:', MARGIN, y);
  y = drawFieldLine(page, font, fontBold, 'Há quanto tempo?:', MARGIN, y);
  y = drawSimNao(page, font, fontBold, 'Pratica exercícios físicos:', MARGIN, y);
  y = drawFieldLine(page, font, fontBold, 'Se sim, qual frequência:', MARGIN, y);

  drawSectionTitle('7. Sono e Emocional');
  y = drawSimNao(page, font, fontBold, 'Problemas com o sono:', MARGIN, y);
  y = drawFieldLine(page, font, fontBold, 'Horas de sono por noite:', MARGIN, y);
  page.drawText('Perfil Emocional:', { x: MARGIN, y, size: FONT_SIZE_LABEL, font: fontBold, color: colors.brand700 });
  y -= LINE_HEIGHT;
  y = drawSimNao(page, font, fontBold, 'Estressada:', MARGIN, y);
  y = drawSimNao(page, font, fontBold, 'Ansiosa:', MARGIN, y);
  y = drawSimNao(page, font, fontBold, 'Depressiva:', MARGIN, y);
  y = drawSimNao(page, font, fontBold, 'Tratamento psíquico:', MARGIN, y);

  drawSectionTitle('8. Histórico Médico Adicional');
  y = drawSimNao(page, font, fontBold, 'Alergia:', MARGIN, y);
  y = drawFieldLine(page, font, fontBold, 'Se sim, qual:', MARGIN, y);
  y = drawSimNao(page, font, fontBold, 'Cirurgia recente:', MARGIN, y);
  y = drawSimNao(page, font, fontBold, '(Mulheres) Gestante ou lactante:', MARGIN, y);
  page.drawText(`Ciclo Menstrual: ${BOX} Regular  ${BOX} Irregular`, { x: MARGIN, y, size: FONT_SIZE_LABEL, font: font, color: colors.brand700 });
  y -= LINE_HEIGHT + 2;
  page.drawText(`Fluxo menstrual: ${BOX} Intenso  ${BOX} Moderado  ${BOX} Baixo`, { x: MARGIN, y, size: FONT_SIZE_LABEL, font: font, color: colors.brand700 });
  y -= LINE_HEIGHT + 8;

  drawSectionTitle('9. Exame Físico e Tricoscopia');
  y = drawFieldLine(page, font, fontBold, '1. Alimentação:', MARGIN, y);
  y = drawFieldLine(page, font, fontBold, '2. Exame Físico:', MARGIN, y);
  page.drawText('TRICOSCOPIA', { x: MARGIN, y, size: FONT_SIZE_SECTION, font: fontBold, color: colors.brand800 });
  y -= LINE_HEIGHT + 4;
  page.drawText(`Anomalias/Fragilidades haste: ${BOX} Ausente  ${BOX} Presente`, { x: MARGIN, y, size: FONT_SIZE_LABEL, font: font, color: colors.brand700 });
  y -= LINE_HEIGHT + 2;
  page.drawText('Óstios foliculares:', { x: MARGIN, y, size: FONT_SIZE_LABEL, font: fontBold, color: colors.brand700 });
  y -= LINE_HEIGHT;
  page.drawText(`${BOX} Normal  ${BOX} Preto  ${BOX} Branco  ${BOX} Amarelo  ${BOX} Vermelho  ${BOX} Cinza/azulado`, { x: MARGIN, y, size: FONT_SIZE_LABEL, font: font, color: colors.brand800 });
  y -= LINE_HEIGHT + 4;
  page.drawText('Epiderme - Descamação:', { x: MARGIN, y, size: FONT_SIZE_LABEL, font: fontBold, color: colors.brand700 });
  y -= LINE_HEIGHT;
  page.drawText(`${BOX} Normal  ${BOX} Difusa  ${BOX} Localizada  ${BOX} Perifolicular`, { x: MARGIN, y, size: FONT_SIZE_LABEL, font: font, color: colors.brand800 });
  y -= LINE_HEIGHT + 4;
  page.drawText('Coloração:', { x: MARGIN, y, size: FONT_SIZE_LABEL, font: fontBold, color: colors.brand700 });
  y -= LINE_HEIGHT;
  page.drawText(`${BOX} Castanha  ${BOX} Rosa  ${BOX} Vermelha  ${BOX} Amarela  ${BOX} Branca  ${BOX} Azul/violáceo`, { x: MARGIN, y, size: FONT_SIZE_LABEL, font: font, color: colors.brand800 });
  y -= LINE_HEIGHT + 6;
  y = drawFieldLine(page, font, fontBold, 'CONCLUSÃO:', MARGIN, y);

  drawSectionTitle('10. Declaração e Assinatura');
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
  y = drawFieldLine(page, font, fontBold, 'Assinatura do paciente:', MARGIN, y);
  y = drawFieldLine(page, font, fontBold, 'Data:', MARGIN, y);

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
  link.download = `ficha_anamnese_tricologia_${new Date().toISOString().slice(0, 10)}.pdf`;
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
