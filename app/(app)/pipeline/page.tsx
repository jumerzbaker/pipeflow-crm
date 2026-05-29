import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'

export default function PipelinePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pipeline"
        subtitle="Acompanhe o progresso dos seus negócios"
        action={<Button>Novo Negócio</Button>}
      />

      <div className="rounded-lg border border-gray-800 bg-gray-900 p-8 text-center text-sm text-gray-600">
        Board Kanban — em breve (M5)
      </div>
    </div>
  )
}
