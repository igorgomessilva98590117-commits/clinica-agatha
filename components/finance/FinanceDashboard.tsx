import React, { useState, useCallback } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { Expense } from '../../utils/expenseTypes';
import { CATEGORY_LABELS } from '../../utils/expenseTypes';
import { MOCK_EXPENSES } from '../../utils/mockExpenses';
import { FinanceCharts } from './FinanceCharts';
import { FinanceExpenseForm } from './FinanceExpenseForm';
import { FinanceExpenseTable } from './FinanceExpenseTable';

const STORAGE_KEY = 'clinica_agatha_gastos';

function loadExpenses(): Expense[] {
  try {
    if (typeof localStorage === 'undefined') return [...MOCK_EXPENSES];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Expense[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    /* erro ao ler (dados corrompidos, etc) - não sobrescrever */
  }
  return [...MOCK_EXPENSES];
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function saveExpenses(data: Expense[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* localStorage indisponível (modo privado, quota excedida, etc) */
  }
}

export const FinanceDashboard: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(loadExpenses);

  const addExpense = useCallback((e: Omit<Expense, 'id'>) => {
    setExpenses((prev) => {
      const next = [...prev, { ...e, id: generateId() }];
      saveExpenses(next);
      return next;
    });
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => {
      const next = prev.filter((x) => x.id !== id);
      saveExpenses(next);
      return next;
    });
  }, []);

  const byCategory: Record<string, number> = {};
  expenses.forEach((e) => { byCategory[e.category] = (byCategory[e.category] || 0) + e.amount; });
  const categoryValues = Object.values(byCategory).map((v) => Math.round(v * 100) / 100);
  const total = categoryValues.reduce((s, v) => s + v, 0);
  const count = expenses.length;
  const topEntry = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
  const topCategoryKey = topEntry?.[0];
  const topCategoryLabel = topCategoryKey ? CATEGORY_LABELS[topCategoryKey as keyof typeof CATEGORY_LABELS] : '-';
  const uniqueMonths = new Set(expenses.map((e) => e.date.slice(0, 7)));
  const monthlyAvg = count > 0 ? total / Math.max(1, uniqueMonths.size) : 0;

  const handleExportExcel = () => {
    const rows = [
      ['Data', 'Descrição', 'Categoria', 'Valor (R$)'],
      ...expenses
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((e) => [
          e.date.split('-').reverse().join('/'),
          e.description,
          CATEGORY_LABELS[e.category],
          e.amount,
        ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Gastos');
    XLSX.writeFile(wb, `gastos_clinica_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-serif font-semibold text-brand-800">Controle de gastos</h2>
        <button
          type="button"
          onClick={handleExportExcel}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-brand-900 font-medium rounded-lg text-sm transition-colors shadow-md"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Exportar Excel
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-brand-200 p-4 shadow-sm">
          <p className="text-xs font-medium text-brand-500 uppercase tracking-wide">Total gasto</p>
          <p className="text-lg font-bold text-brand-800 mt-1">R$ {total.toFixed(2).replace('.', ',')}</p>
        </div>
        <div className="bg-white rounded-xl border border-brand-200 p-4 shadow-sm">
          <p className="text-xs font-medium text-brand-500 uppercase tracking-wide">Média mensal</p>
          <p className="text-lg font-bold text-brand-800 mt-1">R$ {monthlyAvg.toFixed(2).replace('.', ',')}</p>
        </div>
        <div className="bg-white rounded-xl border border-brand-200 p-4 shadow-sm">
          <p className="text-xs font-medium text-brand-500 uppercase tracking-wide">Maior categoria</p>
          <p className="text-lg font-bold text-brand-800 mt-1 truncate" title={topCategoryLabel}>{topCategoryLabel}</p>
        </div>
        <div className="bg-white rounded-xl border border-brand-200 p-4 shadow-sm">
          <p className="text-xs font-medium text-brand-500 uppercase tracking-wide">Lançamentos</p>
          <p className="text-lg font-bold text-brand-800 mt-1">{count}</p>
        </div>
      </div>

      <FinanceCharts expenses={expenses} />
      <FinanceExpenseForm onAdd={addExpense} />
      <FinanceExpenseTable expenses={expenses} onDelete={deleteExpense} />
    </div>
  );
};
