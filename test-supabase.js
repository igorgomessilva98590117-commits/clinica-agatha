// Teste rápido da conexão Supabase
// Execute: node test-supabase.js

import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || 'https://orzbncveztwvcqdqtizw.supabase.co';
const key = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_XE5UKkR5lZ-HcWjmOlEW9A_NImSB8bX';

const supabase = createClient(url, key);

async function test() {
  console.log('Testando conexão Supabase...');
  console.log('URL:', url);
  console.log('');
  
  const { data, error } = await supabase.from('gastos').select('id').limit(1);
  if (error) {
    console.error('❌ Erro ao ler:', error.message);
    console.log('\nTentando inserir um registro de teste...');
    const { data: ins, error: errIns } = await supabase.from('gastos').insert({
      description: 'Teste',
      amount: 1,
      category: 'outros',
      date: '2025-02-26'
    }).select();
    if (errIns) {
      console.error('❌ Erro ao inserir:', errIns.message);
      return;
    }
    console.log('✅ Inserção OK!', ins);
  } else {
    console.log('✅ Conexão OK! Tabela "gastos" acessível.');
    console.log('   Registros:', data?.length ?? 0);
  }
}

test();
