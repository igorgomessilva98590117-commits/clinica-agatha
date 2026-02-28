# Configuração do Supabase (gratuito)

Siga estes passos para armazenar os gastos na nuvem.

## 1. Criar conta no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em **Start your project**
3. Faça login com **GitHub** ou **E-mail**
4. O plano gratuito permite até **2 projetos**

## 2. Criar projeto

1. No dashboard, clique em **New Project**
2. Escolha a **Organization** (ou crie uma)
3. Preencha:
   - **Name**: `clinica-agatha` (ou outro nome)
   - **Database Password**: crie uma senha forte e guarde
   - **Region**: escolha a mais próxima (ex: São Paulo)
4. Clique em **Create new project** e aguarde alguns minutos

## 3. Criar a tabela de gastos

1. No menu lateral, vá em **SQL Editor**
2. Clique em **New query**
3. Cole o conteúdo do arquivo `supabase/schema.sql`
4. Clique em **Run** (ou Ctrl+Enter)

## 4. Obter as chaves de API

1. No menu lateral, vá em **Settings** (ícone de engrenagem)
2. Clique em **API** no submenu
3. Copie:
   - **Project URL** → será o `VITE_SUPABASE_URL`
   - **anon public** (em Project API keys) → será o `VITE_SUPABASE_ANON_KEY`

## 5. Configurar o projeto

1. Na raiz do projeto, crie o arquivo `.env` (copie do `.env.example`)
2. Cole as credenciais:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Reinicie o servidor de desenvolvimento (`npm run dev`)

**No Vercel:** adicione as mesmas variáveis em Settings → Environment Variables.

## 6. Sincronização em tempo real (opcional)

Para que adições/remoções apareçam em todas as sessões (Vercel, celular, etc) sem recarregar:

1. No Supabase, vá em **Database** → **Replication**
2. Habilite a tabela **gastos** para Realtime

## Pronto

Os gastos passam a ser salvos no Supabase. Qualquer pessoa logada com a conta momo vê os mesmos dados. Se o `.env` não estiver configurado, o app continua usando o localStorage normalmente.
