'use client'

import { useState, useTransition, useOptimistic, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Building2, Users, CreditCard, Upload, UserPlus, Crown,
  Check, Clock, X, ShieldCheck, UserCheck, Loader2, UserCircle,
  Mail, KeyRound, AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  sendInvite,
  revokeInvite,
  removeMember,
  getWorkspaceMembersWithDetails,
  getPendingInvites,
  type WorkspaceMember,
  type PendingInvite,
} from '@/app/actions/invites'
import {
  updateProfile,
  updateEmail,
  updatePassword,
  type ProfileActionResult,
} from '@/app/actions/auth'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

// ─── Constants ────────────────────────────────────────────────────────────────

const FREE_MEMBER_LIMIT = 2

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

type Tab = 'workspace' | 'membros' | 'billing' | 'conta'

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'workspace', label: 'Workspace', icon: Building2   },
  { id: 'membros',   label: 'Membros',   icon: Users       },
  { id: 'billing',   label: 'Billing',   icon: CreditCard  },
  { id: 'conta',     label: 'Conta',     icon: UserCircle  },
]

// ─── Shared UI ────────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-base font-semibold text-pf-text">{children}</h2>
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

function Toast({ message, type }: { message: string; type: 'error' | 'success' }) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm',
        type === 'error'
          ? 'border-red-500/30 bg-red-500/10 text-red-400'
          : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
      )}
    >
      {type === 'error' ? <X className="h-4 w-4 shrink-0" /> : <Check className="h-4 w-4 shrink-0" />}
      {message}
    </div>
  )
}

// ─── Workspace tab ────────────────────────────────────────────────────────────

function WorkspaceTab() {
  const { activeWorkspace } = useWorkspace()

  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle>Informações do workspace</SectionTitle>
        <SectionDescription>Nome e identidade visual do seu workspace.</SectionDescription>

        <div className="mt-6 space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="ws-name" className="text-sm text-pf-text-sec">
              Nome do workspace
            </Label>
            <Input
              id="ws-name"
              defaultValue={activeWorkspace?.name ?? ''}
              className="h-9 max-w-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-pf-text-sec">Logo</Label>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-pf-border bg-pf-surface-2 font-display text-xl font-bold text-pf-text-muted">
                {activeWorkspace?.name?.slice(0, 2).toUpperCase() ?? 'WS'}
              </div>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-pf-border px-6 py-4 text-center transition-colors hover:border-pf-accent/40 hover:bg-pf-surface-2">
                <Upload className="h-4 w-4 text-pf-text-muted" />
                <span className="text-xs text-pf-text-muted">PNG, JPG ou SVG · Máx. 2 MB</span>
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

function RoleBadge({ role }: { role: string }) {
  const isAdmin = role === 'admin'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[11px] font-medium',
        isAdmin
          ? 'bg-pf-accent/15 text-pf-accent'
          : 'bg-pf-surface-2 text-pf-text-muted',
      )}
    >
      {isAdmin ? <ShieldCheck className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
      {isAdmin ? 'Admin' : 'Membro'}
    </span>
  )
}

