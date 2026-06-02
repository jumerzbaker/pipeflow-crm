'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { WorkspaceProvider, type WorkspaceWithRole } from '@/contexts/WorkspaceContext'

interface AppShellProps {
  children: React.ReactNode
  workspaces: WorkspaceWithRole[]
  initialWorkspace: WorkspaceWithRole | null
}

export function AppShell({ children, workspaces, initialWorkspace }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <WorkspaceProvider workspaces={workspaces} initialWorkspace={initialWorkspace}>
      <div className="flex h-screen overflow-hidden bg-pf-bg">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </WorkspaceProvider>
  )
}
