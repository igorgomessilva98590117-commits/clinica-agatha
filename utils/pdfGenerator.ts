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
  beige: rgb(250 / 255, 243 / 255, 235 / 255),
  beigeDark: rgb(235 / 255, 220 / 255, 200 / 255),
  lineGray: rgb(0.7, 0.7, 0.7),
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

const BOX = '[ ]';
const CHECK = '[X]';

function drawTricologiaHeader(page: any, font: any, fontBold: any, startY: number): number {
  const headerH = 52;
  const logoW = 140;
  const titleW = 220;
  const logoX = MARGIN;
  const titleX = (PAGE_WIDTH - titleW) / 2;
  const contactX = PAGE_WIDTH - MARGIN - 95;

  page.drawRectangle({
    x: 0,
    y: startY - headerH,
    width: logoX + logoW + 20,
    height: headerH,
    color: colors.brand,
  });
  page.drawRectangle({
    x: titleX - 10,
    y: startY - headerH,
    width: titleW + 20,
    height: headerH,
    color: colors.brand,
  });
  page.drawText('DRA. AGATHA', {
    x: logoX + 15,
    y: startY - 22,
    size: 14,
    font: fontBold,
    color: rgb(1, 1, 1),
  });
  page.drawText('ESTÉTICA AVANÇADA E TRICOLOGIA', {
    x: logoX + 15,
    y: startY - 36,
    size: 7,
    font: font,
    color: rgb(1, 1, 1),
  });
  page.drawText('FICHA ANAMNESE', {
    x: titleX + 15,
    y: startY - 22,
    size: 12,
    font: fontBold,
    color: rgb(1, 1, 1),
  });
  page.drawText('TRICOLOGIA', {
    x: titleX + 15,
    y: startY - 36,
    size: 10,
    font: fontBold,
    color: rgb(1, 1, 1),
  });
  page.drawText('(31) 99200-3849', {
    x: contactX,
    y: startY - 18,
    size: 8,
    font: font,
    color: colors.brand,
  });
  page.drawText('@biomed.aga', {
    x: contactX,
    y: startY - 32,
    size: 8,
    font: font,
    color: colors.brand,
  });
  return startY - headerH - 15;
}

function drawUnderline(page: any, x: number, y: number, len: number, color = colors.lineGray) {
  page.drawLine({ start: { x, y }, end: { x: x + len, y }, thickness: 0.4, color });
}

const ROW_H = 14;
const SIM_NAO_OPT_X = PAGE_WIDTH - MARGIN - 68;

function drawSimNao(page: any, font: any, _fontBold: any, label: string, x: number, y: number, _col2X: number, value?: string): number {
  const lines = wrapText(label.replace(/\s+/g, ' ').trim(), 58);
  for (const ln of lines) {
    page.drawText(ln, { x, y, size: 8, font: font, color: colors.brand800 });
    y -= 10;
  }
  y -= 2;
  const s = value === 'sim' ? CHECK : BOX;
  const n = value === 'nao' ? CHECK : BOX;
  page.drawText(`${s} Sim    ${n} Não`, { x: SIM_NAO_OPT_X, y, size: 8, font: font, color: colors.brand800 });
  return y - ROW_H;
}

function drawFieldInline(page: any, font: any, fontBold: any, label: string, x: number, y: number, underlineLen: number, value?: string): number {
  page.drawText(`${label} `, { x, y, size: 8, font: font, color: colors.brand800 });
  const textX = x + font.widthOfTextAtSize(label + ' ', 8);
  const text = (value || '').trim();
  if (text) {
    const short = text.length > 50 ? text.substring(0, 47) + '...' : text;
    page.drawText(short, { x: textX, y, size: 8, font: font, color: colors.brand800 });
  } else {
    drawUnderline(page, textX, y + 1, underlineLen);
  }
  return y - 12;
}

function drawFieldLine(page: any, font: any, fontBold: any, label: string, x: number, y: number, endX: number, value?: string): number {
  page.drawText(label, { x, y, size: 8, font: font, color: colors.brand800 });
  y -= 10;
  const text = (value || '').trim();
  if (text) {
    const lines = wrapText(text, 55);
    for (const line of lines) {
      page.drawText(line, { x, y, size: 8, font: font, color: colors.brand800 });
      y -= 10;
    }
    return y - 4;
  }
  drawUnderline(page, x, y + 2, endX - x);
  return y - 6;
}

