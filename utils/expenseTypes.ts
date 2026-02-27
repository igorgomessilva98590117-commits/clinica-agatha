export type ExpenseCategory =
  | 'toxina-botulinica'
  | 'preenchedores'
  | 'bioestimuladores'
  | 'descartaveis'
  | 'cosmeticos'
  | 'limpeza-de-pele'
  | 'aluguel'
  | 'marketing'
  | 'equipamentos'
  | 'treinamento'
  | 'outros';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
}

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  'toxina-botulinica': 'Toxina Botulínica',
  preenchedores: 'Preenchedores',
  bioestimuladores: 'Bioestimuladores',
  descartaveis: 'Descartáveis',
  cosmeticos: 'Cosméticos',
  'limpeza-de-pele': 'Limpeza de pele',
  aluguel: 'Aluguel',
  marketing: 'Marketing',
  equipamentos: 'Equipamentos',
  treinamento: 'Treinamento',
  outros: 'Outros',
};
