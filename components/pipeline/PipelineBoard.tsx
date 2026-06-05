'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { STAGE_CONFIG } from '@/types/deal'
import type { Deal, DealStage } from '@/types/deal'
import { PipelineColumn } from './PipelineColumn'
import { DealCard } from './DealCard'
import { DealSheet } from './DealSheet'
import { updateDealStage } from '@/app/actions/deals'

interface AvailableLead {
  id: string
  name: string
  company: string
}

interface Member {
  id: string
  name: string
}

interface PipelineBoardProps {
  initialDeals: Deal[]
  availableLeads: AvailableLead[]
  members: Member[]
  workspaceId: string
}

export function PipelineBoard({
  initialDeals,
  availableLeads,
  members,
  workspaceId,
}: PipelineBoardProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  const [deals, setDeals] = useState<Deal[]>(initialDeals)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [sheetStage, setSheetStage] = useState<DealStage>('novo_lead')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [dealToEdit, setDealToEdit] = useState<Deal | undefined>(undefined)

  // sync when server data changes after router.refresh()
  useEffect(() => {
    setDeals(initialDeals)
  }, [initialDeals])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const activeDeal = activeId ? deals.find((d) => d.id === activeId) : null
  const activeStageConfig = activeDeal
    ? STAGE_CONFIG.find((s) => s.key === activeDeal.stage)
    : null

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const newStage = over.id as DealStage
    const dealId = String(active.id)
    const deal = deals.find((d) => d.id === dealId)
    if (!deal || deal.stage === newStage) return

    // optimistic update
    const stageDeals = deals.filter((d) => d.stage === newStage)
    const newPosition = stageDeals.length

    setDeals((prev) =>
      prev.map((d) =>
        d.id === dealId ? { ...d, stage: newStage, position: newPosition } : d,
      ),
    )

    // persist
    startTransition(async () => {
      const result = await updateDealStage(workspaceId, dealId, newStage, newPosition)
      if (result.error) {
        // revert on failure
        setDeals((prev) =>
          prev.map((d) => (d.id === dealId ? { ...d, stage: deal.stage, position: deal.position } : d)),
        )
      }
    })
  }

  function handleAddDeal(stage: DealStage) {
    setSheetStage(stage)
    setDealToEdit(undefined)
    setSheetOpen(true)
  }

  function handleEditDeal(deal: Deal) {
    setDealToEdit(deal)
    setSheetOpen(true)
  }

  function handleMoveDeal(dealId: string, stage: DealStage) {
    const deal = deals.find((d) => d.id === dealId)
    if (!deal) return

    const stageDeals = deals.filter((d) => d.stage === stage)
    const newPosition = stageDeals.length

    setDeals((prev) =>
      prev.map((d) =>
        d.id === dealId ? { ...d, stage, position: newPosition } : d,
      ),
    )

    startTransition(async () => {
      const result = await updateDealStage(workspaceId, dealId, stage, newPosition)
      if (result.error) {
        setDeals((prev) =>
          prev.map((d) =>
            d.id === dealId ? { ...d, stage: deal.stage, position: deal.position } : d,
          ),
        )
      }
    })
  }

  function handleSheetClose() {
    setSheetOpen(false)
    setDealToEdit(undefined)
  }

  function handleSheetSuccess() {
    handleSheetClose()
    router.refresh()
  }

  return (
    <>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGE_CONFIG.map((stage) => (
            <PipelineColumn
              key={stage.key}
              stage={stage.key}
              label={stage.label}
              color={stage.color}
              dimColor={stage.dimColor}
              deals={deals.filter((d) => d.stage === stage.key)}
              onAddDeal={handleAddDeal}
              onEditDeal={handleEditDeal}
              onMoveDeal={handleMoveDeal}
            />
          ))}
        </div>

        <DragOverlay>
          {activeDeal && activeStageConfig ? (
            <DealCard
              deal={activeDeal}
              stageColor={activeStageConfig.color}
              isDragOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <DealSheet
        open={sheetOpen}
        onClose={handleSheetClose}
        initialStage={sheetStage}
        dealToEdit={dealToEdit}
        availableLeads={availableLeads}
        members={members}
        workspaceId={workspaceId}
        onSuccess={handleSheetSuccess}
      />
    </>
  )
}
