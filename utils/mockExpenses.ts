import type { Expense } from './expenseTypes';

export const MOCK_EXPENSES: Expense[] = [
  { id: '1', description: 'Toxina botulínica - lote mensal', amount: 2400, category: 'toxina-botulinica', date: '2025-02-10' },
  { id: '2', description: 'Ácido hialurônico - preenchedor', amount: 1800, category: 'preenchedores', date: '2025-02-12' },
  { id: '3', description: 'Luvas e agulhas descartáveis', amount: 320, category: 'descartaveis', date: '2025-02-05' },
  { id: '4', description: 'Aluguel clínica - fevereiro', amount: 3500, category: 'aluguel', date: '2025-02-01' },
  { id: '5', description: 'Instagram Ads', amount: 450, category: 'marketing', date: '2025-02-08' },
  { id: '6', description: 'Skinbooster - ácido hialurônico', amount: 950, category: 'bioestimuladores', date: '2025-02-15' },
  { id: '7', description: 'Produtos pós-procedimento', amount: 280, category: 'cosmeticos', date: '2025-02-18' },
  { id: '8', description: 'Curso atualização - toxina', amount: 1200, category: 'treinamento', date: '2025-01-20' },
  { id: '9', description: 'Toxina - reposição', amount: 1600, category: 'toxina-botulinica', date: '2025-01-25' },
  { id: '10', description: 'Material descartável - janeiro', amount: 410, category: 'descartaveis', date: '2025-01-10' },
];
