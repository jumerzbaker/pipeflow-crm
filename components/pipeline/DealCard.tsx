'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { CalendarDays, MoreHorizontal, Pencil, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { STAGE_CONFIG } from '@/types/deal'
import type { Deal, DealStage } from '@/types/deal'

interface DealCardProps {
  deal: Deal
  stageColor: string
  isDragOverlay?: boolean
  onEdit?: () => void
  onMove?: (stage: DealStage) => void
}

function getDueDateStatus(dueDate: string): 'overdue' | 'urgent' | 'normal' {
  const due = new Date(dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return 'overdue'
  if (diff <= 3) return 'urgent'
  return 'normal'
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

export function DealCard({ deal, stageColor, isDragOverlay = false, onEdit, onMove }: DealCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: deal.id,
    data: { deal },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  const dueDateStatus = getDueDateStatus(deal.dueDate)
  const otherStages = STAGE_CONFIG.filter((s) => s.key !== deal.stage)

  return (
    <div
      ref={setNodeRef}
      style={style}
      suppressHydrationWarning
      className={cn(
        'group relative rounded-xl border bg-card p-3 transition-all duration-200 select-none',
        isDragging && !isDragOverlay ? 'opacity-40 scale-95' : '',
        isDragOverlay ? 'rotate-1 shadow-2xl ring-1' : 'hover:shadow-lg',
      )}
      {...attributes}
      {...listeners}
    >
      {/* Stage color accent line */}
      <div
        className="absolute left-0 top-0 h-full w-0.5 rounded-l-xl"
        style={{ backgroundColor: stageColor }}
      />

      {/* Three-dot menu — top right */}
      {!isDragOverlay && (onEdit || onMove) && (
        <div
          className="absolute right-1.5 top-1.5"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex h-6 w-6 items-center justify-center rounded-md opacity-0 transition-opacity group-hover:opacity-100 hover:bg-pf-surface-2"
              aria-label="Opções do negócio"
            >
              <MoreHorizontal className="h-3.5 w-3.5 text-pf-text-muted" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {onEdit && (
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil className="mr-2 h-3.5 w-3.5" />
                  Editar negócio
                </DropdownMenuItem>
              )}
              {onMove && otherStages.length > 0 && (
                <>
                  {onEdit && <DropdownMenuSeparator />}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <ArrowRight className="mr-2 h-3.5 w-3.5" />
                      Mover para
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {otherStages.map((s) => (
                        <DropdownMenuItem key={s.key} onClick={() => onMove(s.key)}>
                          <span
                            className="mr-2 h-2 w-2 shrink-0 rounded-full"
                            style={{ backgroundColor: s.color }}
                          />
                          {s.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Deal title */}
      <p className="mb-2 pr-5 text-[0.82rem] font-medium leading-snug text-pf-text">
        {deal.title}
      </p>

      {/* Value — IBM Plex Mono per brand guide */}
      <p
        className="mb-3 font-mono text-sm font-semibold tabular-nums"
        style={{ color: stageColor }}
      >
        {formatCurrency(deal.value)}
      </p>

      {/* Lead name */}
      <p className="mb-2.5 text-[0.72rem] text-pf-text-sec">
        {deal.leadName}
      </p>

      {/* Footer: avatar + due date */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div
            className="flex size-5 items-center justify-center rounded-full font-mono text-[0.52rem] font-bold"
            style={{ backgroundColor: stageColor + '22', color: stageColor }}
          >
            {deal.ownerInitials}
          </div>
          <span className="font-mono text-[0.65rem] text-pf-text-muted">{deal.owner}</span>
        </div>

        <div
          className={cn(
            'flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[0.62rem]',
            dueDateStatus === 'overdue' && 'bg-[#ff4757]/12 text-[#ff4757]',
            dueDateStatus === 'urgent' && 'bg-[#ff6b35]/12 text-[#ff6b35]',
            dueDateStatus === 'normal' && 'text-pf-text-muted',
          )}
        >
          <CalendarDays className="size-2.5" />
          {formatDate(deal.dueDate)}
        </div>
      </div>
    </div>
  )
}
