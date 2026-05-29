import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral do seu pipeline de vendas"
        action={<Button>Novo Lead</Button>}
      />
      <div className="rounded-lg border bg-white p-8 text-center text-sm text-gray-400">
        Métricas e gráficos — em breve (M7)
      </div>
    </div>
  )
}