function drawRadio(page: any, font: any, label: string, options: string[], x: number, y: number, selected?: string): number {
  page.drawText(label, { x, y, size: 8, font: font, color: colors.brand800 });
  y -= 10;
  const sel = (selected || '').toLowerCase();
  let optX = x;
  for (const opt of options) {
    if (optX > PAGE_WIDTH - MARGIN - 90) {
      optX = x;
      y -= 10;
    }
    const mark = sel.includes(opt.toLowerCase().substring(0, 4)) ? CHECK : BOX;
    page.drawText(`${mark} ${opt}  `, { x: optX, y, size: 8, font: font, color: colors.brand800 });
    optX += 50;
  }
  return y - ROW_H;
}

function drawCheckMulti(page: any, font: any, label: string, options: string[], x: number, y: number, selected?: string): number {
  page.drawText(label, { x, y, size: 8, font: font, color: colors.brand800 });
  y -= 10;
  const sel = (selected || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  let optX = x;
  for (const opt of options) {
    if (optX > PAGE_WIDTH - MARGIN - 75) {
      optX = x;
      y -= 10;
    }
    const isSel = sel.some(s => opt.toLowerCase().includes(s) || s.includes(opt.toLowerCase().split(' ')[0]));
    const mark = isSel ? CHECK : BOX;
    page.drawText(`${mark} ${opt}  `, { x: optX, y, size: 8, font: font, color: colors.brand800 });
    optX += 56;
  }
  return y - ROW_H;
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
      y = PAGE_HEIGHT - MARGIN - 15;
    }
  };

  y = drawTricologiaHeader(page, font, fontBold, PAGE_HEIGHT - MARGIN);

  const drawBanner = (title: string, h = 18) => {
    needsNewPage(h + 20);
    page.drawRectangle({
      x: MARGIN - 5,
      y: y - h,
      width: CONTENT_WIDTH + 10,
      height: h,
      color: colors.beige,
      borderColor: colors.brand200,
      borderWidth: 0.3,
    });
    page.drawText(title, {
      x: MARGIN + 8,
      y: y - h + 5,
      size: 10,
      font: fontBold,
      color: colors.brand800,
    });
    y -= h + 10;
  };

  const drawPanel = (h: number, color = colors.beige) => {
    page.drawRectangle({
      x: MARGIN - 5,
      y: y - h,
      width: CONTENT_WIDTH + 10,
      height: h,
      color,
      borderColor: colors.brand200,
      borderWidth: 0.3,
    });
  };

  drawBanner('1. Dados Pessoais', 22);
  const dadosH = 175;
  drawPanel(dadosH);
  let rowY = y - 12;
  const fld = (lbl: string, val: string, w: number) => {
    page.drawText(lbl, { x: MARGIN + 5, y: rowY, size: 8, font: font, color: colors.brand800 });
    if (val) page.drawText(val, { x: MARGIN + 7, y: rowY - 12, size: 8, font: font, color: colors.brand800 });
    else drawUnderline(page, MARGIN + 7, rowY - 10, Math.min(w, CONTENT_WIDTH - 20));
    rowY -= 20;
  };
  fld('Nome completo:', d('nomeCompleto'), 300);
  fld('Data nascimento:', d('dataNascimento'), 100);
  fld('Idade:', d('idade'), 50);
  const sexo = d('sexo').toLowerCase();
  page.drawText(`Sexo: ${sexo.includes('fem') ? CHECK : BOX} Femin.  ${sexo.includes('masc') ? CHECK : BOX} Masc.`, { x: MARGIN + 5, y: rowY, size: 8, font: font, color: colors.brand800 });
  rowY -= 20;
  fld('CPF:', d('cpf'), 120);
  fld('Profissão:', d('profissao'), 150);
  fld('Telefone:', d('telefone'), 100);
  fld('E-mail:', d('email'), 180);
  fld('Cidade/Endereço:', d('cidadeEndereco'), 400);
  y = rowY - 20;

  drawBanner('2. Anamnese Capilar (Queixas e Sintomas)', 20);
  needsNewPage(100);

  const row = (lbl: string, val: string, len: number) => {
    page.drawText(lbl, { x: MARGIN, y, size: 8, font: font, color: colors.brand800 });
    if (val) {
      const ln = wrapText(val, 65);
      for (const l of ln) {
        y -= 10;
        page.drawText(l, { x: MARGIN + 2, y, size: 8, font: font, color: colors.brand800 });
      }
    } else {
      drawUnderline(page, MARGIN + 2, y - 7, Math.min(len, CONTENT_WIDTH - 4));
      y -= 10;
    }
    y -= ROW_H;
  };

  row('Queixa principal:', d('queixaPrincipal'), 400);
  y = drawSimNao(page, font, fontBold, 'Coceira:', MARGIN, y, 0, d('coceira'));
  y = drawSimNao(page, font, fontBold, 'Dor:', MARGIN, y, 0, d('dor'));
  y = drawSimNao(page, font, fontBold, 'Ardência, queimação:', MARGIN, y, 0, d('ardencia'));
  y = drawSimNao(page, font, fontBold, 'Queda acentuada?', MARGIN, y, 0, d('quedaAcentuada'));
  row('Há quanto tempo?', d('quedaQuantoTempo'), 120);
  y = drawSimNao(page, font, fontBold, 'Falta de sensibilidade:', MARGIN, y, 0, d('faltaSensibilidade'));
  y = drawSimNao(page, font, fontBold, 'Tiveram períodos que a queda cessou e depois voltou?', MARGIN, y, 0, d('quedaVoltou'));
  y = drawSimNao(page, font, fontBold, 'Sensibilidade exacerbada:', MARGIN, y, 0, d('sensibilidadeExacerbada'));
  y = drawSimNao(page, font, fontBold, 'Nota presença de fios novos?', MARGIN, y, 0, d('fiosNovos'));
  y = drawSimNao(page, font, fontBold, 'Presença de caspa/descamação:', MARGIN, y, 0, d('caspa'));
  y = drawSimNao(page, font, fontBold, 'Houve perda de volume?', MARGIN, y, 0, d('perdaVolume'));
  const afin = d('afinamentoHaste').toLowerCase();
  page.drawText(`Afinamento da haste: ${afin.includes('presente') ? CHECK : BOX} Presente  ${afin.includes('ausente') ? CHECK : BOX} Ausente`, { x: MARGIN, y, size: 8, font: font, color: colors.brand800 });
  y -= ROW_H + 4;
  page.drawText('Tipo de cabelo e couro cabeludo:', { x: MARGIN, y, size: 8, font: font, color: colors.brand800 });
  y -= 10;
  const tpo = d('tipoCabelo').toLowerCase();
  page.drawText(`${tpo.includes('24h') ? CHECK : BOX} Oleoso em 24h  ${tpo.includes('48h') ? CHECK : BOX} Oleoso em 48h ou mais  ${tpo.includes('seco') ? CHECK : BOX} Seco`, { x: MARGIN, y, size: 8, font: font, color: colors.brand800 });
  y -= ROW_H + 4;
  row('Frequência de lavagem:', d('frequenciaLavagem'), 150);
  y = drawSimNao(page, font, fontBold, 'Há perda de pelos em outras partes do corpo?', MARGIN, y, 0, d('perdaOutrosPelos'));
  y = drawSimNao(page, font, fontBold, 'Diagnóstico prévio:', MARGIN, y, 0, d('diagnosticoPrevio'));
  y = drawSimNao(page, font, fontBold, 'Tratamento prévio:', MARGIN, y, 0, d('tratamentoPrevio'));
  y = drawSimNao(page, font, fontBold, 'O tratamento realizado foi orientado por um profissional:', MARGIN, y, 0, d('tratamentoOrientado'));
  y = drawSimNao(page, font, fontBold, 'Obteve resultados?', MARGIN, y, 0, d('obteveResultados'));
  y = drawSimNao(page, font, fontBold, 'Houve algum evento marcante que antecedeu a queda?', MARGIN, y, 0, d('eventoMarcante'));
  y = drawSimNao(page, font, fontBold, 'Possui algum problema de saúde hoje:', MARGIN, y, 0, d('problemaSaude'));
  row('Se sim, qual:', d('problemaSaudeQual'), 250);
  y = drawSimNao(page, font, fontBold, 'Casos de calvície na família:', MARGIN, y, 0, d('calvicieFamilia'));
  row('Se sim, qual parentesco:', d('calvicieParentesco'), 150);
  y = drawSimNao(page, font, fontBold, 'Doença crônica:', MARGIN, y, 0, d('doencaCronica'));
  row('Se sim, qual:', d('doencaCronicaQual'), 150);
  y = drawCheckMulti(page, font, 'Se doente crônico:', ['Hipertensão', 'Diabetes', 'Arritmia', 'Dislipidemia'], MARGIN, y, d('doencasCronicasTipos'));
  y -= 8;

  drawBanner('3. Histórico de Saúde • 4–8. Fisiologia, Procedimentos, Medicamentos, Sono, Histórico Médico', 22);
  needsNewPage(80);

  const row2 = (lbl: string, val: string, len: number) => {
    page.drawText(lbl, { x: MARGIN, y, size: 8, font: font, color: colors.brand800 });
    if (val) {
      const ln = wrapText(val, 65);
      for (const l of ln) {
        y -= 10;
        page.drawText(l, { x: MARGIN + 2, y, size: 8, font: font, color: colors.brand800 });
      }
    } else {
      drawUnderline(page, MARGIN + 2, y - 7, Math.min(len, CONTENT_WIDTH - 4));
      y -= 10;
    }
    y -= ROW_H;
  };

  y = drawRadio(page, font, 'Funcionamento do intestino:', ['Regular', 'Constipado'], MARGIN, y, d('intestino'));
  row2('Se constipado, qual frequência:', d('intestinoFrequencia'), 150);
  y = drawSimNao(page, font, fontBold, 'Uso de fonte térmica:', MARGIN, y, 0, d('fonteTermica'));
  row2('Se sim, qual frequência:', '', 120);
  y = drawSimNao(page, font, fontBold, 'Distúrbio da circulação (trombose, embolia, hemorragia):', MARGIN, y, 0, d('disturbioCirculacao'));
  y = drawSimNao(page, font, fontBold, 'Desregulação hormonal:', MARGIN, y, 0, d('desregulacaoHormonal'));
  row2('Se sim, qual:', d('desregulacaoHormonalQual'), 150);
  y = drawSimNao(page, font, fontBold, 'Histórico de tumores ou nódulos malignos - Pessoal ou familiar:', MARGIN, y, 0, d('tumores'));
  row2('Se sim, qual:', '', 80);
  y = drawSimNao(page, font, fontBold, 'Faz alisamento químico:', MARGIN, y, 0, d('alisamento'));
  row2('Se sim, qual frequência:', d('alisamentoFrequencia'), 120);
  row2('Quais cosméticos utiliza no cabelo:', d('cosmeticos'), 300);
  y = drawSimNao(page, font, fontBold, 'Usa penteados que causam tração:', MARGIN, y, 0, d('penteadosTracao'));
  row2('Se sim, qual:', d('penteadosQual'), 150);
  y = drawSimNao(page, font, fontBold, 'Sente dor decorrente dessa tração:', MARGIN, y, 0, d('dorTracao'));
  y = drawSimNao(page, font, fontBold, 'Fez transplante capilar:', MARGIN, y, 0, d('transplante'));
  y = drawSimNao(page, font, fontBold, 'Uso de contraceptivo:', MARGIN, y, 0, d('contraceptivo'));
  row2('Se sim, qual:', d('contraceptivoQual'), 150);
  const beb = d('bebidaAlcoolica').toLowerCase();
  page.drawText(`Bebida alcoólica: ${beb.includes('diar') ? CHECK : BOX} Diariamente  ${beb.includes('soc') ? CHECK : BOX} Socialmente  ${beb.includes('nao') || beb === 'não' ? CHECK : BOX} Não`, { x: MARGIN, y, size: 8, font: font, color: colors.brand800 });
  y -= ROW_H + 4;
  y = drawSimNao(page, font, fontBold, 'Faz uso de medicamento contínuo:', MARGIN, y, 0, d('medicamentoContinuo'));
  row2('Há quanto tempo?', '', 100);
  y = drawSimNao(page, font, fontBold, 'Está fazendo uso de algum medicamento no momento:', MARGIN, y, 0, d('medicamentoMomento'));
  row2('Se sim, qual:', d('medicamentoQual'), 250);
  y = drawSimNao(page, font, fontBold, 'Fuma:', MARGIN, y, 0, d('fuma'));
  row2('Há quanto tempo?', d('fumaQuantoTempo'), 100);
  y = drawSimNao(page, font, fontBold, 'Pratica exercícios físicos:', MARGIN, y, 0, d('exercicios'));
  row2('Se sim, qual frequência:', d('exerciciosFrequencia'), 120);
  y = drawSimNao(page, font, fontBold, 'Possui problemas relacionado ao sono:', MARGIN, y, 0, d('problemasSono'));
  row2('Quantidade de horas de sono por noite:', d('horasSono'), 80);
  y = drawSimNao(page, font, fontBold, 'Se julga uma pessoa estressada:', MARGIN, y, 0, d('estressada'));
  y = drawSimNao(page, font, fontBold, 'Ansiosa:', MARGIN, y, 0, d('ansiosa'));
  y = drawSimNao(page, font, fontBold, 'Depressiva:', MARGIN, y, 0, d('depressiva'));
  y = drawSimNao(page, font, fontBold, 'Faz algum tratamento de cunho psíquico:', MARGIN, y, 0, d('tratamentoPsiquico'));
  y = drawSimNao(page, font, fontBold, 'Alergia:', MARGIN, y, 0, d('alergia'));
  row2('Se sim, qual:', d('alergiaQual'), 150);
  y = drawSimNao(page, font, fontBold, 'Cirurgia recente:', MARGIN, y, 0, d('cirurgiaRecente'));
  row2('Se sim, qual:', '', 80);
  y = drawSimNao(page, font, fontBold, 'Gestante ou lactante:', MARGIN, y, 0, d('gestanteLactante'));
  y = drawRadio(page, font, 'Ciclo Menstrual:', ['Regular', 'Irregular'], MARGIN, y, d('cicloMenstrual'));
  y = drawRadio(page, font, 'Fluxo menstrual:', ['Intenso', 'Moderado', 'Baixo'], MARGIN, y, d('fluxoMenstrual'));
  y -= 8;

  drawBanner('9. Exame Físico e Tricoscopia', 20);
  needsNewPage(120);
  page.drawText('1. Alimentação', { x: MARGIN, y, size: 9, font: fontBold, color: colors.brand800 });
  y -= 12;
  for (let i = 0; i < 4; i++) {
    const ln = wrapText(d('alimentacao'), 70)[i] || '';
    if (ln) page.drawText(ln, { x: MARGIN, y, size: 8, font: font, color: colors.brand800 });
    else drawUnderline(page, MARGIN, y + 2, CONTENT_WIDTH);
    y -= 12;
  }
  y -= 8;
  page.drawText('2. Exame Físico', { x: MARGIN, y, size: 9, font: fontBold, color: colors.brand800 });
  y -= 12;
  for (let i = 0; i < 4; i++) {
    const ln = wrapText(d('exameFisico'), 70)[i] || '';
    if (ln) page.drawText(ln, { x: MARGIN, y, size: 8, font: font, color: colors.brand800 });
    else drawUnderline(page, MARGIN, y + 2, CONTENT_WIDTH);
    y -= 12;
  }
  y -= 15;

  drawBanner('TRICOSCOPIA', 14);
  needsNewPage(120);
  const anom = d('anomaliasHaste').toLowerCase();
  page.drawText('Anomalias/Fragilidades da haste:', { x: MARGIN, y, size: 8, font: font, color: colors.brand800 });
  y -= 10;
  page.drawText(`${anom.includes('ausente') ? CHECK : BOX} Ausente  ${anom.includes('presente') ? CHECK : BOX} Presente`, { x: MARGIN, y, size: 8, font: font, color: colors.brand800 });
  y -= ROW_H + 4;
  page.drawText('Óstios foliculares:', { x: MARGIN, y, size: 8, font: font, color: colors.brand800 });
  y -= 10;
  const ost = d('ostiosFoliculares').toLowerCase();
  const ostOpts = [`${ost.includes('normal') ? CHECK : BOX} Normal`, `${ost.includes('preto') ? CHECK : BOX} Preto`, `${ost.includes('branco') ? CHECK : BOX} Branco`, `${ost.includes('amarelo') ? CHECK : BOX} Amarelo`, `${ost.includes('vermelho') ? CHECK : BOX} Vermelho`, `${ost.includes('cinza') ? CHECK : BOX} Cinza/azulado`];
  let ox = MARGIN;
  for (const o of ostOpts) {
    if (ox + 80 > PAGE_WIDTH - MARGIN) { ox = MARGIN; y -= 10; }
    page.drawText(`${o}  `, { x: ox, y, size: 8, font: font, color: colors.brand800 });
    ox += 70;
  }
  y -= ROW_H + 4;
  page.drawText('Epiderme peri/interfolicular - Descamação:', { x: MARGIN, y, size: 8, font: font, color: colors.brand800 });
  y -= 10;
  const desc = d('descamacao').toLowerCase();
  const descOpts = [`${desc.includes('normal') && !desc.includes('difusa') ? CHECK : BOX} Normal (Ausente)`, `${desc.includes('difusa') ? CHECK : BOX} Difusa`, `${desc.includes('localizada') ? CHECK : BOX} Localizada`, `${desc.includes('perif') ? CHECK : BOX} Perifolicular`];
  let dx = MARGIN;
  for (const o of descOpts) {
    if (dx + 95 > PAGE_WIDTH - MARGIN) { dx = MARGIN; y -= 10; }
    page.drawText(`${o}  `, { x: dx, y, size: 8, font: font, color: colors.brand800 });
    dx += 95;
  }
  y -= ROW_H + 4;
  page.drawText('Coloração:', { x: MARGIN, y, size: 8, font: font, color: colors.brand800 });
  y -= 10;
  const col = d('coloracao').toLowerCase();
  const colOpts = [`${col.includes('castanha') ? CHECK : BOX} Castanha`, `${col.includes('rosa') ? CHECK : BOX} Rosa`, `${col.includes('vermelha') ? CHECK : BOX} Vermelha`, `${col.includes('amarela') ? CHECK : BOX} Amarela`, `${col.includes('branca') ? CHECK : BOX} Branca`, `${col.includes('azul') ? CHECK : BOX} Azul/violáceo`];
  let cx = MARGIN;
  for (const o of colOpts) {
    if (cx + 75 > PAGE_WIDTH - MARGIN) { cx = MARGIN; y -= 10; }
    page.drawText(`${o}  `, { x: cx, y, size: 8, font: font, color: colors.brand800 });
    cx += 75;
  }
  y -= 20;

  drawBanner('CONCLUSÃO', 14);
  needsNewPage(60);
  for (let i = 0; i < 3; i++) {
    const ln = wrapText(d('conclusao'), 70)[i] || '';
    if (ln) page.drawText(ln, { x: MARGIN, y, size: 8, font: font, color: colors.brand800 });
    else drawUnderline(page, MARGIN, y + 2, CONTENT_WIDTH);
    y -= 12;
  }
  y -= 20;

  const declH = 75;
  needsNewPage(declH + 30);
  page.drawRectangle({
    x: MARGIN - 5,
    y: y - declH,
    width: CONTENT_WIDTH + 10,
    height: declH,
    color: colors.beige,
    borderColor: colors.brand200,
    borderWidth: 0.3,
  });
  const decl = 'Eu declaro que todas as informações fornecidas nesta ficha são verdadeiras e completas, e autorizo a utilização destes dados para fins de planejamento e execução de tratamentos estéticos na clínica.';
  const declLines = wrapText(decl, 68);
  let declY = y - 18;
  for (const ln of declLines) {
    page.drawText(ln, { x: MARGIN + 5, y: declY, size: 8, font: font, color: colors.brand700 });
    declY -= 11;
  }
  y = declY - 15;
  page.drawText('Assinatura do paciente', { x: MARGIN + 5, y: y + 4, size: 7, font: font, color: colors.brand700 });
  if (d('assinatura')) page.drawText(d('assinatura'), { x: MARGIN + 5, y: y - 8, size: 8, font: font, color: colors.brand800 });
  else drawUnderline(page, MARGIN + 5, y - 6, 220);
  page.drawText('Data', { x: PAGE_WIDTH - MARGIN - 70, y: y + 4, size: 7, font: font, color: colors.brand700 });
  if (d('data')) page.drawText(d('data'), { x: PAGE_WIDTH - MARGIN - 70, y: y - 8, size: 8, font: font, color: colors.brand800 });
  else drawUnderline(page, PAGE_WIDTH - MARGIN - 70, y - 6, 55);
  y -= 25;

  for (const p of pages) {
    p.drawText(`Gerado em ${new Date().toLocaleString('pt-BR')} • Dra. Ágatha`, { x: MARGIN, y: 22, size: 7, font: font, color: colors.brand200 });
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
