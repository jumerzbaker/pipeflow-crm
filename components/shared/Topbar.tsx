'use client'

import { usePathname } from 'next/navigation'
import { Menu, Bell, Search, LogOut, Settings } from 'lucide-react'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import { useState } from 'react'

const breadcrumbMap: Record<string, string> = {
  dashboard: 'Dashboard',
  leads: 'Leads',
  pipeline: 'Pipeline',
  settings: 'Configurações',
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('')
}

interface TopbarProps {
  onMenuClick: () => void
  userName: string
  userEmail: string
}

export function Topbar({ onMenuClick, userName, userEmail }: TopbarProps) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
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

        {/* User avatar + dropdown */}
        <div className="relative ml-1">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            title={`${userName} — ${userEmail}`}
            className="flex size-7 items-center justify-center rounded-full bg-pf-surface-2 border border-pf-border text-pf-text-sec text-[11px] font-bold font-mono transition-colors hover:border-pf-accent/40"
          >
            {initials(userName) || '?'}
          </button>

          {menuOpen && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-9 z-50 w-52 rounded-xl border border-pf-border bg-pf-surface shadow-xl">
                {/* User info */}
                <div className="border-b border-pf-border px-3 py-2.5">
                  <p className="truncate text-xs font-medium text-pf-text">{userName}</p>
                  <p className="truncate text-[11px] text-pf-text-muted">{userEmail}</p>
                </div>
                {/* Links */}
                <div className="p-1">
                  <Link
                    href="/settings?tab=conta"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-pf-text-muted transition-colors hover:bg-pf-surface-2 hover:text-pf-text"
                  >
                    <Settings className="size-3.5" />
                    Minha conta
                  </Link>
                  <form action={logout}>
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-pf-text-muted transition-colors hover:bg-pf-surface-2 hover:text-pf-text"
                    >
                      <LogOut className="size-3.5" />
                      Sair
                    </button>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
