import { redirect } from 'next/navigation'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { PipelineBoard } from '@/components/pipeline/PipelineBoard'
import { getUserWorkspaces, getWorkspaceMembers } from '@/app/actions/workspace'
import { getDeals } from '@/app/actions/deals'
import { getLeads } from '@/app/actions/leads'

export default async function PipelinePage() {
  const workspaces = await getUserWorkspaces()
  if (!workspaces.length) redirect('/onboarding')

  const workspaceId = workspaces[0].id
  const [deals, leads, members] = await Promise.all([
    getDeals(workspaceId),
    getLeads(workspaceId),
    getWorkspaceMembers(workspaceId),
  ])

  const availableLeads = leads.map((l) => ({
    id: l.id,
    name: l.name,
    company: l.company,
  }))

  return (
    <div className="flex h-full flex-col gap-6">
      <PageHeader
        title="Pipeline"
        subtitle="Acompanhe o progresso dos seus negócios"
      />

      <PipelineBoard
        initialDeals={deals}
        availableLeads={availableLeads}
        members={members}
        workspaceId={workspaceId}
      />
    </div>
  )
}
