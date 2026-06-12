'use client'

import { useTransition } from 'react'
import {
  Crown, Check, Loader2, AlertTriangle, Users, Target, ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { createCheckoutSession, createPortalSession } from '@/app/actions/billing'

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

interface Props {
  workspaceId: string
  plan: string
  leadCount: number
  memberCount: number
  leadLimit: number
  memberLimit: number
  hasCustomer: boolean
}

function UsageBar({
  label,
  count,
  limit,
  icon: Icon,
}: {
  label: string
  count: number
  limit: number
  icon: React.ElementType
}) {
  const pct = Math.min(100, Math.round((count / limit) * 100))
  const atLimit = count >= limit
  const nearLimit = pct >= 90

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5 text-pf-text-sec">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </div>
        <span
          className={cn(
            'font-mono text-xs font-medium',
            atLimit ? 'text-red-400' : nearLimit ? 'text-amber-400' : 'text-pf-text-muted',
          )}
        >
          {count} / {limit}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-pf-surface-2">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            atLimit ? 'bg-red-500' : nearLimit ? 'bg-amber-400' : 'bg-pf-accent',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function LimitBanner({
  leadCount,
  leadLimit,
  memberCount,
  memberLimit,
}: {
  leadCount: number
  leadLimit: number
  memberCount: number
  memberLimit: number
}) {
  const leadAtLimit = leadCount >= leadLimit
  const memberAtLimit = memberCount >= memberLimit
  if (!leadAtLimit && !memberAtLimit) return null

  const messages = [
    leadAtLimit && `limite de ${leadLimit} leads`,
    memberAtLimit && `limite de ${memberLimit} membros`,
  ].filter(Boolean).join(' e ')

  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
      <p className="text-sm text-amber-300">
        Você atingiu o {messages} do plano Free. Faça upgrade para continuar crescendo.
      </p>
    </div>
  )
}

export function BillingClient({
  workspaceId,
  plan,
  leadCount,
  memberCount,
  leadLimit,
  memberLimit,
  hasCustomer,
}: Props) {
  const isFree = plan === 'free'
  const [isPendingAction, startTransition] = useTransition()

  function handleCheckout() {
    startTransition(async () => { await createCheckoutSession(workspaceId) })
  }

  function handlePortal() {
    startTransition(async () => { await createPortalSession(workspaceId) })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/settings"
          className="inline-flex items-center gap-1.5 text-sm text-pf-text-muted transition-colors hover:text-pf-text-sec"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Configurações
        </Link>
      </div>

      <PageHeader
        title="Billing"
        subtitle="Gerencie seu plano e assinatura"
      />

      {isFree && (
        <LimitBanner
          leadCount={leadCount}
          leadLimit={leadLimit}
          memberCount={memberCount}
          memberLimit={memberLimit}
        />
      )}

      {/* Plano atual + usage */}
      <div className="rounded-xl border border-pf-border bg-pf-surface p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-base font-semibold text-pf-text">Plano atual</h2>
            <p className="mt-0.5 text-sm text-pf-text-muted">
              {isFree
                ? 'Gratuito · sem cartão de crédito'
                : 'Pro · cobrança mensal'}
            </p>
          </div>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs font-medium uppercase tracking-wider',
              isFree
                ? 'border-pf-border bg-pf-surface-2 text-pf-text-muted'
                : 'border-pf-accent/40 bg-pf-accent/10 text-pf-accent',
            )}
          >
            {!isFree && <Crown className="h-3 w-3" />}
            {isFree ? 'Free' : 'Pro'}
          </span>
        </div>

        {isFree && (
          <div className="mt-6 space-y-4">
            <p className="text-xs font-medium uppercase tracking-wider text-pf-text-muted">
              Uso do plano Free
            </p>
            <UsageBar
              label="Leads"
              count={leadCount}
              limit={leadLimit}
              icon={Target}
            />
            <UsageBar
              label="Membros"
              count={memberCount}
              limit={memberLimit}
              icon={Users}
            />
          </div>
        )}

        {!isFree && (
          <div className="mt-5">
            <Button
              onClick={() => handlePortal()}
              disabled={isPendingAction}
              variant="outline"
              className="border-pf-border text-pf-text-sec hover:text-pf-text"
            >
              {isPendingAction ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Gerenciar assinatura
            </Button>
          </div>
        )}
      </div>

      {/* Comparação de planos */}
      <div className="rounded-xl border border-pf-border bg-pf-surface p-6">
        <h2 className="font-display text-base font-semibold text-pf-text">Comparar planos</h2>
        <p className="mt-0.5 text-sm text-pf-text-muted">
          Faça upgrade para desbloquear todos os recursos.
        </p>

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
              <button
                onClick={() => handleCheckout()}
                disabled={isPendingAction}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-pf-accent py-2 font-mono text-xs font-bold uppercase tracking-wider text-pf-bg transition-all hover:brightness-110 disabled:opacity-60"
              >
                {isPendingAction ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : null}
                Assinar Pro · R$ 49/mês
              </button>
            ) : (
              <div className="mt-5 rounded-lg border border-pf-accent/40 py-2 text-center font-mono text-xs font-medium text-pf-accent">
                Plano atual
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
