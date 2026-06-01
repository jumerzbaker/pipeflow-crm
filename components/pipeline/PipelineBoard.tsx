'use client'

import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { MOCK_DEALS } from '@/lib/mock/deals'
import { STAGE_CONFIG } from '@/types/deal'
import type { Deal, DealStage } from '@/types/deal'
import { PipelineColumn } from './PipelineColumn'
import { DealCard } from './DealCard'
import { DealSheet } from './DealSheet'

interface PipelineBoardProps {
  globalSheetOpen?: boolean
  onGlobalSheetClose?: () => void
}

export function PipelineBoard({ globalSheetOpen, onGlobalSheetClose }: PipelineBoardProps) {
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [sheetStage, setSheetStage] = useState<DealStage>('novo_lead')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [dealToEdit, setDealToEdit] = useState<Deal | undefined>(undefined)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
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

    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d)),
    )
  }

  function handleAddDeal(stage: DealStage) {
    setSheetStage(stage)
    setSheetOpen(true)
  }

  function handleEditDeal(deal: Deal) {
    setDealToEdit(deal)
    setSheetOpen(true)
  }

  function handleMoveDeal(dealId: string, stage: DealStage) {
    setDeals((prev) => prev.map((d) => (d.id === dealId ? { ...d, stage } : d)))
  }

  function handleSaveDeal(data: Omit<Deal, 'id'>) {
    if (dealToEdit) {
      setDeals((prev) => prev.map((d) => (d.id === dealToEdit.id ? { ...d, ...data } : d)))
    } else {
      const newDeal: Deal = { ...data, id: `d${Date.now()}` }
      setDeals((prev) => [...prev, newDeal])
    }
  }

  const isSheetOpen = sheetOpen || !!globalSheetOpen

  function handleSheetClose() {
    setSheetOpen(false)
    setDealToEdit(undefined)
    onGlobalSheetClose?.()
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
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
        open={isSheetOpen}
        onClose={handleSheetClose}
        initialStage={sheetStage}
        dealToEdit={dealToEdit}
        onSave={handleSaveDeal}
      />
    </>
  )
}
