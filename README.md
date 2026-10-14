# 🚀 ZYGO CRM - Sistema de Gestão de Leads

Sistema CRM completo para gestão e follow-up de leads, desenvolvido com React, TypeScript, Tailwind CSS e Supabase.

## ✨ Funcionalidades

- ✅ **Dashboard** com KPIs e métricas em tempo real
- ✅ **Pipeline Kanban** com drag & drop
- ✅ **Gestão de Leads** (CRUD completo)
- ✅ **Automações** (boas-vindas, SLA, handover)
- ✅ **Base de Dados PostgreSQL** (Supabase)
- ✅ **Design Responsivo** (mobile-first)
- ✅ **Identidade Visual ZYGO** (#063C20 + #C0D637)

## 🎯 Proprietários do Lead

- Content Specialist
- Customer Success
- CMO

## 📋 Origens do Lead

- Website
- LinkedIn
- Instagram
- Facebook
- Evento
- Indicação
- Google Ads

## 🛠️ Serviços de Interesse

- O MeuCatálogo
- Última milha
- Interprovincial
- Armazém
- Outros

## 🚀 Quick Start

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Base de Dados (Supabase)

Veja o guia completo em **[DEPLOY.md](./DEPLOY.md)**

Resumo rápido:
1. Crie um projeto em [supabase.com](https://supabase.com)
2. Execute o schema SQL em `supabase/schema.sql`
3. Copie as credenciais para `.env.local`

### 3. Executar localmente

```bash
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173)

### 4. Deploy para produção

Veja **[DEPLOY.md](./DEPLOY.md)** para instruções completas de deploy no Vercel ou Netlify.

## 📁 Estrutura do Projeto

```
zygo-crm/
├── src/
│   ├── components/       # Componentes React
│   │   ├── Sidebar.tsx
│   │   ├── Dashboard.tsx
│   │   ├── LeadForm.tsx
│   │   ├── LeadList.tsx
│   │   ├── LeadDetail.tsx
│   │   ├── Pipeline.tsx
│   │   └── Automations.tsx
│   ├── context/          # React Context
│   │   └── CRMContext.tsx
│   ├── services/         # Serviços de API
│   │   └── leadsService.ts
│   ├── lib/              # Configurações
│   │   └── supabase.ts
│   ├── types.ts          # Tipos TypeScript
│   ├── data.ts           # Dados iniciais
│   └── App.tsx           # Componente principal
├── supabase/
│   └── schema.sql        # Schema da base de dados
├── .env.example          # Template de variáveis de ambiente
├── DEPLOY.md             # Guia de deploy completo
└── README.md             # Este ficheiro
```

## 🗄️ Base de Dados

### Tabelas

- **leads** - Dados principais dos leads
- **lead_notes** - Notas associadas a cada lead
- **lead_history** - Histórico de atividades
- **automation_logs** - Logs de automações executadas
- **users** - Usuários do sistema (futuro)

### Automações

1. **Regra 1**: Email de boas-vindas + notificação ao Content Specialist (5 min após criação)
2. **Regra 2**: Alerta SLA se lead em "Novo Lead" há mais de 24h (notifica CMO)
3. **Regra 3**: Handover para Operações + email de boas-vindas do Cliente (ao ganhar)

## 🔐 Segurança

- Row Level Security (RLS) ativado em todas as tabelas
- Variáveis de ambiente para credenciais
- `.env.local` ignorado pelo Git

## 🎨 Design System

### Cores

- **Primary**: `#063C20` (verde escuro)
- **Accent**: `#C0D637` (lima)
- **Background**: `#FAFAF7` (off-white)

### Tipografia

- **Display**: Space Grotesk
- **Body**: Inter

## 📦 Tecnologias

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Build**: Vite
- **Deploy**: Vercel / Netlify

## 🤝 Contribuir

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit as mudanças (`git commit -m 'Add nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é proprietário. Todos os direitos reservados.

## 📞 Suporte

Para questões técnicas ou suporte, consulte:
- [DEPLOY.md](./DEPLOY.md) - Guia de deploy e troubleshooting
- [Supabase Docs](https://supabase.com/docs)
- [Vite Docs](https://vitejs.dev)

---

**Desenvolvido com ❤️ para ZYGO**
