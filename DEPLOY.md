# 🚀 ZYGO CRM - Guia de Deploy e Configuração

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com) (gratuito)
- Conta no [Vercel](https://vercel.com) ou [Netlify](https://netlify.com) (gratuito)
- Node.js 18+ instalado

---

## 🗄️ PASSO 1: Configurar Base de Dados (Supabase)

### 1.1 Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em **"New Project"**
3. Preencha:
   - **Name**: `zygo-crm`
   - **Database Password**: (guarde esta password!)
   - **Region**: Europe West (ou mais próxima)
4. Aguarde a criação (~2 minutos)

### 1.2 Executar Schema SQL

1. No dashboard do Supabase, vá em **SQL Editor** (ícone no menu lateral)
2. Clique em **"New Query"**
3. Copie todo o conteúdo de `supabase/schema.sql`
4. Cole no editor e clique em **"Run"** (ou Ctrl+Enter)
5. Verifique que todas as tabelas foram criadas em **Table Editor**

### 1.3 Obter Credenciais

1. Vá em **Settings** → **API**
2. Copie:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public key** (chave longa que começa com `eyJ...`)

### 1.4 Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ IMPORTANTE**: 
- Substitua pelos valores reais do seu projeto Supabase
- Nunca commite o arquivo `.env.local` para o Git
- O arquivo `.gitignore` já está configurado para ignorá-lo

---

## 🏗️ PASSO 2: Testar Localmente

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Abrir no browser
# http://localhost:5173
```

Verifique se:
- ✅ Os leads são carregados da base de dados
- ✅ Consegue criar novos leads
- ✅ Consegue alterar etapas no pipeline
- ✅ As notas e histórico são guardados

---

## 🌐 PASSO 3: Deploy para Produção

### Opção A: Vercel (Recomendado)

1. **Instalar Vercel CLI** (opcional):
   ```bash
   npm install -g vercel
   ```

2. **Deploy via CLI**:
   ```bash
   vercel
   ```
   - Siga as instruções (login, project name, etc.)
   - Quando pedir as environment variables, adicione:
     - `VITE_SUPABASE_URL` = (sua URL)
     - `VITE_SUPABASE_ANON_KEY` = (sua chave)

3. **Deploy via GitHub** (alternativa):
   - Faça push do código para o GitHub
   - Acesse [vercel.com/new](https://vercel.com/new)
   - Importe o repositório
   - Adicione as environment variables nas settings do projeto
   - Clique em **"Deploy"**

### Opção B: Netlify

1. **Build local**:
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=dist
   ```

3. **Deploy via GitHub** (alternativa):
   - Push para o GitHub
   - Acesse [netlify.com](https://netlify.com)
   - Clique em **"Add new site"** → **"Import an existing project"**
   - Selecione o repositório
   - Configure:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
   - Adicione as environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Clique em **"Deploy site"**

---

## 🔐 PASSO 4: Configurar Autenticação (Opcional)

Se quiser adicionar login de usuários:

### 4.1 Habilitar Auth no Supabase

1. Vá em **Authentication** → **Providers**
2. Ative os providers desejados (Email, Google, GitHub, etc.)
3. Configure as URLs de redirecionamento

### 4.2 Atualizar Políticas RLS

Edite as políticas no Supabase para restringir acesso:

```sql
-- Exemplo: Apenas usuários autenticados podem ver leads
DROP POLICY "Authenticated users can view leads" ON leads;

CREATE POLICY "Users can view their own leads" ON leads
  FOR SELECT
  USING (auth.uid() IS NOT NULL);
```

---

## 📊 PASSO 5: Monitorização e Backup

### 5.1 Monitorar Uso

No Supabase dashboard:
- **Database** → Ver queries lentas
- **Logs** → Ver erros da API
- **Auth** → Ver usuários ativos

### 5.2 Backup Automático

Supabase faz backups automáticos diários (plano gratuito).

Para backup manual:
```bash
# Instalar pg_dump
# Exportar dados
pg_dump -h db.xxxxx.supabase.co -U postgres -d postgres > backup.sql
```

---

## 🛠️ Troubleshooting

### Problema: Leads não carregam
- ✅ Verifique se as variáveis de ambiente estão corretas
- ✅ Verifique se o schema SQL foi executado
- ✅ Verifique as políticas RLS no Supabase

### Problema: Erro 401 Unauthorized
- ✅ Verifique se a anon key está correta
- ✅ Verifique se as políticas RLS permitem acesso

### Problema: Build falha
- ✅ Execute `npm install` novamente
- ✅ Verifique se todas as dependências estão instaladas
- ✅ Limpe o cache: `rm -rf node_modules && npm install`

---

## 📞 Suporte

- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com

---

## 🎯 Próximos Passos

Após o deploy, considere:

1. **Adicionar Autenticação**: Login para usuários
2. **Realtime Subscriptions**: Atualizações em tempo real
3. **Storage**: Upload de arquivos/fotos dos leads
4. **Edge Functions**: Lógica de negócio no servidor
5. **Analytics**: Integrar com Google Analytics ou Plausible

---

## ✅ Checklist Final

- [ ] Projeto Supabase criado
- [ ] Schema SQL executado
- [ ] Variáveis de ambiente configuradas
- [ ] Testes locais funcionando
- [ ] Deploy realizado com sucesso
- [ ] URL de produção acessível
- [ ] Dados de teste inseridos
- [ ] Monitorização configurada

---

**Parabéns! Seu ZYGO CRM está agora em produção! 🎉**
