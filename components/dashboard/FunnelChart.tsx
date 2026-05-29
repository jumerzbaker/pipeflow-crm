'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { FUNNEL_DATA } from '@/lib/mock/dashboard'

const STAGE_COLORS = ['#5b7fff', '#a78bfa', '#caff33', '#ff6b35', '#2ed573']

function formatBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

interface TooltipPayload {
  value: number
  payload: { stage: string; count: number; value: number }
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded-lg border border-pf-border bg-pf-surface px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-pf-text">{d.stage}</p>
      <p className="mt-1 text-pf-text-sec">
        {d.count} negócio{d.count !== 1 ? 's' : ''}
      </p>
      <p className="text-pf-text-sec">{formatBRL(d.value)}</p>
    </div>
  )
}

interface FunnelChartProps {
  data: typeof FUNNEL_DATA
}

export function FunnelChart({ data }: FunnelChartProps) {
  return (
    <div className="rounded-xl border border-pf-border bg-pf-surface p-5">
      <p className="mb-1 text-sm font-semibold text-pf-text">Funil de Vendas</p>
      <p className="mb-5 text-xs text-pf-text-muted">Negócios por etapa do pipeline</p>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" barCategoryGap="30%">
          <CartesianGrid horizontal={false} stroke="#2a2a2e" strokeDasharray="3 3" />
          <XAxis
            type="number"
            tick={{ fill: '#555559', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="stage"
            width={78}
            tick={{ fill: '#8a8a8f', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1a1a1e' }} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={STAGE_COLORS[i % STAGE_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
