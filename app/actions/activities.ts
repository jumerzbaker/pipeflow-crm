'use server'

import { revalidatePath } from 'next/cache'
import * as z from 'zod'
import { getSupabaseServerClient, getSupabaseAdminClient } from '@/lib/supabase/server'
import type { Activity, ActivityType } from '@/types/lead'

const ActivitySchema = z.object({
  type: z.enum(['ligacao', 'email', 'reuniao', 'nota']),
  description: z.string().min(1, 'Descrição é obrigatória').trim(),
  occurred_at: z.string(),
})

export type ActivityFormData = z.infer<typeof ActivitySchema>
export type ActivityActionResult = { error?: string }

async function getAuthedUser() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  return user
}

export async function getActivities(
  workspaceId: string,
  leadId: string,
): Promise<Activity[]> {
  await getAuthedUser()

  const admin = getSupabaseAdminClient()
  const { data, error } = await admin
    .from('activities')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('lead_id', leadId)
    .order('occurred_at', { ascending: false })

  if (error || !data) return []

  const authorIds = [...new Set(data.map((r) => r.author_id).filter(Boolean) as string[])]
  const nameMap = new Map<string, string>()

  if (authorIds.length) {
    const { data: { users } } = await admin.auth.admin.listUsers({ perPage: 1000 })
    for (const u of users) {
      if (authorIds.includes(u.id)) {
        nameMap.set(u.id, (u.user_metadata?.full_name as string) || u.email || 'Usuário')
      }
    }
  }

  return data.map((row) => ({
    id: row.id,
    leadId: row.lead_id ?? leadId,
    type: row.type as ActivityType,
    description: row.description,
    author: row.author_id ? (nameMap.get(row.author_id) ?? 'Usuário') : 'Usuário',
    occurredAt: row.occurred_at,
  }))
}

export async function createActivity(
  workspaceId: string,
  leadId: string,
  formData: ActivityFormData,
): Promise<ActivityActionResult> {
  const user = await getAuthedUser()
  const parsed = ActivitySchema.safeParse(formData)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const admin = getSupabaseAdminClient()
  const { error } = await admin.from('activities').insert({
    workspace_id: workspaceId,
    lead_id: leadId,
    author_id: user.id,
    type: parsed.data.type,
    description: parsed.data.description,
    occurred_at: parsed.data.occurred_at,
  })

  if (error) return { error: 'Erro ao registrar atividade.' }
  revalidatePath(`/leads/${leadId}`)
  return {}
}
