import { MOCK_DEALS } from './deals'
import { MOCK_LEADS } from './leads'

const OPEN_STAGES = ['novo_lead', 'contato_realizado', 'proposta_enviada', 'negociacao'] as const

const openDeals = MOCK_DEALS.filter((d) => (OPEN_STAGES as readonly string[]).includes(d.stage))
const wonDeals = MOCK_DEALS.filter((d) => d.stage === 'fechado_ganho')

export const DASHBOARD_METRICS = {
  totalLeads: MOCK_LEADS.length,
  totalLeadsDelta: +12,
  openDeals: openDeals.length,
  openDealsDelta: +3,
  pipelineValue: openDeals.reduce((sum, d) => sum + d.value, 0),
  pipelineValueDelta: +8.4,
  conversionRate: Math.round((wonDeals.length / MOCK_DEALS.length) * 1000) / 10,
  conversionRateDelta: -1.2,
}

export const FUNNEL_DATA = [
  { stage: 'Novo Lead', count: MOCK_DEALS.filter((d) => d.stage === 'novo_lead').length, value: MOCK_DEALS.filter((d) => d.stage === 'novo_lead').reduce((s, d) => s + d.value, 0) },
  { stage: 'Contato', count: MOCK_DEALS.filter((d) => d.stage === 'contato_realizado').length, value: MOCK_DEALS.filter((d) => d.stage === 'contato_realizado').reduce((s, d) => s + d.value, 0) },
  { stage: 'Proposta', count: MOCK_DEALS.filter((d) => d.stage === 'proposta_enviada').length, value: MOCK_DEALS.filter((d) => d.stage === 'proposta_enviada').reduce((s, d) => s + d.value, 0) },
  { stage: 'Negociação', count: MOCK_DEALS.filter((d) => d.stage === 'negociacao').length, value: MOCK_DEALS.filter((d) => d.stage === 'negociacao').reduce((s, d) => s + d.value, 0) },
  { stage: 'Ganho', count: MOCK_DEALS.filter((d) => d.stage === 'fechado_ganho').length, value: MOCK_DEALS.filter((d) => d.stage === 'fechado_ganho').reduce((s, d) => s + d.value, 0) },
]

export const UPCOMING_DEALS = MOCK_DEALS
  .filter((d) => (OPEN_STAGES as readonly string[]).includes(d.stage) && d.dueDate)
  .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
  .slice(0, 5)
