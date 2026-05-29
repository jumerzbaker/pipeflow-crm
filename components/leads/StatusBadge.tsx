import { cn } from '@/lib/utils'
import type { LeadStatus } from '@/types/lead'

const STATUS_CONFIG: Record<LeadStatus, { label: string; className: string }> = {
  novo: {
    label: 'Novo',
    className: 'bg-sky-500/15 text-sky-400 ring-sky-500/30',
  },
  contatado: {
    label: 'Contatado',
    className: 'bg-violet-500/15 text-violet-400 ring-violet-500/30',
  },
  proposta: {
    label: 'Proposta',
    className: 'bg-amber-500/15 text-amber-400 ring-amber-500/30',
  },
  negociacao: {
    label: 'Negociação',
    className: 'bg-orange-500/15 text-orange-400 ring-orange-500/30',
  },
  ganho: {
    label: 'Ganho',
    className: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/30',
  },
  perdido: {
    label: 'Perdido',
    className: 'bg-rose-500/15 text-rose-400 ring-rose-500/30',
  },
}

interface StatusBadgeProps {
  status: LeadStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  )
}

export { STATUS_CONFIG }
