import { Users, Briefcase, CircleDollarSign, Target } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { FunnelChart } from '@/components/dashboard/FunnelChart'
import { UpcomingDeals } from '@/components/dashboard/UpcomingDeals'
import { DASHBOARD_METRICS, FUNNEL_DATA, UPCOMING_DEALS } from '@/lib/mock/dashboard'

function formatBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function DashboardPage() {
  const m = DASHBOARD_METRICS

  const metrics = [
    {
      label: 'Total de Leads',
      value: String(m.totalLeads),
      delta: m.totalLeadsDelta,
      icon: Users,
    },
    {
      label: 'Negócios Abertos',
      value: String(m.openDeals),
      delta: m.openDealsDelta,
      icon: Briefcase,
    },
    {
      label: 'Valor do Pipeline',
      value: formatBRL(m.pipelineValue),
      delta: m.pipelineValueDelta,
      icon: CircleDollarSign,
    },
    {
      label: 'Taxa de Conversão',
      value: `${m.conversionRate}%`,
      delta: m.conversionRateDelta,
      icon: Target,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral do seu pipeline de vendas"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FunnelChart data={FUNNEL_DATA} />
        </div>
        <div className="lg:col-span-1">
          <UpcomingDeals deals={UPCOMING_DEALS} />
        </div>
      </div>
    </div>
  )
}
