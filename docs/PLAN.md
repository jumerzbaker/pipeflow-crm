# PipeFlow CRM — Plano de Execução

Roadmap de 15 milestones dividido em 4 fases: **Fundação → Interface → Backend → Deploy**.

A abordagem é **UI-first**: construir todas as telas com mock data antes de conectar a infraestrutura de dados. Isso permite validar a experiência visual rapidamente e iterar no design sem depender da camada de backend.

---

## Fases

| Fase | Milestones | Foco |
|---|---|---|
| 1 — Fundação | M1 | Scaffold do projeto |
| 2 — Interface | M2 – M8 | Telas completas com mock data |
| 3 — Backend | M9 – M14 | Conectar Supabase, Stripe, Resend |
| 4 — Deploy | M15 | Produção Vercel + Supabase |

---

## FASE 1 — FUNDAÇÃO

### M1 — Scaffold
**Branch:** `feat/scaffold`
**Objetivo:** Inicializar o projeto com toda a toolchain configurada e pronta para desenvolvimento.

#### Entregas
- [x] `npx create-next-app@latest` com TypeScript, App Router e Tailwind CSS
- [x] Instalar e inicializar shadcn/ui (`npx shadcn@latest init`)
- [x] Criar estrutura de pastas: `app/`, `components/ui/`, `lib/`, `types/`, `supabase/migrations/`, `supabase/functions/`, `docs/`
- [x] Configurar ESLint + Prettier (`.eslintrc.json`, `.prettierrc`)
- [x] Configurar `tsconfig.json` com path alias `@/` apontando para a raiz
- [x] Criar `.env.local.example` com todas as variáveis necessárias documentadas
- [x] Confirmar `npm run dev` roda em `localhost:3000` sem erros

**Commit final:** `feat: scaffold Next.js 14 + Tailwind + shadcn/ui`

---

## FASE 2 — INTERFACE

> Todas as telas usam mock data local. Nenhuma chamada real ao banco de dados.

### M2 — Design System & Shell
**Branch:** `feat/design-system`
**Objetivo:** Estabelecer a identidade visual e o layout base do app autenticado.

#### Entregas
- [x] Tokens de cor no `globals.css` via CSS variables (brand, cinzas, estados)
- [x] Sidebar fixa `components/shared/Sidebar.tsx` — logo, nav items com ícones, rodapé com avatar do usuário
- [x] Workspace switcher dropdown na sidebar (estático, lista hardcoded)
- [x] Layout autenticado `app/(app)/layout.tsx` — sidebar + área de conteúdo
- [x] Topbar com breadcrumb e avatar do usuário
- [x] Componente reutilizável `PageHeader` (título + subtítulo + botão de ação primária)
- [x] Dark sidebar (`bg-gray-900`) + content area (`bg-gray-950`)
- [x] Responsividade básica implementada (sidebar recolhível em telas menores com backdrop)

**Commit final:** `feat: design system, shell layout e sidebar`

---

### M3 — Auth UI
**Branch:** `feat/auth-ui`
**Objetivo:** Criar as telas de autenticação com validação de formulários, prontas para conectar ao Supabase.

#### Entregas
- [x] Layout centrado `app/(auth)/layout.tsx` — logo centralizado, fundo neutro
- [x] Página de login `app/(auth)/login/page.tsx` — form email + senha + link "Esqueci a senha"
- [x] Página de cadastro `app/(auth)/signup/page.tsx` — form nome + email + senha
- [x] Página de recuperação `app/(auth)/forgot-password/page.tsx` — form email
- [x] Validação com `useActionState` + `zod` (campos obrigatórios, formato de e-mail)
- [x] Feedback visual de erro por campo (`FieldError` component)
- [x] Estado de loading no botão de submit
- [x] Redirect placeholder: login redireciona para `/dashboard` (hardcoded)

**Commit final:** `feat: páginas de auth UI (login, signup, forgot-password)`

---

### M4 — Leads UI
**Branch:** `feat/leads-ui`
**Objetivo:** Telas completas de gestão de leads com listagem, filtros, detalhe e criação.

#### Entregas
- [x] Mock data: array de 12 leads com todos os campos (nome, e-mail, telefone, empresa, cargo, status, responsável, data)
- [x] Listagem `app/(app)/leads/page.tsx` — tabela com colunas: nome, empresa, status, responsável, data de criação
- [x] Componente `LeadsFilters` — busca por texto + filtro de status + filtro de responsável
- [x] Badge de status com cores distintas (Novo, Contatado, Proposta, Negociação, Ganho, Perdido)
- [x] Paginação estática (controles de prev/next)
- [x] Botão "Novo Lead" abre `LeadSheet` (shadcn/ui Sheet lateral)
- [x] `LeadSheet` — form com campos: nome, e-mail, telefone, empresa, cargo, status, responsável
- [x] Página de detalhe `app/(app)/leads/[id]/page.tsx` — perfil completo do lead + timeline de atividades

