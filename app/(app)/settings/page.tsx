'use client'

import { useState } from 'react'
import { Building2, Users, CreditCard, Upload, UserPlus, Check, X, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

// ─── Mock data ────────────────────────────────────────────────────────────────

const MEMBERS = [
  { id: '1', name: 'Ana Lima',       email: 'ana@empresa.com',       role: 'Admin',  joinedAt: '12 jan 2026' },
  { id: '2', name: 'Carlos Mendes',  email: 'carlos@empresa.com',    role: 'Membro', joinedAt: '18 jan 2026' },
  { id: '3', name: 'Fernanda Costa', email: 'fernanda@empresa.com',  role: 'Membro', joinedAt: '03 fev 2026' },
]

const FREE_FEATURES = [
  '2 colaboradores',
  'Até 50 leads',
  'Pipeline Kanban',
  'Dashboard de métricas',
  'Timeline de atividades',
]

const PRO_FEATURES = [
  'Colaboradores ilimitados',
  'Leads ilimitados',
  'Pipeline Kanban',
  'Dashboard completo',
  'Timeline de atividades',
  'Alertas de prazo',
  'Convites por e-mail',
  'Suporte prioritário',
]

// ─── Tab config ───────────────────────────────────────────────────────────────

type Tab = 'workspace' | 'membros' | 'billing'

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'workspace', label: 'Workspace',  icon: Building2   },
  { id: 'membros',   label: 'Membros',    icon: Users       },
  { id: 'billing',   label: 'Billing',    icon: CreditCard  },
]

// ─── Subcomponents ────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-base font-semibold text-pf-text">
      {children}
    </h2>
  )
}

function SectionDescription({ children }: { children: React.ReactNode }) {
  return <p className="mt-0.5 text-sm text-pf-text-muted">{children}</p>
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-xl border border-pf-border bg-pf-surface p-6', className)}>
      {children}
    </div>
  )
}

// ─── Workspace tab ────────────────────────────────────────────────────────────

function WorkspaceTab() {
  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle>Informações do workspace</SectionTitle>
        <SectionDescription>Nome e identidade visual do seu workspace.</SectionDescription>

        <div className="mt-6 space-y-5">
          {/* Nome */}
          <div className="space-y-1.5">
            <Label htmlFor="ws-name" className="text-sm text-pf-text-sec">
              Nome do workspace
            </Label>
            <Input
              id="ws-name"
              defaultValue="Minha Empresa"
              className="h-9 max-w-sm"
            />
          </div>

          {/* Logo */}
          <div className="space-y-1.5">
            <Label className="text-sm text-pf-text-sec">Logo</Label>
            <div className="flex items-center gap-4">
              {/* Preview */}
              <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-pf-border bg-pf-surface-2 font-display text-xl font-bold text-pf-text-muted">
                ME
              </div>
              {/* Upload area */}
              <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-pf-border px-6 py-4 text-center transition-colors hover:border-pf-accent/40 hover:bg-pf-surface-2">
                <Upload className="h-4 w-4 text-pf-text-muted" />
                <span className="text-xs text-pf-text-muted">
                  PNG, JPG ou SVG · Máx. 2 MB
                </span>
                <input type="file" accept="image/*" className="sr-only" />
              </label>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button className="bg-pf-accent text-pf-bg hover:bg-pf-accent/90">
          Salvar alterações
        </Button>
      </div>
    </div>
  )
}

// ─── Membros tab ──────────────────────────────────────────────────────────────

