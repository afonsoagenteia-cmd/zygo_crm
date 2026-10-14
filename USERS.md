# 👥 Sistema de Utilizadores - ZYGO CRM

## 🎯 Visão Geral

O ZYGO CRM agora inclui um sistema completo de gestão de utilizadores com autenticação, perfis e controlo de acesso.

## ✨ Funcionalidades Implementadas

### 1. **Autenticação Completa**
- ✅ Login com email e password
- ✅ Registo de novos utilizadores
- ✅ Recuperação de password
- ✅ Sessão persistente (lembrar login)
- ✅ Logout seguro

### 2. **Gestão de Utilizadores**
- ✅ Lista de todos os utilizadores
- ✅ Criar novos utilizadores
- ✅ Editar perfis (nome, função)
- ✅ Remover utilizadores
- ✅ Visualização de perfis detalhados

### 3. **Funções (Roles)**
- 👑 **CMO** - Chief Marketing Officer (acesso total)
- ✍️ **Content Specialist** - Especialista em conteúdo
- 🤝 **Customer Success** - Sucesso do cliente

### 4. **Perfil de Utilizador**
- ✅ Visualização do perfil
- ✅ Edição de informações pessoais
- ✅ Alteração de password
- ✅ Logout

## 🔐 Como Funciona

### Modo Demo (Sem Supabase)
Quando o Supabase não está configurado, o sistema funciona em **modo demo**:
- Utilizador automático: `demo@zygo.pt` (CMO)
- Dados locais (não persistem)
- Todas as funcionalidades disponíveis
- Banner amarelo indica modo demo

### Modo Produção (Com Supabase)
Com o Supabase configurado:
- Autenticação real via Supabase Auth
- Dados persistidos em PostgreSQL
- Segurança com Row Level Security (RLS)
- Múltiplos utilizadores simultâneos

## 🚀 Configurar Autenticação

### Passo 1: Habilitar Auth no Supabase

1. Acesse o dashboard do Supabase
2. Vá em **Authentication** → **Providers**
3. Ative **Email** provider
4. Configure:
   - Confirm email: **ON** (recomendado)
   - Site URL: `http://localhost:5173` (dev) ou sua URL de produção

### Passo 2: Executar SQL para Policies

No **SQL Editor** do Supabase, execute:

```sql
-- Permitir que utilizadores autenticados vejam outros utilizadores
CREATE POLICY "Authenticated users can view all users"
ON users FOR SELECT
TO authenticated
USING (true);

-- Permitir que utilizadores criem os seus próprios perfis
CREATE POLICY "Users can insert their own profile"
ON users FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Permitir que utilizadores atualizem os seus próprios perfis
CREATE POLICY "Users can update their own profile"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- CMO pode gerir todos os utilizadores
CREATE POLICY "CMO can manage all users"
ON users FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'CMO'
  )
);
```

### Passo 3: Criar Primeiro Utilizador

**Opção A: Via Interface**
1. Abra a aplicação
2. Clique em **"Criar conta"**
3. Preencha os dados
4. Escolha a função (recomendado: CMO para o primeiro)
5. Confirme o email (se ativado)

**Opção B: Via Supabase Dashboard**
1. Vá em **Authentication** → **Users**
2. Clique em **"Add user"** → **"Create new user"**
3. Preencha email e password
4. Vá em **Table Editor** → **users**
5. Crie o perfil manualmente com o user ID

### Passo 4: Criar Utilizadores Adicionais

Depois de ter o primeiro utilizador (CMO):
1. Faça login como CMO
2. Vá em **Utilizadores** no menu
3. Clique em **"Novo Utilizador"**
4. Preencha os dados e escolha a função
5. O utilizador receberá um email de confirmação

## 📋 Fluxo de Utilização

### Para Administradores (CMO)
1. **Login** → Dashboard
2. **Gestão de Utilizadores** → Criar/Editar/Remover
3. **Gestão de Leads** → Atribuir a utilizadores específicos
4. **Perfil** → Ver/editar informações

### Para Utilizadores Normais
1. **Login** → Dashboard
2. **Leads** → Ver leads atribuídos
3. **Pipeline** → Mover leads entre etapas
4. **Perfil** → Editar informações pessoais

## 🎨 Interface

### Página de Login
- Design minimalista com identidade ZYGO
- Toggle entre Login / Registo / Recuperação
- Validação de campos
- Feedback visual de erros/sucesso
- Modo demo notice

### Página de Utilizadores
- Grid de cards com avatares e ícones
- Badges coloridos por função
- Ações rápidas (editar/remover)
- Modal de criação/edição
- Indicador "Você" no próprio perfil

### Página de Perfil
- Banner com gradiente
- Avatar grande com ícone de função
- Informações detalhadas
- Ações rápidas (editar, password, logout)

## 🔒 Segurança

### Autenticação
- Passwords encriptadas (bcrypt via Supabase)
- Tokens JWT com expiry
- Refresh tokens automáticos
- Proteção contra brute force

### Autorização
- Row Level Security (RLS) em todas as tabelas
- Utilizadores só veem dados permitidos
- CMO tem acesso total
- Logs de auditoria (futuro)

### Boas Práticas
- ✅ Password mínima de 6 caracteres
- ✅ Confirmação de email (opcional)
- ✅ Sessão expira após inatividade
- ✅ Logout invalida tokens
- ✅ HTTPS obrigatório em produção

## 📊 Dados de Exemplo

Em modo demo, o sistema cria automaticamente:

```javascript
[
  {
    id: '1',
    email: 'cmo@zygo.pt',
    full_name: 'Maria Silva',
    role: 'CMO',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    email: 'content@zygo.pt',
    full_name: 'João Santos',
    role: 'Content Specialist',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    email: 'success@zygo.pt',
    full_name: 'Ana Costa',
    role: 'Customer Success',
    created_at: new Date().toISOString()
  }
]
```

## 🛠️ API de Autenticação

### authService.ts

```typescript
// Registar novo utilizador
await authService.signUp(email, password, fullName, role);

// Login
await authService.signIn(email, password);

// Logout
await authService.signOut();

// Obter utilizador atual
const user = await authService.getCurrentUser();

// Atualizar perfil
await authService.updateProfile(userId, { full_name, role });

// Recuperar password
await authService.resetPassword(email);

// Ouvir mudanças de autenticação
authService.onAuthStateChange((event, session) => {
  console.log(event, session);
});
```

### useAuth Hook

```typescript
const {
  user,           // Utilizador atual
  loading,        // A carregar
  signIn,         // Login
  signUp,         // Registo
  signOut,        // Logout
  updateProfile,  // Atualizar perfil
  resetPassword,  // Recuperar password
} = useAuth();
```

## 🎯 Próximas Melhorias

### Fase 1 (Concluído)
- ✅ Autenticação básica
- ✅ Gestão de utilizadores
- ✅ Perfis
- ✅ Roles

### Fase 2 (Futuro)
- [ ] Autenticação social (Google, GitHub)
- [ ] 2FA (Two-Factor Authentication)
- [ ] Avatares personalizados (upload)
- [ ] Notificações por email
- [ ] Logs de auditoria
- [ ] Permissões granulares por lead

### Fase 3 (Avançado)
- [ ] Equipas e departamentos
- [ ] Hierarquia de utilizadores
- [ ] Atribuição automática de leads
- [ ] Dashboard por utilizador
- [ ] Relatórios de performance
- [ ] Integração com Slack/Teams

## 📞 Suporte

Para questões sobre autenticação:
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Sistema de utilizadores 100% funcional e pronto para produção!** 🎉
