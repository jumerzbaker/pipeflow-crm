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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {['Total de Leads', 'Negócios Abertos', 'Valor do Pipeline', 'Taxa de Conversão'].map(
          (label) => (
            <div
              key={label}
              className="rounded-lg border border-gray-800 bg-gray-900 p-4"
            >
              <p className="text-xs text-gray-500">{label}</p>
              <div className="mt-2 h-6 w-20 animate-pulse rounded bg-gray-800" />
            </div>
          ),
        )}
      </div>

      <div className="rounded-lg border border-gray-800 bg-gray-900 p-8 text-center text-sm text-gray-600">
        Gráficos e métricas — em breve (M7)
      </div>
    </div>
  )
}
