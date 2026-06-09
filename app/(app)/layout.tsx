import { redirect } from 'next/navigation'
import { AppShell } from '@/components/shared/AppShell'
import { getUserWorkspaces } from '@/app/actions/workspace'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const workspaces = await getUserWorkspaces()

  if (workspaces.length === 0) redirect('/no-workspace')

  const userName = (user.user_metadata?.full_name as string | undefined) || user.email || 'Usuário'
  const userEmail = user.email ?? ''

  return (
    <AppShell
      workspaces={workspaces}
      initialWorkspace={workspaces[0]}
      userName={userName}
      userEmail={userEmail}
    >
      {children}
    </AppShell>
  )
}