**Commit final:** `feat: leads UI — listagem, filtros, detalhe e drawer de criação`

---

### M5 — Pipeline Kanban UI
**Branch:** `feat/pipeline-ui`
**Objetivo:** Board Kanban com drag-and-drop funcional entre colunas (estado local, sem persistência).

#### Entregas
- [x] Mock data: 15 negócios distribuídos nas 6 colunas
- [x] Board `app/(app)/pipeline/page.tsx` com scroll horizontal
- [x] 6 colunas fixas: Novo Lead / Contato Realizado / Proposta Enviada / Negociação / Fechado Ganho / Fechado Perdido
- [x] Contador de cards e soma de valor por coluna no header
- [x] Cards de negócio: título, valor (R$), lead vinculado, avatar do responsável, prazo
- [x] Coluna "Fechado Ganho" com destaque verde; "Fechado Perdido" com destaque vermelho/cinza
- [x] Drag-and-drop entre colunas com `@dnd-kit/core` + `@dnd-kit/sortable` (estado local com `useState`)
- [x] Botão "+ Novo negócio" por coluna abre sheet de criação (estático)

**Commit final:** `feat: pipeline Kanban UI com dnd-kit e mock data`

---

### M6 — Atividades & Timeline UI
**Branch:** `feat/activities-ui`
**Objetivo:** Componente de timeline de atividades integrado à página de detalhe do lead.

#### Entregas
- [x] Mock data: 5 atividades cronológicas por lead (tipos variados)
- [x] Componente `ActivityTimeline` com linha do tempo vertical
- [x] 4 tipos de atividade com ícones distintos: Ligação / E-mail / Reunião / Nota
- [x] Cada item: ícone + tipo + autor + data + descrição
- [x] Form inline "Registrar atividade" — select de tipo, textarea de descrição, date picker
- [x] Botão de submit com estado de loading
- [x] Integrar `ActivityTimeline` na página de detalhe do lead (M4)

**Commit final:** `feat: timeline de atividades UI por lead`

---

### M7 — Dashboard UI
**Branch:** `feat/dashboard-ui`
**Objetivo:** Dashboard de métricas com cards, gráfico de funil e lista de negócios urgentes.

#### Entregas
- [x] Mock data: métricas e série temporal do funil
- [x] Página `app/(app)/dashboard/page.tsx`
- [x] 4 cards de métricas com ícone, valor e variação: Total de Leads / Negócios Abertos / Valor do Pipeline / Taxa de Conversão
- [x] Skeleton de loading (shadcn/ui `Skeleton`) nos cards para uso futuro
- [x] Gráfico de funil de vendas com `recharts` (BarChart horizontal, dados por etapa)
- [x] Lista "Negócios com prazo próximo" — 5 itens com badge de urgência (hoje / esta semana / atrasado)
- [x] Página define `/dashboard` como rota padrão pós-login

**Commit final:** `feat: dashboard UI com métricas, funil Recharts e prazo`

---

### M8 — Settings & Landing UI
**Branch:** `feat/settings-landing-ui`
**Objetivo:** Tela de configurações do workspace e landing page pública de apresentação.

#### Entregas

**Settings (`app/(app)/settings/page.tsx`):**
- [x] Layout com 3 abas: Workspace / Membros / Billing
- [x] Aba Workspace: form nome do workspace + upload de logo (UI estática)
- [x] Aba Membros: tabela de membros (nome, e-mail, papel, data de entrada) + botão "Convidar membro" (modal estático)
- [x] Aba Billing: card do plano atual + comparativo Free vs Pro + botão "Fazer upgrade" (estático)

**Landing page (`app/(landing)/page.tsx`):**
- [x] Seção Hero: headline impactante, subtítulo, CTA "Começar grátis" + CTA secundário "Ver demo"
- [x] Seção Funcionalidades: 3 blocos com ícone (Pipeline visual / Gestão de leads / Dashboard de métricas)
- [x] Seção Planos: cards Free e Pro com lista de features e preço (R$49/mês)
- [x] Footer: logo, links (funcionalidades, preços, contato) + copyright
- [x] Rota `/` aponta para a landing page; app em `/login`

**Commit final:** `feat: settings UI, billing placeholder e landing page`

---

