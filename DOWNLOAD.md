# 📥 Download do Projeto ZYGO CRM

## 🎯 Opções de Download

### Opção 1: Download Direto (Recomendado)

1. **Clique no botão "Download"** no canto superior direito desta página
2. Ou use o link direto: [Download ZIP](download)
3. Extraia o ficheiro ZIP
4. Siga as instruções abaixo

### Opção 2: Git Clone

```bash
git clone <repository-url>
cd zygo-crm
```

---

## 🚀 Setup Local (Após Download)

### 1️⃣ Instalar Node.js

Se ainda não tem o Node.js instalado:
- Download: https://nodejs.org/
- Versão recomendada: **18.x ou superior**

Verificar instalação:
```bash
node --version
npm --version
```

### 2️⃣ Instalar Dependências

Abra o terminal na pasta do projeto e execute:

```bash
npm install
```

Isto vai instalar todas as dependências necessárias (React, Supabase, Tailwind, etc.)

### 3️⃣ Configurar Base de Dados (Opcional)

Se quiser usar o Supabase:

1. Crie uma conta em https://supabase.com
2. Crie um novo projeto
3. Execute o SQL em `supabase/schema.sql`
4. Copie as credenciais para `.env.local`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

**Se não configurar o Supabase**, o sistema funciona em **modo demo** com dados locais.

### 4️⃣ Executar o Projeto

```bash
npm run dev
```

O terminal vai mostrar:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### 5️⃣ Abrir no Browser

Acesse: **http://localhost:3000**

---

## 📁 Estrutura do Projeto

```
zygo-crm/
├── 📄 README.md              # Documentação principal
├── 📄 DEPLOY.md              # Guia de deploy
├── 📄 USERS.md               # Gestão de utilizadores
├── 📄 .env.local             # Configuração Supabase (criar)
├── 📄 package.json           # Dependências
├── 📄 vite.config.js         # Configuração Vite
├── 📄 tsconfig.json          # Configuração TypeScript
│
├── 📂 supabase/
│   └── schema.sql            # Schema da base de dados
│
└── 📂 src/
    ├── main.tsx              # Entry point
    ├── App.tsx               # Componente principal
    ├── index.css             # Estilos globais
    ├── types.ts              # Tipos TypeScript
    ├── data.ts               # Dados iniciais
    │
    ├── 📂 components/        # Componentes React
    │   ├── Sidebar.tsx
    │   ├── Dashboard.tsx
    │   ├── LeadList.tsx
    │   ├── LeadForm.tsx
    │   ├── LeadDetail.tsx
    │   ├── Pipeline.tsx
    │   ├── Automations.tsx
    │   ├── LoginPage.tsx
    │   ├── ProfilePage.tsx
    │   └── UsersManagement.tsx
    │
    ├── 📂 context/           # React Context
    │   ├── AuthContext.tsx
    │   └── CRMContext.tsx
    │
    ├── 📂 services/          # Serviços
    │   ├── authService.ts
    │   └── leadsService.ts
    │
    └── 📂 lib/               # Bibliotecas
        └── supabase.ts
```

---

## 🔧 Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Cria build de produção |
| `npm run preview` | Preview do build |
| `npm run typecheck` | Verifica tipos TypeScript |

---

## 🎨 Tecnologias Utilizadas

- **React 18** - Framework UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Supabase** - Base de dados PostgreSQL
- **Lucide React** - Ícones
- **date-fns** - Manipulação de datas

---

## 📱 Acesso Mobile

Para aceder do telemóvel na mesma rede:

```bash
npm run dev -- --host
```

Depois acesse com o IP da sua máquina:
```
http://192.168.x.x:3000
```

---

## 🐛 Troubleshooting

### Erro: "Cannot find module"
```bash
rm -rf node_modules
npm install
```

### Erro: "Port already in use"
```bash
npm run dev -- --port 3001
```

### Erro: "Cannot read properties of null (reading 'useState')"
```bash
# Limpar cache
rm -rf node_modules package-lock.json .vite
npm install
npm run dev
```

### Erro de TypeScript
```bash
npm run typecheck
```

---

## 🌐 Deploy para Produção

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

Veja **DEPLOY.md** para instruções completas.

---

## 📞 Suporte

- **Documentação**: README.md, DEPLOY.md, USERS.md
- **Supabase**: https://supabase.com/docs
- **Vite**: https://vitejs.dev
- **React**: https://react.dev

---

## ✅ Checklist de Setup

- [ ] Node.js instalado (v18+)
- [ ] Dependências instaladas (`npm install`)
- [ ] `.env.local` configurado (opcional)
- [ ] Servidor a correr (`npm run dev`)
- [ ] Browser aberto em http://localhost:3000

---

**Pronto! O ZYGO CRM está instalado e pronto para uso! 🎉**

Para questões ou problemas, consulte a documentação ou abra uma issue no repositório.
