# Configurar Supabase no Vercel

Para os dados de **Finanças** serem iguais no celular e no computador (e em qualquer dispositivo), o Vercel precisa das variáveis do Supabase.

## Passo a passo

1. Acesse o projeto no Vercel: https://vercel.com/dashboard  
2. Clique no seu projeto (clínica)  
3. Vá em **Settings** → **Environment Variables**  
4. Adicione:

| Nome | Valor |
|------|-------|
| `VITE_SUPABASE_URL` | `https://orzbncveztwvcqdqtizw.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Sua chave anon (copie do arquivo `.env` local ou do Supabase → Settings → API) |

5. Marque os ambientes: **Production**, **Preview** e **Development**  
6. Clique em **Save**  
7. **Redeploy:** vá em **Deployments** → último deploy → **⋯** → **Redeploy**

⚠️ O redeploy é obrigatório para as variáveis terem efeito.

Depois disso, celular e computador passarão a usar os mesmos dados do Supabase.