## FASE 3 — BACKEND

> Conectar as telas às fontes de dados reais, um grupo de funcionalidades por milestone.

### M9 — Supabase Setup & Auth Real
**Branch:** `feat/supabase-auth`
**Objetivo:** Autenticação real funcionando end-to-end com Supabase Auth e proteção de rotas via middleware.

#### Entregas
- [x] Criar projeto Supabase e obter `SUPABASE_URL` + `ANON_KEY`
- [x] Instalar `@supabase/ssr` e `@supabase/supabase-js`
- [x] `lib/supabase/server.ts` — `createServerClient` para Server Components e Route Handlers
- [x] `lib/supabase/client.ts` — `createBrowserClient` para Client Components
- [x] `proxy.ts` — intercepta todas as rotas, protege `(app)/`, redireciona para `/login` se sem sessão (Next.js 16: `middleware.ts` → `proxy.ts`)
- [x] Login, signup e logout conectados ao Supabase Auth (remover mock)
- [x] Route Handler `app/api/auth/callback/route.ts` para fluxo de magic link futuro
- [x] Variáveis `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Commit final:** `feat: Supabase Auth real, middleware de sessão e rotas protegidas`

---

### M10 — Multi-tenant Schema + RLS
**Branch:** `feat/multi-tenant`
**Objetivo:** Estrutura de dados multi-empresa com isolamento total via RLS e workspace switcher funcional.

#### Entregas
- [x] Migration `001_workspaces.sql`: tabela `workspaces` (id, name, slug, plan, stripe_customer_id, created_at)
- [x] Migration `002_workspace_members.sql`: tabela `workspace_members` (workspace_id, user_id, role, invited_at, joined_at)
- [x] RLS policies: membros só leem/escrevem no próprio workspace
- [x] Onboarding pós-cadastro: se usuário não tem workspace, redirecionar para `/onboarding` e criar o primeiro
- [x] Workspace switcher conectado ao banco (busca workspaces reais do usuário autenticado)
- [x] Context/hook `useWorkspace` para propagar `workspace_id` ativo pelo app
- [x] `supabase gen types typescript > types/database.ts`

**Commit final:** `feat: schema multi-tenant, RLS e workspace switcher funcional`

---

### M11 — Leads + Pipeline Backend
**Branch:** `feat/leads-pipeline-backend`
**Objetivo:** CRUD de leads e deals persistido no banco com RLS, buscas e drag-and-drop durável.

#### Entregas
- [ ] Migration `003_leads.sql`: tabela `leads` (id, workspace_id, name, email, phone, company, role, status, owner_id, created_at)
- [ ] Migration `004_deals.sql`: tabela `deals` (id, workspace_id, lead_id, title, value, stage, owner_id, due_date, position, created_at)
- [ ] RLS em `leads` e `deals` por `workspace_id`
- [ ] Server Actions ou Route Handlers: criar, listar, atualizar, excluir leads
- [ ] Busca e filtros de leads conectados ao banco (query params → Supabase query)
- [ ] CRUD de deals
- [ ] Persistência do drag-and-drop: ao mover card, `PATCH /api/deals/:id` atualiza `stage` + `position`
- [ ] Atualizar `types/database.ts` com novos tipos
- [ ] Substituir mock data de leads e pipeline por dados reais

**Commit final:** `feat: leads e pipeline conectados ao Supabase com CRUD e dnd persistido`

---

### M12 — Atividades + Dashboard Backend
**Branch:** `feat/activities-dashboard-backend`
**Objetivo:** Timeline de atividades persistida e dashboard com métricas agregadas reais.

#### Entregas
- [ ] Migration `005_activities.sql`: tabela `activities` (id, workspace_id, lead_id, type, description, author_id, occurred_at, created_at)
- [ ] RLS em `activities` por `workspace_id`
- [ ] Timeline conectada ao banco por lead (substituir mock)
- [ ] Server Action para criar nova atividade
- [ ] Dashboard: query `COUNT(leads)`, `SUM(deals.value)`, `COUNT(deals WHERE stage = 'fechado_ganho') / COUNT(deals)` por workspace
- [ ] Gráfico de funil: query `COUNT(deals) GROUP BY stage` em ordem de etapa
- [ ] Lista de negócios com prazo próximo: `deals WHERE due_date <= NOW() + 7 days ORDER BY due_date`
- [ ] Atualizar `types/database.ts`

**Commit final:** `feat: atividades e dashboard backend com dados reais do Supabase`

---

### M13 — Convites de Colaboradores
**Branch:** `feat/invites`
**Objetivo:** Fluxo completo de convite por e-mail com controle de limite do plano Free.

#### Entregas
- [ ] Migration `006_invites.sql`: tabela `workspace_invites` (id, workspace_id, email, token, role, expires_at, accepted_at)
- [ ] Instalar e configurar Resend (`RESEND_API_KEY`)
- [ ] `lib/resend/index.ts` — helper para envio de e-mails
- [ ] Supabase Edge Function `invite-member`: valida limite Free (max 2 membros), cria invite, envia e-mail via Resend com link `/invite/[token]`
- [ ] Página de aceite `app/invite/[token]/page.tsx` — exibe info do workspace, botão "Aceitar convite"
- [ ] Ao aceitar: cria registro em `workspace_members`, marca `accepted_at` no invite
- [ ] Enforcement no modal de convite: desabilitar botão + tooltip explicativo se plano Free com 2 membros

**Commit final:** `feat: convite de colaboradores por e-mail com Resend e Edge Function`

---

### M14 — Stripe Billing
**Branch:** `feat/billing`
**Objetivo:** Monetização completa com checkout, webhook e customer portal, aplicando limites do plano Free.

#### Entregas
- [ ] Instalar Stripe SDK, criar `lib/stripe/index.ts`
- [ ] Route Handler `app/api/checkout/route.ts` — cria `checkout.session` com `price_id` do Pro, salva `stripe_customer_id` no workspace
- [ ] Supabase Edge Function `stripe-webhook`:
  - `checkout.session.completed` → atualiza `plan = 'pro'` e `stripe_subscription_id`
  - `customer.subscription.deleted` → atualiza `plan = 'free'`
- [ ] Route Handler `app/api/billing/portal/route.ts` — cria sessão do Customer Portal
- [ ] Botão "Fazer upgrade" na aba Billing conectado ao checkout real
- [ ] Botão "Gerenciar assinatura" conectado ao Customer Portal
- [ ] Middleware verifica limites Free: bloquear criação de lead (>50) ou convite (>2 membros) com toast de upgrade
- [ ] Variáveis: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_PRO`

