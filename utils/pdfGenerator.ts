import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const FONT_SIZE = 10;
const LINE_HEIGHT = 14;
const MARGIN = 50;
const MAX_WIDTH = 72;
const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;

const labelMap: Record<string, string> = {
  fullName: 'Nome Completo',
  birthDate: 'Data de Nascimento',
  emergencyContactName: 'Contato de Emergência - Nome',
  emergencyContactPhone: 'Contato de Emergência - Telefone',
  emergencyContactRelationship: 'Contato de Emergência - Parentesco',
  emergencyContactNotes: 'Contato de Emergência - Observações',
  mainComplaint: 'Queixa Principal',
  hasChemicalHistory: 'Procedimentos químicos (6 meses)',
  chemicalDetails: 'Detalhes dos procedimentos',
  healthHistory: 'História de saúde',
  areaOfInterest: 'Área de Interesse',
  priorProcedures: 'Procedimentos anteriores',
  allergies: 'Alergias',
  skinType: 'Tipo de Pele',
  concerns: 'Preocupações',
  currentRoutine: 'Rotina Atual',
  medications: 'Medicamentos',
  treatmentArea: 'Área de Tratamento',
  goal: 'Objetivo',
  priorTreatments: 'Tratamentos Anteriores',
  contraindications: 'Contraindicações',
};

const selectLabels: Record<string, Record<string, string>> = {
  hasChemicalHistory: { yes: 'Sim', no: 'Não' },
  emergencyContactRelationship: {
    conjuge: 'Cônjuge',
    pai: 'Pai',
    mae: 'Mãe',
    filho: 'Filho(a)',
    irmao: 'Irmão(ã)',
    'outro-familiar': 'Outro familiar',
    amigo: 'Amigo(a)',
    outro: 'Outro',
  },
  areaOfInterest: {
    testa: 'Testa (rugas)',
    olhos: 'Entre as sobrancelhas (glabela)',
    'olhos-pes': 'Região dos olhos (pés de galinha)',
    multipla: 'Múltiplas áreas',
    outra: 'Outra área',
  },
  skinType: {
    oleosa: 'Oleosa',
    seca: 'Seca',
    mista: 'Mista',
    normal: 'Normal',
    sensivel: 'Sensível',
    'nao-sei': 'Não sei',
  },
  treatmentArea: {
    'couro-cabeludo': 'Couro cabeludo',
    rosto: 'Rosto',
    corpo: 'Corpo',
    celulite: 'Celulite/Gordura localizada',
    estrias: 'Estrias',
    outra: 'Outra',
  },
};

function getDisplayLabel(key: string): string {
  return labelMap[key] || key;
}

function getDisplayValue(key: string, value: string): string {
  const selectMap = selectLabels[key];
  if (selectMap && value) {
    return selectMap[value] || value;
  }
  return value;
}

function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';
  for (const word of words) {
    if (currentLine.length + word.length + 1 <= maxCharsPerLine) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word.length > maxCharsPerLine ? word.substring(0, maxCharsPerLine) : word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
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
  let y = PAGE_HEIGHT - 50;

  const brandColor = rgb(0.255, 0.012, 0.106);
  const blackColor = rgb(0, 0, 0);
  const grayColor = rgb(0.4, 0.4, 0.4);

  page.drawText('Clínica Ágatha Santos', {
    x: MARGIN,
    y,
    size: 18,
    font: fontBold,
    color: brandColor,
  });
  y -= 24;

  page.drawText(`Ficha de Avaliação - ${serviceName}`, {
    x: MARGIN,
    y,
    size: 14,
    font: font,
    color: brandColor,
  });
  y -= 20;

  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_WIDTH - MARGIN, y },
    thickness: 1,
    color: brandColor,
  });
  y -= 20;

  const entries = Object.entries(formData).filter(([, v]) => v !== undefined && v !== '');
  const currentPage = page;
  for (const [key, value] of entries) {
    const label = getDisplayLabel(key);
    const displayValue = getDisplayValue(key, value);
    const fullText = `${displayValue}`;
    const lines = wrapText(fullText, MAX_WIDTH);

    if (y < 80) break;

    currentPage.drawText(`${label}:`, {
      x: MARGIN,
      y,
      size: FONT_SIZE,
      font: fontBold,
      color: blackColor,
    });
    y -= LINE_HEIGHT;

    for (const line of lines) {
      if (y < 80) break;
      currentPage.drawText(line, {
        x: MARGIN + 5,
        y,
        size: FONT_SIZE,
        font: font,
        color: blackColor,
      });
      y -= LINE_HEIGHT;
    }
    y -= 8;
  }

  const pages = pdfDoc.getPages();
  const lastPage = pages[pages.length - 1];
  lastPage.drawText(
    `Gerado em ${new Date().toLocaleString('pt-BR')} - Dra. Ágatha Santos - Estética Avançada e Tricologia`,
    {
      x: MARGIN,
      y: 30,
      size: 8,
      font: font,
      color: grayColor,
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

export function getEmailContent(formData: Record<string, string>, serviceName: string): {
  subject: string;
  body: string;
} {
  const subject = encodeURIComponent(`Ficha de Avaliação - ${serviceName} - ${formData.fullName || 'Paciente'}`);
  
  let body = `Segue a ficha de avaliação preenchida:\n\n`;
  body += `--- FICHA DE AVALIAÇÃO - ${serviceName} ---\n\n`;
  
  const entries = Object.entries(formData).filter(([, v]) => v !== undefined && v !== '');
  for (const [key, value] of entries) {
    const label = getDisplayLabel(key);
    const displayValue = getDisplayValue(key, value);
    body += `${label}: ${displayValue}\n`;
  }
  
  body += `\n---\nPor favor, anexe o PDF gerado ao enviar este email.`;
  
  return { subject, body: encodeURIComponent(body) };
}
