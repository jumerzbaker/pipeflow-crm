import { redirect } from 'next/navigation'
import { Users, Briefcase, CircleDollarSign, Target } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { FunnelChart } from '@/components/dashboard/FunnelChart'
import { UpcomingDeals } from '@/components/dashboard/UpcomingDeals'
import { getUserWorkspaces } from '@/app/actions/workspace'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import type { Deal, DealStage } from '@/types/deal'

const OPEN_STAGES: DealStage[] = [
  'novo_lead',
  'contato_realizado',
  'proposta_enviada',
  'negociacao',
]

const FUNNEL_STAGES = [
  { key: 'novo_lead', label: 'Novo Lead' },
  { key: 'contato_realizado', label: 'Contato' },
  { key: 'proposta_enviada', label: 'Proposta' },
  { key: 'negociacao', label: 'Negociação' },
  { key: 'fechado_ganho', label: 'Ganho' },
] as const

function formatBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

async function getDashboardData(workspaceId: string) {
  const admin = getSupabaseAdminClient()

  const [
    { count: totalLeads },
    { data: allDeals },
    { data: upcomingRaw },
  ] = await Promise.all([
    admin
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId),
    admin
      .from('deals')
      .select('id, stage, value, due_date, title, lead_id, owner_id, position, leads(name)')
      .eq('workspace_id', workspaceId),
    admin
      .from('deals')
      .select('id, title, value, due_date, lead_id, leads(name)')
      .eq('workspace_id', workspaceId)
      .in('stage', OPEN_STAGES)
      .not('due_date', 'is', null)
      .order('due_date', { ascending: true })
      .limit(5),
  ])

  const deals = allDeals ?? []
  const openDeals = deals.filter((d) => (OPEN_STAGES as readonly string[]).includes(d.stage))
  const wonDeals = deals.filter((d) => d.stage === 'fechado_ganho')

  const pipelineValue = openDeals.reduce((s, d) => s + d.value, 0)
  const conversionRate =
    deals.length > 0 ? Math.round((wonDeals.length / deals.length) * 1000) / 10 : 0

  const funnelData = FUNNEL_STAGES.map(({ key, label }) => ({
    stage: label,
    count: deals.filter((d) => d.stage === key).length,
    value: deals.filter((d) => d.stage === key).reduce((s, d) => s + d.value, 0),
  }))

  const upcomingDeals: Deal[] = (upcomingRaw ?? []).map((d) => ({
    id: d.id,
    title: d.title,
    value: d.value,
    dueDate: d.due_date ?? '',
    leadName: (d.leads as { name: string } | null)?.name ?? '',
    leadId: d.lead_id,
    ownerId: null,
    owner: '',
    ownerInitials: '',
    stage: 'novo_lead',
    position: 0,
  }))

  return {
    totalLeads: totalLeads ?? 0,
    openDeals: openDeals.length,
    pipelineValue,
    conversionRate,
    funnelData,
    upcomingDeals,
  }
}

export default async function DashboardPage() {
  const workspaces = await getUserWorkspaces()
  if (!workspaces.length) redirect('/onboarding')

  const workspaceId = workspaces[0].id
  const {
    totalLeads,
    openDeals,
    pipelineValue,
    conversionRate,
    funnelData,
    upcomingDeals,
  } = await getDashboardData(workspaceId)

  const metrics = [
    { label: 'Total de Leads', value: String(totalLeads), delta: 0, icon: Users },
    { label: 'Negócios Abertos', value: String(openDeals), delta: 0, icon: Briefcase },
    { label: 'Valor do Pipeline', value: formatBRL(pipelineValue), delta: 0, icon: CircleDollarSign },
    { label: 'Taxa de Conversão', value: `${conversionRate}%`, delta: 0, icon: Target },
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
          <FunnelChart data={funnelData} />
        </div>
        <div className="lg:col-span-1">
          <UpcomingDeals deals={upcomingDeals} />
        </div>
      </div>
    </div>
  )
}
