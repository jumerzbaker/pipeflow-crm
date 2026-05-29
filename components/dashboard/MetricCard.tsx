import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  label: string
  value: string
  delta: number
  icon: LucideIcon
  loading?: boolean
}

export function MetricCard({ label, value, delta, icon: Icon, loading = false }: MetricCardProps) {
  const positive = delta >= 0

  return (
    <div className="relative rounded-xl border border-pf-border bg-pf-surface p-5 transition-colors hover:border-pf-border/80">
      {loading && (
        <div className="absolute inset-0 rounded-xl bg-pf-surface">
          <div className="m-5 space-y-3">
            <div className="h-3 w-16 animate-pulse rounded bg-pf-surface-2" />
            <div className="h-7 w-24 animate-pulse rounded bg-pf-surface-2" />
            <div className="h-3 w-12 animate-pulse rounded bg-pf-surface-2" />
          </div>
        </div>
      )}

      <div className="flex items-start justify-between">
        <p className="text-xs font-medium tracking-wide text-pf-text-muted uppercase">{label}</p>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pf-surface-2">
          <Icon className="h-4 w-4 text-pf-text-sec" />
        </span>
      </div>

      <p className="mt-3 font-display text-2xl font-bold tracking-tight text-pf-text">{value}</p>

      <div className="mt-2 flex items-center gap-1">
        {positive ? (
          <TrendingUp className="h-3.5 w-3.5 text-pf-positive" />
        ) : (
          <TrendingDown className="h-3.5 w-3.5 text-pf-negative" />
        )}
        <span
          className={cn(
            'text-xs font-medium',
            positive ? 'text-pf-positive' : 'text-pf-negative',
          )}
        >
          {positive ? '+' : ''}{delta}%
        </span>
        <span className="text-xs text-pf-text-muted">vs. mês anterior</span>
      </div>
    </div>
  )
}
