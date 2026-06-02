'use server'

import { redirect } from 'next/navigation'
import * as z from 'zod'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { Tables } from '@/types/database'

export type WorkspaceFormState =
  | { errors?: Record<string, string[]>; message?: string }
  | undefined

const CreateWorkspaceSchema = z.object({
  workspaceName: z
    .string()
    .min(2, { message: 'Nome deve ter pelo menos 2 caracteres.' })
    .max(50, { message: 'Nome deve ter no máximo 50 caracteres.' })
    .trim(),
})

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function createWorkspace(
  state: WorkspaceFormState,
  formData: FormData
): Promise<WorkspaceFormState> {
  const result = CreateWorkspaceSchema.safeParse({
    workspaceName: formData.get('workspaceName'),
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const baseSlug = toSlug(result.data.workspaceName)
  const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 7)}`

  const { data: workspace, error: wsError } = await supabase
    .from('workspaces')
    .insert({ name: result.data.workspaceName, slug })
    .select('id')
    .single()

  if (wsError || !workspace) {
    return { errors: { workspaceName: ['Erro ao criar workspace. Tente novamente.'] } }
  }

  const { error: memberError } = await supabase
    .from('workspace_members')
    .insert({ workspace_id: workspace.id, user_id: user.id, role: 'admin' })

  if (memberError) {
    return { errors: { workspaceName: ['Erro ao configurar workspace. Tente novamente.'] } }
  }

  redirect('/dashboard')
}

export async function getUserWorkspaces(): Promise<
  (Tables<'workspaces'> & { role: string })[]
> {
  const supabase = await getSupabaseServerClient()
  const { data } = await supabase
    .from('workspace_members')
    .select('role, workspaces(*)')
    .order('joined_at', { ascending: true })

  if (!data) return []

  return data.map((row) => ({
    ...(row.workspaces as Tables<'workspaces'>),
    role: row.role,
  }))
}
