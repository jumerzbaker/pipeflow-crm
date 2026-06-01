import type { Deal } from '@/types/deal'
import { cn } from '@/lib/utils'

type Urgency = 'overdue' | 'today' | 'week' | 'soon'

function getUrgency(dueDate: string): Urgency {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate)
  due.setHours(0, 0, 0, 0)
  const diff = Math.round((due.getTime() - today.getTime()) / 86_400_000)
  if (diff < 0) return 'overdue'
  if (diff === 0) return 'today'
  if (diff <= 7) return 'week'
  return 'soon'
}

const URGENCY_CONFIG: Record<Urgency, { label: string; className: string }> = {
  overdue: { label: 'Atrasado', className: 'bg-pf-negative/15 text-pf-negative' },
  today: { label: 'Hoje', className: 'bg-pf-warm/15 text-pf-warm' },
  week: { label: 'Esta semana', className: 'bg-pf-cool/15 text-pf-cool' },
  soon: { label: 'Em breve', className: 'bg-pf-surface-2 text-pf-text-sec' },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

function formatBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

interface UpcomingDealsProps {
  deals: Deal[]
}

export function UpcomingDeals({ deals }: UpcomingDealsProps) {
  return (
    <div className="rounded-xl border border-pf-border bg-pf-surface p-5">
      <p className="mb-1 text-sm font-semibold text-pf-text">Prazo Próximo</p>
      <p className="mb-5 text-xs text-pf-text-muted">Negócios abertos mais urgentes</p>

      <ul className="space-y-3">
        {deals.map((deal) => {
          const urgency = getUrgency(deal.dueDate!)
          const cfg = URGENCY_CONFIG[urgency]

          return (
            <li
              key={deal.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-pf-border-subtle bg-pf-surface-2 px-3.5 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-pf-text">{deal.title}</p>
                <p className="mt-0.5 truncate text-xs text-pf-text-muted">{deal.leadName}</p>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none',
                    cfg.className,
                  )}
                >
                  {cfg.label}
                </span>
                <div className="flex items-center gap-2 text-xs text-pf-text-muted">
                  <span>{formatDate(deal.dueDate!)}</span>
                  <span className="font-medium text-pf-text-sec">{formatBRL(deal.value)}</span>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
