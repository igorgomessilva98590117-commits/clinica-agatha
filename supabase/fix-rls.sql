-- Execute no Supabase SQL Editor para permitir adicionar gastos
-- https://supabase.com/dashboard/project/orzbncveztwvcqdqtizw/sql/new

ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "gastos_anon_all" ON gastos;
CREATE POLICY "gastos_anon_all" ON gastos FOR ALL TO anon USING (true) WITH CHECK (true);
