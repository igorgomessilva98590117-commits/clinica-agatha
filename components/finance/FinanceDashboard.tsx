import React, { useState, useCallback, useEffect } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { Expense } from '../../utils/expenseTypes';
import { CATEGORY_LABELS } from '../../utils/expenseTypes';
import { hasSupabase } from '../../utils/supabase';
import { fetchExpenses, addExpense as addExpenseToDb, deleteExpense as deleteExpenseFromDb, subscribeToExpenses } from '../../utils/expenseService';
import { FinanceCharts } from './FinanceCharts';
import { FinanceExpenseForm } from './FinanceExpenseForm';
import { FinanceExpenseTable } from './FinanceExpenseTable';

export const FinanceDashboard: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [addError, setAddError] = useState('');

  useEffect(() => {
    fetchExpenses().then((data) => {
      setExpenses(data);
      setLoading(false);
    });
    const unsub = subscribeToExpenses(() => fetchExpenses().then(setExpenses));
    return () => unsub?.();
  }, []);

  const addExpense = useCallback((e: Omit<Expense, 'id'>) => {
    setAddError('');
    addExpenseToDb(e).then(({ data, error }) => {
      if (data) setExpenses((prev) => [...prev, data]);
      if (error) setAddError(error);
    });
  }, []);

  const deleteExpense = useCallback((id: string) => {
    deleteExpenseFromDb(id).then((ok) => {
      if (ok) setExpenses((prev) => prev.filter((x) => x.id !== id));
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

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <p className="text-center text-brand-600 py-12">Carregando gastos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-semibold text-brand-800">Controle de gastos</h2>
          {!hasSupabase && (
            <p className="text-xs text-amber-600 mt-0.5">Dados locais — celular e PC não sincronizam. Adicione as variáveis Supabase no Vercel.</p>
          )}
        </div>
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
      {addError && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2" role="alert">{addError}</p>
      )}
      <FinanceExpenseForm onAdd={addExpense} />
      <FinanceExpenseTable expenses={expenses} onDelete={deleteExpense} />
    </div>
  );
};
