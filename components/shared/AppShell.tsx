'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { WorkspaceProvider, type WorkspaceWithRole } from '@/contexts/WorkspaceContext'
import { setActiveWorkspaceCookie } from '@/app/actions/workspace'

interface AppShellProps {
  children: React.ReactNode
  workspaces: WorkspaceWithRole[]
  initialWorkspace: WorkspaceWithRole | null
  userName: string
  userEmail: string
}

export function AppShell({ children, workspaces, initialWorkspace, userName, userEmail }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (initialWorkspace) {
      setActiveWorkspaceCookie(initialWorkspace.id)
    }
  }, [initialWorkspace?.id])

  return (
    <WorkspaceProvider workspaces={workspaces} initialWorkspace={initialWorkspace}>
      <div className="flex h-screen overflow-hidden bg-pf-bg">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Topbar onMenuClick={() => setSidebarOpen(true)} userName={userName} userEmail={userEmail} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </WorkspaceProvider>
  )
}
