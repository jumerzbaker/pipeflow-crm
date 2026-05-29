'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { PipelineBoard } from '@/components/pipeline/PipelineBoard'

export default function PipelinePage() {
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <div className="flex h-full flex-col gap-6">
      <PageHeader
        title="Pipeline"
        subtitle="Acompanhe o progresso dos seus negócios"
        action={
          <Button onClick={() => setSheetOpen(true)}>
            <Plus />
            Novo negócio
          </Button>
        }
      />

      <PipelineBoard
        globalSheetOpen={sheetOpen}
        onGlobalSheetClose={() => setSheetOpen(false)}
      />
    </div>
  )
}
