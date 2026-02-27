import React from 'react';
import { Trash2 } from 'lucide-react';
import type { Expense } from '../../utils/expenseTypes';
import { CATEGORY_LABELS } from '../../utils/expenseTypes';

interface FinanceExpenseTableProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export const FinanceExpenseTable: React.FC<FinanceExpenseTableProps> = ({ expenses, onDelete }) => {
  const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="bg-white rounded-xl border border-brand-200 overflow-hidden shadow-sm">
      <h3 className="text-sm font-semibold text-brand-800 p-4 border-b border-brand-200">Histórico de gastos</h3>
      <div className="overflow-x-auto max-h-80 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-brand-100 text-brand-700 sticky top-0">
            <tr>
              <th className="text-left py-2 px-3 font-medium">Data</th>
              <th className="text-left py-2 px-3 font-medium">Descrição</th>
              <th className="text-left py-2 px-3 font-medium">Categoria</th>
              <th className="text-right py-2 px-3 font-medium">Valor</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((e) => (
              <tr key={e.id} className="border-t border-brand-100 hover:bg-brand-50">
                <td className="py-2 px-3 text-brand-700">{e.date.split('-').reverse().join('/')}</td>
                <td className="py-2 px-3 text-brand-800">{e.description}</td>
                <td className="py-2 px-3 text-brand-600">{CATEGORY_LABELS[e.category]}</td>
                <td className="py-2 px-3 text-right font-medium text-brand-800">
                  R$ {e.amount.toFixed(2).replace('.', ',')}
                </td>
                <td className="py-2 px-2">
                  <button
                    type="button"
                    onClick={() => onDelete(e.id)}
                    className="p-1.5 text-brand-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sorted.length === 0 && (
        <p className="p-4 text-brand-500 text-sm text-center">Nenhum gasto cadastrado.</p>
      )}
    </div>
  );
};
