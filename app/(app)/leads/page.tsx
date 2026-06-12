import { redirect } from 'next/navigation'
import { getUserWorkspaces, getWorkspaceMembers } from '@/app/actions/workspace'
import { getLeads } from '@/app/actions/leads'
import { canAddLead } from '@/lib/limits'
import { LeadsClient } from '@/components/leads/LeadsClient'

export default async function LeadsPage() {
  const workspaces = await getUserWorkspaces()
  if (!workspaces.length) redirect('/onboarding')

  const workspaceId = workspaces[0].id
  const [leads, members, limitCheck] = await Promise.all([
    getLeads(workspaceId),
    getWorkspaceMembers(workspaceId),
    canAddLead(workspaceId),
  ])

  return (
    <LeadsClient
      initialLeads={leads}
      members={members}
      workspaceId={workspaceId}
      leadLimitCheck={limitCheck}
    />
  )
}
