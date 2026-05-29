'use client'

import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'

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
    <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-white px-4 lg:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="size-5" />
      </button>

      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-sm">
          <li className="font-semibold text-gray-900">{pageTitle}</li>
        </ol>
      </nav>

      <div className="ml-auto">
        <div
          className="flex size-8 items-center justify-center rounded-full bg-brand text-brand-foreground text-xs font-bold"
          aria-label="Perfil de João Melo"
        >
          JM
        </div>
      </div>
    </header>
  )
}
