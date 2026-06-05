'use server'

import { revalidatePath } from 'next/cache'
import * as z from 'zod'
import { getSupabaseServerClient, getSupabaseAdminClient } from '@/lib/supabase/server'
import type { Deal, DealStage } from '@/types/deal'

// ── Schema ────────────────────────────────────────────────────────────────────

const DealSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').trim(),
  value: z.number().min(0),
  stage: z.enum([
    'novo_lead',
    'contato_realizado',
    'proposta_enviada',
    'negociacao',
    'fechado_ganho',
    'fechado_perdido',
  ]),
  lead_id: z.string().uuid().nullable().optional(),
  owner_id: z.string().uuid().nullable().optional(),
  due_date: z.string().nullable().optional(),
  position: z.number().optional(),
})

export type DealFormData = z.infer<typeof DealSchema>
export type DealActionResult = { error?: string; id?: string }

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getAuthedUser() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  return user
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

async function batchResolveNames(
  userIds: (string | null)[],
): Promise<Map<string, string>> {
  const ids = [...new Set(userIds.filter(Boolean) as string[])]
  if (!ids.length) return new Map()

  const admin = getSupabaseAdminClient()
  const { data: { users } } = await admin.auth.admin.listUsers({ perPage: 1000 })

  const map = new Map<string, string>()
  for (const u of users) {
    if (ids.includes(u.id)) {
      map.set(u.id, (u.user_metadata?.full_name as string) || u.email || 'Usuário')
    }
  }
  return map
}

// ── Queries ───────────────────────────────────────────────────────────────────

export async function getDeals(workspaceId: string): Promise<Deal[]> {
  await getAuthedUser()

  const admin = getSupabaseAdminClient()
  const { data: rows, error } = await admin
    .from('deals')
    .select('*, leads(name)')
    .eq('workspace_id', workspaceId)
    .order('stage')
    .order('position')

  if (error || !rows) return []

  const ownerIds = rows.map((r) => r.owner_id)
  const nameMap = await batchResolveNames(ownerIds)

  return rows.map((row) => {
    const ownerName = row.owner_id ? (nameMap.get(row.owner_id) ?? '') : ''
    const leadRow = row.leads as { name: string } | null
    return {
      id: row.id,
      title: row.title,
      value: row.value,
      stage: row.stage as DealStage,
      position: row.position,
      leadId: row.lead_id,
      leadName: leadRow?.name ?? '',
      ownerId: row.owner_id,
      owner: ownerName,
      ownerInitials: ownerName ? getInitials(ownerName) : '?',
      dueDate: row.due_date ?? '',
    }
  })
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export async function createDeal(
  workspaceId: string,
  formData: DealFormData,
): Promise<DealActionResult> {
  const user = await getAuthedUser()
  const parsed = DealSchema.safeParse(formData)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const admin = getSupabaseAdminClient()

  // position = max in that stage + 1
  const { data: existing } = await admin
    .from('deals')
    .select('position')
    .eq('workspace_id', workspaceId)
    .eq('stage', parsed.data.stage)
    .order('position', { ascending: false })
    .limit(1)

  const position = existing?.[0] ? existing[0].position + 1 : 0

  const { data, error } = await admin
    .from('deals')
    .insert({
      workspace_id: workspaceId,
      owner_id: parsed.data.owner_id ?? user.id,
      lead_id: parsed.data.lead_id ?? null,
      title: parsed.data.title,
      value: parsed.data.value,
      stage: parsed.data.stage,
      due_date: parsed.data.due_date || null,
      position,
    })
    .select('id')
    .single()

  if (error || !data) return { error: 'Erro ao criar negócio.' }
  revalidatePath('/pipeline')
  revalidatePath('/dashboard')
  return { id: data.id }
}

export async function updateDeal(
  workspaceId: string,
  dealId: string,
  formData: DealFormData,
): Promise<DealActionResult> {
  await getAuthedUser()
  const parsed = DealSchema.safeParse(formData)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const admin = getSupabaseAdminClient()
  const { error } = await admin
    .from('deals')
    .update({
      title: parsed.data.title,
      value: parsed.data.value,
      stage: parsed.data.stage,
      lead_id: parsed.data.lead_id ?? null,
      owner_id: parsed.data.owner_id ?? null,
      due_date: parsed.data.due_date || null,
    })
    .eq('id', dealId)
    .eq('workspace_id', workspaceId)

  if (error) return { error: 'Erro ao atualizar negócio.' }
  revalidatePath('/pipeline')
  revalidatePath('/dashboard')
  return {}
}

export async function updateDealStage(
  workspaceId: string,
  dealId: string,
  stage: DealStage,
  position: number,
): Promise<DealActionResult> {
  await getAuthedUser()

  const admin = getSupabaseAdminClient()
  const { error } = await admin
    .from('deals')
    .update({ stage, position })
    .eq('id', dealId)
    .eq('workspace_id', workspaceId)

  if (error) return { error: 'Erro ao mover negócio.' }
  revalidatePath('/pipeline')
  revalidatePath('/dashboard')
  return {}
}

export async function deleteDeal(
  workspaceId: string,
  dealId: string,
): Promise<DealActionResult> {
  await getAuthedUser()

  const admin = getSupabaseAdminClient()
  const { error } = await admin
    .from('deals')
    .delete()
    .eq('id', dealId)
    .eq('workspace_id', workspaceId)

  if (error) return { error: 'Erro ao excluir negócio.' }
  revalidatePath('/pipeline')
  revalidatePath('/dashboard')
  return {}
}
