import { supabase, hasSupabase } from './supabase';
import type { Expense } from './expenseTypes';
import { MOCK_EXPENSES } from './mockExpenses';

const STORAGE_KEY = 'clinica_agatha_gastos';

function loadFromStorage(): Expense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Expense[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    /* ignorar */
  }
  return [];
}

function saveToStorage(data: Expense[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignorar */
  }
}

function dbToExpense(row: { id: string; description: string; amount: number; category: string; date: string }): Expense {
  return {
    id: row.id,
    description: row.description,
    amount: Number(row.amount),
    category: row.category as Expense['category'],
    date: row.date,
  };
}

export async function fetchExpenses(): Promise<Expense[]> {
  if (hasSupabase && supabase) {
    const { data, error } = await supabase.from('gastos').select('id,description,amount,category,date').order('date', { ascending: false });
    if (!error && data) return data.map(dbToExpense);
    return [];
  }
  const stored = loadFromStorage();
  return stored.length > 0 ? stored : [...MOCK_EXPENSES];
}

export async function addExpense(expense: Omit<Expense, 'id'>): Promise<Expense | null> {
  if (hasSupabase && supabase) {
    const { data, error } = await supabase
      .from('gastos')
      .insert({
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
      })
      .select('id,description,amount,category,date')
      .single();
    if (!error && data) return dbToExpense(data);
    return null;
  }
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
  const newExpense: Expense = { ...expense, id };
  const stored = loadFromStorage();
  stored.push(newExpense);
  saveToStorage(stored);
  return newExpense;
}

export async function deleteExpense(id: string): Promise<boolean> {
  if (hasSupabase && supabase) {
    const { error } = await supabase.from('gastos').delete().eq('id', id);
    return !error;
  }
  const stored = loadFromStorage();
  const next = stored.filter((x) => x.id !== id);
  saveToStorage(next);
  return true;
}