**Commit final:** `feat: Stripe billing — checkout, webhook, customer portal e limites Free`

---

## FASE 4 — DEPLOY

### M15 — Deploy Produção
**Branch:** `feat/deploy`
**Objetivo:** Aplicação em produção, acessível publicamente, com todos os serviços conectados.

#### Entregas
- [ ] Criar repositório GitHub (`pipeflow-crm`) e push da branch `main`
- [ ] Deploy no Vercel: conectar repositório, definir variáveis de ambiente de produção
- [ ] Supabase: aplicar todas as migrations no projeto de produção (`supabase db push`)
- [ ] Deploy das Edge Functions no Supabase produção (`supabase functions deploy`)
- [ ] Configurar webhook Stripe com a URL de produção do Vercel
- [ ] Configurar domínio customizado no Vercel (se aplicável)
- [ ] Smoke test do fluxo completo: cadastro → criar workspace → adicionar lead → mover no pipeline → ativar Pro
- [ ] Verificar que RLS impede vazamento de dados entre workspaces diferentes

**Commit final:** `feat: deploy produção Vercel + Supabase configurado`

---

## Status

| # | Milestone | Branch | Status |
|---|---|---|---|
| M1 | Scaffold | `feat/scaffold` | ✅ Concluído |
| M2 | Design System & Shell | `feat/design-system` | ✅ Concluído |
| M3 | Auth UI | `feat/auth-ui` | ✅ Concluído |
| M4 | Leads UI | `feat/leads-ui` | ✅ Concluído |
| M5 | Pipeline Kanban UI | `feat/pipeline-ui` | ✅ Concluído |
| M6 | Atividades & Timeline UI | `feat/activities-ui` | ✅ Concluído |
| M7 | Dashboard UI | `feat/dashboard-ui` | ✅ Concluído |
| M8 | Settings & Landing UI | `feat/settings-landing-ui` | ✅ Concluído |
| M9 | Supabase Auth Real | `feat/supabase-auth` | ✅ Concluído |
| M10 | Multi-tenant + RLS | `feat/multi-tenant` | ✅ Concluído |
| M11 | Leads + Pipeline Backend | `feat/leads-pipeline-backend` | ⬜ Pendente |
| M12 | Atividades + Dashboard Backend | `feat/activities-dashboard-backend` | ⬜ Pendente |
| M13 | Convites | `feat/invites` | ⬜ Pendente |
| M14 | Stripe Billing | `feat/billing` | ⬜ Pendente |
| M15 | Deploy Produção | `feat/deploy` | ⬜ Pendente |
