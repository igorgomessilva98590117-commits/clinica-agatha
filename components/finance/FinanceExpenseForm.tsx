import React, { useState } from 'react';
import type { Expense, ExpenseCategory } from '../../utils/expenseTypes';
import { CATEGORY_LABELS } from '../../utils/expenseTypes';

interface FinanceExpenseFormProps {
  onAdd: (expense: Omit<Expense, 'id'>) => void;
}

const CATEGORY_OPTIONS: ExpenseCategory[] = [
  'toxina-botulinica', 'preenchedores', 'bioestimuladores', 'descartaveis', 'cosmeticos', 'limpeza-de-pele',
  'aluguel', 'marketing', 'equipamentos', 'treinamento', 'outros',
];

export const FinanceExpenseForm: React.FC<FinanceExpenseFormProps> = ({ onAdd }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('outros');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(amount.replace(',', '.'));
    if (!description.trim() || isNaN(value) || value <= 0) return;
    onAdd({ description: description.trim(), amount: value, category, date });
    setDescription('');
    setAmount('');
    setCategory('outros');
    setDate(new Date().toISOString().slice(0, 10));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-brand-200 p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-brand-800 mb-3">Novo gasto</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <input
          type="text"
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-brand-200 bg-brand-50 text-brand-800 placeholder:text-brand-400 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
        />
        <input
          type="text"
          placeholder="Valor (R$)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-brand-200 bg-brand-50 text-brand-800 placeholder:text-brand-400 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
          className="w-full px-3 py-2 rounded-lg border border-brand-200 bg-brand-50 text-brand-800 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
        >
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-brand-200 bg-brand-50 text-brand-800 text-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
        />
      </div>
      <button
        type="submit"
        className="mt-3 px-4 py-2 bg-brand-500 text-gold-500 font-medium rounded-lg text-sm hover:bg-brand-600 transition-colors"
      >
        Adicionar
      </button>
    </form>
  );
};
