'use client'

import { usePathname } from 'next/navigation'
import { Menu, Bell, Search } from 'lucide-react'

const breadcrumbMap: Record<string, string> = {
  dashboard: 'Dashboard',
  leads: 'Leads',
  pipeline: 'Pipeline',
  settings: 'Configurações',
}

interface TopbarProps {
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  const section = segments[0] ?? ''
  const pageTitle = breadcrumbMap[section] ?? section

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-pf-border-subtle bg-pf-surface px-4">
      {/* Mobile menu trigger */}
      <button
        onClick={onMenuClick}
        className="rounded-md p-1.5 text-pf-text-muted transition-colors hover:bg-pf-surface-2 hover:text-pf-text-sec lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="size-4" />
      </button>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono">
        <span className="text-pf-text-muted">PipeFlow</span>
        <span className="text-pf-border">/</span>
        <span className="font-medium text-pf-text">{pageTitle}</span>
      </nav>

      {/* Actions */}
      <div className="ml-auto flex items-center gap-1">
        <button
          className="rounded-md p-1.5 text-pf-text-muted transition-colors hover:bg-pf-surface-2 hover:text-pf-text-sec"
          aria-label="Buscar"
        >
          <Search className="size-4" />
        </button>
        <button
          className="rounded-md p-1.5 text-pf-text-muted transition-colors hover:bg-pf-surface-2 hover:text-pf-text-sec"
          aria-label="Notificações"
        >
          <Bell className="size-4" />
        </button>

        <div className="ml-1 flex size-7 items-center justify-center rounded-full bg-pf-surface-2 border border-pf-border text-pf-text-sec text-[11px] font-bold font-mono">
          JM
        </div>
      </div>
    </header>
  )
}
