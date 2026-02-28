-- Execute no Supabase: SQL Editor > New query > Cole e Run
-- https://supabase.com/dashboard/project/orzbncveztwvcqdqtizw/sql/new

CREATE TABLE IF NOT EXISTS gastos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Garante acesso via API
GRANT ALL ON gastos TO anon;
GRANT ALL ON gastos TO authenticated;

-- Permite anon inserir, ler, atualizar e apagar (conta momo compartilhada)
ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "gastos_anon_all" ON gastos;
CREATE POLICY "gastos_anon_all" ON gastos FOR ALL TO anon USING (true) WITH CHECK (true);

-- Realtime: vá em Database > Replication no Supabase e habilite a tabela "gastos"
