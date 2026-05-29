'use client'

import { useDroppable } from '@dnd-kit/core'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DealCard } from './DealCard'
import type { Deal, DealStage } from '@/types/deal'

interface PipelineColumnProps {
  stage: DealStage
  label: string
  color: string
  dimColor: string
  deals: Deal[]
  onAddDeal: (stage: DealStage) => void
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

export function PipelineColumn({
  stage,
  label,
  color,
  dimColor,
  deals,
  onAddDeal,
}: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage })

  const totalValue = deals.reduce((sum, d) => sum + d.value, 0)
  const isClosedWon = stage === 'fechado_ganho'
  const isClosedLost = stage === 'fechado_perdido'

  return (
    <div className="flex w-72 shrink-0 flex-col">
      {/* Column header */}
      <div
        className="mb-3 rounded-lg p-3 transition-colors"
        style={{ backgroundColor: dimColor }}
      >
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="size-1.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            {/* Mono uppercase label per brand guide */}
            <span
              className="font-mono text-[0.68rem] font-medium uppercase tracking-widest"
              style={{ color }}
            >
              {label}
            </span>
          </div>
          {/* Count badge */}
          <span
            className="rounded font-mono text-[0.62rem] font-semibold px-1.5 py-0.5"
            style={{
              backgroundColor: color + '18',
              color,
            }}
          >
            {deals.length}
          </span>
        </div>

        {/* Total value in mono */}
        <p
          className="font-mono text-[0.72rem] font-medium"
          style={{ color: color + 'bb' }}
        >
          {formatCurrency(totalValue)}
        </p>

        {/* Terminal stage highlight bar */}
        {(isClosedWon || isClosedLost) && (
          <div
            className="mt-2.5 h-px w-full rounded-full"
            style={{ backgroundColor: color + '60' }}
          />
        )}
      </div>

      {/* Cards drop area */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex min-h-[200px] flex-1 flex-col gap-2 rounded-lg border p-2 transition-colors duration-150',
          isOver ? 'border-dashed' : 'border-transparent',
        )}
        style={{
          backgroundColor: isOver ? color + '06' : 'transparent',
          borderColor: isOver ? color + '44' : undefined,
        }}
      >
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} stageColor={color} />
        ))}

        {deals.length === 0 && !isOver && (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-pf-border py-8">
            <p className="font-mono text-[0.65rem] uppercase tracking-wider text-pf-text-muted">
              Nenhum negócio
            </p>
          </div>
        )}
      </div>

      {/* Add deal button */}
      <button
        onClick={() => onAddDeal(stage)}
        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-pf-border py-2 font-mono text-[0.65rem] uppercase tracking-wider text-pf-text-muted transition-all duration-150 hover:border-pf-text-muted/40 hover:bg-pf-surface-2 hover:text-pf-text-sec"
      >
        <Plus className="size-3" />
        Novo negócio
      </button>
    </div>
  )
}
