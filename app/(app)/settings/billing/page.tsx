import { redirect } from 'next/navigation'
import { getUserWorkspaces } from '@/app/actions/workspace'
import { getSupabaseAdminClient } from '@/lib/supabase/server'
import { FREE_LEAD_LIMIT, FREE_MEMBER_LIMIT } from '@/lib/limits'
import { BillingClient } from '@/components/billing/BillingClient'

export default async function BillingPage() {
  const workspaces = await getUserWorkspaces()
  if (!workspaces.length) redirect('/onboarding')

  const workspace = workspaces[0]
  const admin = getSupabaseAdminClient()

  const [{ count: leadCount }, { count: memberCount }] = await Promise.all([
    admin
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspace.id),
    admin
      .from('workspace_members')
      .select('user_id', { count: 'exact', head: true })
      .eq('workspace_id', workspace.id),
  ])

  return (
    <BillingClient
      workspaceId={workspace.id}
      plan={workspace.plan}
      leadCount={leadCount ?? 0}
      memberCount={memberCount ?? 0}
      leadLimit={FREE_LEAD_LIMIT}
      memberLimit={FREE_MEMBER_LIMIT}
      hasCustomer={!!workspace.stripe_customer_id}
    />
  )
}