function MembrosTab({
  initialMembers,
  initialInvites,
  plan,
}: {
  initialMembers: WorkspaceMember[]
  initialInvites: PendingInvite[]
  plan: string
}) {
  const { activeWorkspace } = useWorkspace()
  const [members, setMembers] = useState<WorkspaceMember[]>(initialMembers)
  const [invites, setInvites] = useState<PendingInvite[]>(initialInvites)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member')
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null)
  const [isPending, startTransition] = useTransition()

  const workspaceId = activeWorkspace?.id ?? ''
  const isFree = plan === 'free'
  const atLimit = isFree && members.length >= FREE_MEMBER_LIMIT

  function showToast(message: string, type: 'error' | 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  async function refreshData() {
    const [freshMembers, freshInvites] = await Promise.all([
      getWorkspaceMembersWithDetails(workspaceId),
      getPendingInvites(workspaceId),
    ])
    setMembers(freshMembers)
    setInvites(freshInvites)
  }

  function handleInvite() {
    startTransition(async () => {
      const result = await sendInvite(workspaceId, { email: inviteEmail, role: inviteRole })
      if (result.error) {
        showToast(result.error, 'error')
      } else {
        showToast(`Convite enviado para ${inviteEmail}`, 'success')
        setInviteOpen(false)
        setInviteEmail('')
        await refreshData()
      }
    })
  }

  function handleRevoke(inviteId: string, email: string) {
    startTransition(async () => {
      const result = await revokeInvite(workspaceId, inviteId)
      if (result.error) {
        showToast(result.error, 'error')
      } else {
        showToast(`Convite para ${email} revogado`, 'success')
        await refreshData()
      }
    })
  }

  function handleRemove(userId: string, name: string) {
    startTransition(async () => {
      const result = await removeMember(workspaceId, userId)
      if (result.error) {
        showToast(result.error, 'error')
      } else {
        showToast(`${name} foi removido do workspace`, 'success')
        await refreshData()
      }
    })
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <SectionTitle>Membros do workspace</SectionTitle>
            <SectionDescription>
              {members.length} de {isFree ? FREE_MEMBER_LIMIT : '∞'} membros
              {isFree ? ' no plano Free' : ' no plano Pro'}.
            </SectionDescription>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Button
              size="sm"
              onClick={() => setInviteOpen(true)}
              disabled={atLimit}
              className={cn(
                'gap-1.5',
                atLimit
                  ? 'cursor-not-allowed opacity-50'
                  : 'bg-pf-accent text-pf-bg hover:bg-pf-accent/90',
              )}
            >
              <UserPlus className="h-3.5 w-3.5" />
              Convidar membro
            </Button>
            {atLimit && (
              <p className="text-[11px] text-pf-text-muted">
                Limite Free atingido.{' '}
                <a href="#billing" className="text-pf-accent underline underline-offset-2">
                  Fazer upgrade
                </a>
              </p>
            )}
          </div>
        </div>

        {/* Members table */}
        <div className="mt-5 overflow-hidden rounded-lg border border-pf-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-pf-border bg-pf-surface-2">
                <th className="px-4 py-2.5 text-left font-medium text-pf-text-muted">Nome</th>
                <th className="px-4 py-2.5 text-left font-medium text-pf-text-muted">E-mail</th>
                <th className="px-4 py-2.5 text-left font-medium text-pf-text-muted">Papel</th>
                <th className="px-4 py-2.5 text-left font-medium text-pf-text-muted">Entrada</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr
                  key={m.userId}
                  className="border-b border-pf-border transition-colors last:border-0 hover:bg-pf-surface-2"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-pf-border bg-pf-surface-2 font-mono text-[10px] font-bold text-pf-text-sec">
                        {m.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-medium text-pf-text">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-pf-text-sec">{m.email}</td>
                  <td className="px-4 py-3">
                    <RoleBadge role={m.role} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-pf-text-muted">
                    {m.joinedAt}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {m.role !== 'admin' && (
                      <button
                        onClick={() => handleRemove(m.userId, m.name)}
                        disabled={isPending}
                        className="rounded p-1 text-pf-text-muted opacity-0 transition hover:bg-pf-surface-2 hover:text-red-400 group-hover:opacity-100 [tr:hover_&]:opacity-100"
                        title="Remover membro"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-pf-text-muted">
                    Nenhum membro encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pending invites */}
        {invites.length > 0 && (
          <div className="mt-5">
            <p className="mb-2.5 text-xs font-medium uppercase tracking-wider text-pf-text-muted">
              Convites pendentes
            </p>
            <div className="space-y-2">
              {invites.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between rounded-lg border border-pf-border bg-pf-surface-2 px-4 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="h-3.5 w-3.5 shrink-0 text-pf-text-muted" />
                    <div>
                      <span className="text-sm text-pf-text">{inv.email}</span>
                      <span className="ml-2">
                        <RoleBadge role={inv.role} />
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRevoke(inv.id, inv.email)}
                    disabled={isPending}
                    className="rounded p-1 text-pf-text-muted transition hover:bg-pf-surface hover:text-red-400"
                    title="Revogar convite"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
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
                {(['member', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setInviteRole(r)}
                    className={cn(
                      'flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-sm font-medium transition-colors',
                      inviteRole === r
                        ? 'border-pf-accent/60 bg-pf-accent/10 text-pf-accent'
                        : 'border-pf-border bg-pf-surface text-pf-text-muted hover:border-pf-border/60 hover:text-pf-text-sec',
                    )}
                  >
                    {r === 'admin' ? (
                      <ShieldCheck className="h-3.5 w-3.5" />
                    ) : (
                      <UserCheck className="h-3.5 w-3.5" />
                    )}
                    {r === 'admin' ? 'Admin' : 'Membro'}
                  </button>
                ))}
              </div>
              <p className="text-xs text-pf-text-muted">
                {inviteRole === 'admin'
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
              onClick={handleInvite}
              disabled={!inviteEmail || isPending}
              className="bg-pf-accent text-pf-bg hover:bg-pf-accent/90 disabled:opacity-40"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Enviar convite'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// ─── Billing tab ──────────────────────────────────────────────────────────────

function BillingTab({ plan, memberCount }: { plan: string; memberCount: number }) {
  const isFree = plan === 'free'

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <SectionTitle>Plano atual</SectionTitle>
            <SectionDescription>
              Seu workspace está no plano {isFree ? 'gratuito' : 'Pro'}.
            </SectionDescription>
          </div>
          <span
            className={cn(
              'inline-flex items-center rounded-md border px-2.5 py-1 font-mono text-xs font-medium uppercase tracking-wider',
              isFree
                ? 'border-pf-border bg-pf-surface-2 text-pf-text-muted'
                : 'border-pf-accent/40 bg-pf-accent/10 text-pf-accent',
            )}
          >
            {isFree ? 'Free' : 'Pro'}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 divide-x divide-pf-border rounded-lg border border-pf-border">
          {[
            { label: 'Membros', value: isFree ? `${memberCount} / ${FREE_MEMBER_LIMIT}` : `${memberCount}` },
            { label: 'Leads',   value: isFree ? '/ 50' : 'Ilimitado' },
            { label: 'Período', value: isFree ? 'Gratuito' : 'Pro mensal' },
          ].map((item) => (
            <div key={item.label} className="px-5 py-4">
              <p className="font-mono text-[11px] uppercase tracking-wider text-pf-text-muted">
                {item.label}
              </p>
              <p className="mt-1 font-display text-lg font-bold text-pf-text">{item.value}</p>
            </div>
          ))}
        </div>
      </Card>

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
              {isFree ? 'Plano atual' : 'Incluído no Pro'}
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
            {isFree ? (
              <button className="mt-5 w-full rounded-lg bg-pf-accent py-2 font-mono text-xs font-bold uppercase tracking-wider text-pf-bg transition-all hover:brightness-110">
                Fazer upgrade
              </button>
            ) : (
              <div className="mt-5 rounded-lg border border-pf-accent/40 py-2 text-center font-mono text-xs font-medium text-pf-accent">
                Plano atual
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

// ─── Conta tab ────────────────────────────────────────────────────────────────

function ContaTab() {
  const supabase = getSupabaseBrowserClient()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loadedUser, setLoadedUser] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null)
  const [isPending, startTransition] = useTransition()

  // Load user data from Supabase on first render
  if (!loadedUser) {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setName((user.user_metadata?.full_name as string | undefined) ?? '')
        setEmail(user.email ?? '')
        setLoadedUser(true)
      }
    })
  }

  function showToast(message: string, type: 'error' | 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }

  function handleUpdateName() {
    startTransition(async () => {
      const result = await updateProfile({ name })
      if (result.error) showToast(result.error, 'error')
      else showToast('Nome atualizado com sucesso.', 'success')
    })
  }

  function handleUpdateEmail() {
    startTransition(async () => {
      const result = await updateEmail({ email })
      if (result.error) showToast(result.error, 'error')
      else showToast(result.message ?? 'Confirmação enviada.', 'success')
    })
  }

  function handleUpdatePassword() {
    if (newPassword !== confirmPassword) {
      showToast('As senhas não coincidem.', 'error')
      return
    }
    startTransition(async () => {
      const result = await updatePassword({ password: newPassword })
      if (result.error) showToast(result.error, 'error')
      else {
        showToast(result.message ?? 'Senha alterada com sucesso.', 'success')
        setNewPassword('')
        setConfirmPassword('')
      }
    })
  }

  return (
    <div className="space-y-5">
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Nome */}
      <Card>
        <SectionTitle>Nome</SectionTitle>
        <SectionDescription>Como você aparece para outros membros do workspace.</SectionDescription>
        <div className="mt-5 flex items-end gap-3">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="conta-name" className="text-sm text-pf-text-sec">
              Nome completo
            </Label>
            <Input
              id="conta-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              className="h-9 max-w-sm"
            />
          </div>
          <Button
            onClick={handleUpdateName}
            disabled={isPending || name.length < 2}
            className="bg-pf-accent text-pf-bg hover:bg-pf-accent/90 disabled:opacity-40"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}
          </Button>
        </div>
      </Card>

      {/* E-mail */}
      <Card>
        <SectionTitle>E-mail</SectionTitle>
        <SectionDescription>
          Usado para login e notificações. Uma confirmação será enviada para o novo endereço.
        </SectionDescription>
        <div className="mt-5 space-y-3">
          <div className="flex items-end gap-3">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="conta-email" className="text-sm text-pf-text-sec">
                Novo e-mail
              </Label>
              <Input
                id="conta-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 max-w-sm"
              />
            </div>
            <Button
              onClick={handleUpdateEmail}
              disabled={isPending || !email}
              className="bg-pf-accent text-pf-bg hover:bg-pf-accent/90 disabled:opacity-40"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Atualizar'}
            </Button>
          </div>
          <div className="flex items-start gap-2 text-xs text-pf-text-muted">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>O e-mail atual permanece ativo até você confirmar o novo pelo link enviado.</span>
          </div>
        </div>
      </Card>

      {/* Senha */}
      <Card>
        <SectionTitle>Senha</SectionTitle>
        <SectionDescription>Mínimo de 8 caracteres com pelo menos uma letra e um número.</SectionDescription>
        <div className="mt-5 space-y-3">
          <div className="grid max-w-sm gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="new-password" className="text-sm text-pf-text-sec">
                Nova senha
              </Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm-password" className="text-sm text-pf-text-sec">
                Confirmar senha
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="h-9"
              />
            </div>
          </div>
          <Button
            onClick={handleUpdatePassword}
            disabled={isPending || !newPassword || !confirmPassword}
            className="bg-pf-accent text-pf-bg hover:bg-pf-accent/90 disabled:opacity-40"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Alterar senha'}
          </Button>
        </div>
      </Card>
    </div>
  )
}

// ─── Page (client shell with async data loading) ──────────────────────────────

function SettingsContent() {
  const { activeWorkspace } = useWorkspace()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<Tab>('workspace')
  const [members, setMembers] = useState<WorkspaceMember[]>([])
  const [invites, setInvites] = useState<PendingInvite[]>([])
  const [loaded, setLoaded] = useState(false)
  const [, startTransition] = useTransition()

  const workspaceId = activeWorkspace?.id ?? ''
  const plan = activeWorkspace?.plan ?? 'free'

  // Honour ?tab=conta (or any valid tab) from URL
  useEffect(() => {
    const tab = searchParams.get('tab') as Tab | null
    if (tab && TABS.some((t) => t.id === tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Load members data when switching to Membros tab
  function handleTabChange(tab: Tab) {
    setActiveTab(tab)
    if (tab === 'membros' && !loaded && workspaceId) {
      startTransition(async () => {
        const [m, i] = await Promise.all([
          getWorkspaceMembersWithDetails(workspaceId),
          getPendingInvites(workspaceId),
        ])
        setMembers(m)
        setInvites(i)
        setLoaded(true)
      })
    }
  }

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
            onClick={() => handleTabChange(id)}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition-all sm:px-4',
              activeTab === id
                ? 'bg-pf-surface-2 text-pf-text shadow-sm'
                : 'text-pf-text-muted hover:text-pf-text-sec',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'workspace' && <WorkspaceTab />}
      {activeTab === 'membros' && (
        <MembrosTab
          initialMembers={members}
          initialInvites={invites}
          plan={plan}
        />
      )}
      {activeTab === 'billing' && (
        <BillingTab plan={plan} memberCount={members.length} />
      )}
      {activeTab === 'conta' && <ContaTab />}
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense>
      <SettingsContent />
    </Suspense>
  )
}
