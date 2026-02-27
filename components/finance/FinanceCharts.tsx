import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Expense } from '../../utils/expenseTypes';
import { CATEGORY_LABELS } from '../../utils/expenseTypes';

const CHART_COLORS = ['#41031b', '#C2A877', '#9e4d61', '#8e7345', '#e8c4cd', '#380218', '#2e0114', '#a88d5c', '#c992a0', '#240110'];

interface FinanceChartsProps {
  expenses: Expense[];
}

function formatMonth(dateStr: string): string {
  const [y, m] = dateStr.split('-');
  const months: Record<string, string> = { '01': 'Jan', '02': 'Fev', '03': 'Mar', '04': 'Abr', '05': 'Mai', '06': 'Jun', '07': 'Jul', '08': 'Ago', '09': 'Set', '10': 'Out', '11': 'Nov', '12': 'Dez' };
  return `${months[m] || m}/${y.slice(2)}`;
}

export const FinanceCharts: React.FC<FinanceChartsProps> = ({ expenses }) => {
  const byCategory = React.useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map).map(([name, value]) => ({
      name: CATEGORY_LABELS[name as keyof typeof CATEGORY_LABELS] || name,
      value: Math.round(value * 100) / 100,
    })).sort((a, b) => b.value - a.value);
  }, [expenses]);

  const byMonth = React.useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      const key = e.date.slice(0, 7);
      map[key] = (map[key] || 0) + e.amount;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => ({ month: formatMonth(key + '-01'), total: Math.round(value * 100) / 100 }));
  }, [expenses]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border border-brand-200 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-brand-800 mb-4">Por categoria</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={byCategory}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => name + ' ' + (percent * 100).toFixed(0) + '%'}
              >
                {byCategory.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => 'R$ ' + v.toFixed(2).replace('.', ',')} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-brand-200 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-brand-800 mb-4">Gastos por mês</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byMonth} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8c4cd" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#2e0114' }} />
              <YAxis tick={{ fontSize: 11, fill: '#2e0114' }} tickFormatter={(v) => 'R$ ' + v} />
              <Tooltip formatter={(v: number) => ['R$ ' + v.toFixed(2).replace('.', ','), 'Total']} />
              <Bar dataKey="total" fill="#41031b" radius={[4, 4, 0, 0]} name="Total" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
