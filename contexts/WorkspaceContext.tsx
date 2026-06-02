'use client'

import { createContext, useContext, useState } from 'react'
import type { Tables } from '@/types/database'

export type WorkspaceWithRole = Tables<'workspaces'> & { role: string }

interface WorkspaceContextValue {
  workspaces: WorkspaceWithRole[]
  activeWorkspace: WorkspaceWithRole | null
  setActiveWorkspace: (workspace: WorkspaceWithRole) => void
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function WorkspaceProvider({
  children,
  workspaces,
  initialWorkspace,
}: {
  children: React.ReactNode
  workspaces: WorkspaceWithRole[]
  initialWorkspace: WorkspaceWithRole | null
}) {
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceWithRole | null>(
    initialWorkspace
  )

  return (
    <WorkspaceContext.Provider value={{ workspaces, activeWorkspace, setActiveWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) throw new Error('useWorkspace must be used inside WorkspaceProvider')
  return ctx
}
