import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, Building2, Briefcase, Calendar, User } from 'lucide-react'
import { StatusBadge } from '@/components/leads/StatusBadge'
import { ActivityTimeline } from '@/components/leads/ActivityTimeline'
import { getUserWorkspaces } from '@/app/actions/workspace'
import { getLeadById } from '@/app/actions/leads'
import { getActivities } from '@/app/actions/activities'

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const workspaces = await getUserWorkspaces()
  if (!workspaces.length) redirect('/onboarding')

  const workspaceId = workspaces[0].id
  const [lead, activities] = await Promise.all([
    getLeadById(workspaceId, id),
    getActivities(workspaceId, id),
  ])

  if (!lead) notFound()

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Link
          href="/leads"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Voltar para Leads
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-white">{lead.name}</h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <StatusBadge status={lead.status} />
              <span className="text-sm text-gray-500">
                {lead.role ? `${lead.role} • ` : ''}{lead.company}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Informações de contato
            </h2>
            <ul className="space-y-3">
              <InfoRow icon={<Mail className="size-4" />} label="E-mail">
                {lead.email ? (
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-violet-400 transition-colors hover:text-violet-300"
                  >
                    {lead.email}
                  </a>
                ) : (
                  <span className="text-gray-600">—</span>
                )}
              </InfoRow>
              {lead.phone && (
                <InfoRow icon={<Phone className="size-4" />} label="Telefone">
                  {lead.phone}
                </InfoRow>
              )}
              <InfoRow icon={<Building2 className="size-4" />} label="Empresa">
                {lead.company}
              </InfoRow>
              {lead.role && (
                <InfoRow icon={<Briefcase className="size-4" />} label="Cargo">
                  {lead.role}
                </InfoRow>
              )}
              <InfoRow icon={<User className="size-4" />} label="Responsável">
                {lead.owner || <span className="text-gray-600">—</span>}
              </InfoRow>
              <InfoRow icon={<Calendar className="size-4" />} label="Criado em">
                {formatDate(lead.createdAt)}
              </InfoRow>
            </ul>
          </div>

          {lead.notes && (
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Observações
              </h2>
              <p className="text-sm leading-relaxed text-gray-400">{lead.notes}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <ActivityTimeline
            leadId={id}
            workspaceId={workspaceId}
            initialActivities={activities}
          />
        </div>
      </div>
    </div>
  )
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0 text-gray-600">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-gray-600">{label}</p>
        <div className="mt-0.5 text-sm text-gray-200">{children}</div>
      </div>
    </li>
  )
}
