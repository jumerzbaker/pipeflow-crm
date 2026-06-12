'use server'

import { revalidatePath } from 'next/cache'
import * as z from 'zod'
import { getSupabaseServerClient, getSupabaseAdminClient } from '@/lib/supabase/server'
import type { Lead, LeadStatus } from '@/types/lead'
import { canAddLead } from '@/lib/limits'

// ── Schema ────────────────────────────────────────────────────────────────────

const LeadSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').trim(),
  email: z.string().email('E-mail inválido').or(z.literal('')).optional(),
  phone: z.string().optional(),
  company: z.string().min(1, 'Empresa é obrigatória').trim(),
  role: z.string().optional(),
  status: z.enum(['novo', 'contatado', 'proposta', 'negociacao', 'ganho', 'perdido']),
  owner_id: z.string().uuid().nullable().optional(),
  notes: z.string().optional(),
})

export type LeadFormData = z.infer<typeof LeadSchema>
export type LeadActionResult = { error?: string }

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getAuthedUser() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  return user
}

async function assertMembership(admin: ReturnType<typeof getSupabaseAdminClient>, workspaceId: string, userId: string) {
  const { data } = await admin
    .from('workspace_members')
    .select('user_id')
    .eq('workspace_id', workspaceId)
    .eq('user_id', userId)
    .maybeSingle()
  if (!data) throw new Error('Forbidden')
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

export async function getLeads(workspaceId: string): Promise<Lead[]> {
  await getAuthedUser()

  const admin = getSupabaseAdminClient()
  const { data, error } = await admin
    .from('leads')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })

  if (error || !data) return []

  const nameMap = await batchResolveNames(data.map((r) => r.owner_id))

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email ?? '',
    phone: row.phone ?? '',
    company: row.company ?? '',
    role: row.role ?? '',
    status: row.status as LeadStatus,
    ownerId: row.owner_id ?? '',
    owner: row.owner_id ? (nameMap.get(row.owner_id) ?? '') : '',
    notes: row.notes ?? '',
    createdAt: row.created_at.split('T')[0],
  }))
}

export async function getLeadById(
  workspaceId: string,
  leadId: string,
): Promise<Lead | null> {
  await getAuthedUser()

  const admin = getSupabaseAdminClient()
  const { data, error } = await admin
    .from('leads')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('id', leadId)
    .single()

  if (error || !data) return null

  const nameMap = await batchResolveNames([data.owner_id])

  return {
    id: data.id,
    name: data.name,
    email: data.email ?? '',
    phone: data.phone ?? '',
    company: data.company ?? '',
    role: data.role ?? '',
    status: data.status as LeadStatus,
    ownerId: data.owner_id ?? '',
    owner: data.owner_id ? (nameMap.get(data.owner_id) ?? '') : '',
    notes: data.notes ?? '',
    createdAt: data.created_at.split('T')[0],
  }
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export async function createLead(
  workspaceId: string,
  formData: LeadFormData,
): Promise<LeadActionResult> {
  const user = await getAuthedUser()
  const parsed = LeadSchema.safeParse(formData)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const admin = getSupabaseAdminClient()
  await assertMembership(admin, workspaceId, user.id)

  const limit = await canAddLead(workspaceId)
  if (!limit.allowed) {
    return {
      error: `Limite de ${limit.limit} leads atingido no plano Free. Faça upgrade para o Pro em Configurações › Billing.`,
    }
  }

  const { error } = await admin.from('leads').insert({
    workspace_id: workspaceId,
    owner_id: parsed.data.owner_id ?? user.id,
    name: parsed.data.name,
    email: parsed.data.email || null,
    phone: parsed.data.phone || null,
    company: parsed.data.company,
    role: parsed.data.role || null,
    status: parsed.data.status,
    notes: parsed.data.notes || null,
  })

  if (error) return { error: 'Erro ao criar lead.' }
  revalidatePath('/leads')
  revalidatePath('/dashboard')
  return {}
}

export async function updateLead(
  workspaceId: string,
  leadId: string,
  formData: LeadFormData,
): Promise<LeadActionResult> {
  const user = await getAuthedUser()
  const parsed = LeadSchema.safeParse(formData)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const admin = getSupabaseAdminClient()
  await assertMembership(admin, workspaceId, user.id)
  const { error } = await admin
    .from('leads')
    .update({
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      company: parsed.data.company,
      role: parsed.data.role || null,
      status: parsed.data.status,
      owner_id: parsed.data.owner_id ?? null,
      notes: parsed.data.notes || null,
    })
    .eq('id', leadId)
    .eq('workspace_id', workspaceId)

  if (error) return { error: 'Erro ao atualizar lead.' }
  revalidatePath('/leads')
  revalidatePath(`/leads/${leadId}`)
  revalidatePath('/dashboard')
  return {}
}

export async function deleteLead(
  workspaceId: string,
  leadId: string,
): Promise<LeadActionResult> {
  const user = await getAuthedUser()

  const admin = getSupabaseAdminClient()
  await assertMembership(admin, workspaceId, user.id)
  const { error } = await admin
    .from('leads')
    .delete()
    .eq('id', leadId)
    .eq('workspace_id', workspaceId)

  if (error) return { error: 'Erro ao excluir lead.' }
  revalidatePath('/leads')
  revalidatePath('/dashboard')
  return {}
}