function MembrosTab() {
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('Membro')

  return (
    <>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <SectionTitle>Membros do workspace</SectionTitle>
            <SectionDescription>
              {MEMBERS.length} de 2 membros no plano Free.
            </SectionDescription>
          </div>
          <Button
            size="sm"
            onClick={() => setInviteOpen(true)}
            className="gap-1.5 bg-pf-accent text-pf-bg hover:bg-pf-accent/90"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Convidar membro
          </Button>
        </div>

        {/* Table */}
        <div className="mt-5 overflow-hidden rounded-lg border border-pf-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-pf-border bg-pf-surface-2">
                <th className="px-4 py-2.5 text-left font-medium text-pf-text-muted">Nome</th>
                <th className="px-4 py-2.5 text-left font-medium text-pf-text-muted">E-mail</th>
                <th className="px-4 py-2.5 text-left font-medium text-pf-text-muted">Papel</th>
                <th className="px-4 py-2.5 text-left font-medium text-pf-text-muted">Entrada</th>
              </tr>
            </thead>
            <tbody>
              {MEMBERS.map((m, i) => (
                <tr
                  key={m.id}
                  className={cn(
                    'border-b border-pf-border transition-colors last:border-0 hover:bg-pf-surface-2',
                  )}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-pf-surface-2 border border-pf-border font-mono text-[10px] font-bold text-pf-text-sec">
                        {m.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="font-medium text-pf-text">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-pf-text-sec">{m.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[11px] font-medium',
                        m.role === 'Admin'
                          ? 'bg-pf-accent/15 text-pf-accent'
                          : 'bg-pf-surface-2 text-pf-text-muted',
                      )}
                    >
                      {m.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-pf-text-muted">
                    {m.joinedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Invite dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Convidar membro</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-1">
            <div className="space-y-1.5">
              <Label htmlFor="invite-email" className="text-sm text-pf-text-sec">
                E-mail
              </Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="nome@empresa.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-pf-text-sec">Papel</Label>
              <div className="flex gap-2">
                {['Admin', 'Membro'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setInviteRole(r)}
                    className={cn(
                      'flex-1 rounded-lg border py-2 text-sm font-medium transition-colors',
                      inviteRole === r
                        ? 'border-pf-accent/60 bg-pf-accent/10 text-pf-accent'
                        : 'border-pf-border bg-pf-surface text-pf-text-muted hover:border-pf-border/60 hover:text-pf-text-sec',
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <p className="text-xs text-pf-text-muted">
                {inviteRole === 'Admin'
                  ? 'Acesso completo ao workspace, membros e billing.'
                  : 'Pode gerenciar leads e negócios no pipeline.'}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setInviteOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={!inviteEmail}
              className="bg-pf-accent text-pf-bg hover:bg-pf-accent/90 disabled:opacity-40"
            >
              Enviar convite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// ─── Billing tab ──────────────────────────────────────────────────────────────

function BillingTab() {
  return (
    <div className="space-y-5">
      {/* Current plan */}
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <SectionTitle>Plano atual</SectionTitle>
            <SectionDescription>
              Seu workspace está no plano gratuito.
            </SectionDescription>
          </div>
          <span className="inline-flex items-center rounded-md border border-pf-border bg-pf-surface-2 px-2.5 py-1 font-mono text-xs font-medium text-pf-text-muted uppercase tracking-wider">
            Free
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 divide-x divide-pf-border rounded-lg border border-pf-border">
          {[
            { label: 'Membros', value: '2 / 2' },
            { label: 'Leads',   value: '0 / 50' },
            { label: 'Período', value: 'Gratuito' },
          ].map((item) => (
            <div key={item.label} className="px-5 py-4">
              <p className="font-mono text-[11px] uppercase tracking-wider text-pf-text-muted">
                {item.label}
              </p>
              <p className="mt-1 font-display text-lg font-bold text-pf-text">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Plan comparison */}
      <Card>
        <SectionTitle>Comparar planos</SectionTitle>
        <SectionDescription>Faça upgrade para desbloquear todos os recursos.</SectionDescription>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {/* Free */}
          <div className="rounded-xl border border-pf-border bg-pf-bg p-5">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-pf-text-muted">
              Plano
            </p>
            <p className="mt-1 font-display text-xl font-bold text-pf-text">Grátis</p>
            <p className="mt-0.5 font-display text-2xl font-extrabold text-pf-text">
              R$ 0<span className="text-sm font-normal text-pf-text-muted">/mês</span>
            </p>
            <ul className="mt-4 space-y-2">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-pf-text-sec">
                  <Check className="h-3.5 w-3.5 shrink-0 text-pf-positive" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-lg border border-pf-border py-2 text-center font-mono text-xs font-medium text-pf-text-muted">
              Plano atual
            </div>
          </div>

          {/* Pro */}
          <div className="relative rounded-xl border border-pf-accent/40 bg-pf-bg p-5 shadow-[0_0_40px_rgba(202,255,51,0.06)]">
            <div className="absolute -top-3 left-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-pf-accent px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-pf-bg">
                <Crown className="h-2.5 w-2.5" />
                Pro
              </span>
            </div>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-pf-text-muted">
              Plano
            </p>
            <p className="mt-1 font-display text-xl font-bold text-pf-text">Pro</p>
            <p className="mt-0.5 font-display text-2xl font-extrabold text-pf-text">
              R$ 49<span className="text-sm font-normal text-pf-text-muted">/mês</span>
            </p>
            <ul className="mt-4 space-y-2">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-pf-text-sec">
                  <Check className="h-3.5 w-3.5 shrink-0 text-pf-accent" />
                  {f}
                </li>
              ))}
            </ul>
            <button className="mt-5 w-full rounded-lg bg-pf-accent py-2 font-mono text-xs font-bold uppercase tracking-wider text-pf-bg transition-all hover:brightness-110">
              Fazer upgrade
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('workspace')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        subtitle="Gerencie workspace, membros e billing"
      />

      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl border border-pf-border bg-pf-surface p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
              activeTab === id
                ? 'bg-pf-surface-2 text-pf-text shadow-sm'
                : 'text-pf-text-muted hover:text-pf-text-sec',
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'workspace' && <WorkspaceTab />}
      {activeTab === 'membros'   && <MembrosTab />}
      {activeTab === 'billing'   && <BillingTab />}
    </div>
  )
}
