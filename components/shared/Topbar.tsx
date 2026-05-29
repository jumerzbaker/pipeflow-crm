'use client'

import { usePathname } from 'next/navigation'
import { Menu, Bell, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-gray-800 bg-gray-900 px-4">
      {/* Mobile menu trigger */}
      <button
        onClick={onMenuClick}
        className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-300 lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="size-4" />
      </button>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs">
        <span className="text-gray-500">PipeFlow</span>
        <span className="text-gray-700">/</span>
        <span className="font-medium text-white">{pageTitle}</span>
      </nav>

      {/* Actions */}
      <div className="ml-auto flex items-center gap-1">
        <button
          className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-300"
          aria-label="Buscar"
        >
          <Search className="size-4" />
        </button>
        <button
          className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-300"
          aria-label="Notificações"
        >
          <Bell className="size-4" />
        </button>

        <div className="ml-1 flex size-7 items-center justify-center rounded-full bg-violet-600 text-white text-[11px] font-bold">
          JM
        </div>
      </div>
    </header>
  )
}
