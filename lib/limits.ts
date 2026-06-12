import 'server-only'
import { getSupabaseAdminClient } from '@/lib/supabase/server'

export const FREE_LEAD_LIMIT = 50
export const FREE_MEMBER_LIMIT = 2

export type LimitCheck = {
  allowed: boolean
  count: number
  limit: number | null // null = unlimited (Pro)
  atLimit: boolean
  nearLimit: boolean  // >= 90% used on Free
}

export async function canAddLead(workspaceId: string): Promise<LimitCheck> {
  const admin = getSupabaseAdminClient()

  const { data: workspace } = await admin
    .from('workspaces')
    .select('plan')
    .eq('id', workspaceId)
    .single()

  if (workspace?.plan !== 'free') {
    return { allowed: true, count: 0, limit: null, atLimit: false, nearLimit: false }
  }

  const { count } = await admin
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)

  const current = count ?? 0
  const atLimit = current >= FREE_LEAD_LIMIT
  const nearLimit = current >= Math.floor(FREE_LEAD_LIMIT * 0.9)

  return {
    allowed: !atLimit,
    count: current,
    limit: FREE_LEAD_LIMIT,
    atLimit,
    nearLimit,
  }
}

export async function canAddMember(workspaceId: string): Promise<LimitCheck> {
  const admin = getSupabaseAdminClient()

  const { data: workspace } = await admin
    .from('workspaces')
    .select('plan')
    .eq('id', workspaceId)
    .single()

  if (workspace?.plan !== 'free') {
    return { allowed: true, count: 0, limit: null, atLimit: false, nearLimit: false }
  }

  const { count } = await admin
    .from('workspace_members')
    .select('user_id', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId)

  const current = count ?? 0
  const atLimit = current >= FREE_MEMBER_LIMIT
  const nearLimit = current >= FREE_MEMBER_LIMIT // limit is small, warn at limit

  return {
    allowed: !atLimit,
    count: current,
    limit: FREE_MEMBER_LIMIT,
    atLimit,
    nearLimit,
  }
}
