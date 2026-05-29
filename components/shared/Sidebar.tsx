'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Kanban, Settings, ChevronDown, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const workspaces = [
  { id: '1', name: 'Acme Corp', initial: 'A' },
  { id: '2', name: 'Globex', initial: 'G' },
]

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leads', label: 'Leads', icon: Users },
  { href: '/pipeline', label: 'Pipeline', icon: Kanban },
  { href: '/settings', label: 'Configurações', icon: Settings },
]

const mockUser = { name: 'João Melo', email: 'joao@acme.com', initials: 'JM' }

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [activeWorkspace, setActiveWorkspace] = useState(workspaces[0])
  const [switcherOpen, setSwitcherOpen] = useState(false)

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-gray-900 transition-transform duration-200',
          'lg:static lg:translate-x-0 lg:z-auto',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-800 px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-brand text-brand-foreground text-sm font-bold">
              P
            </div>
            <span className="text-base font-semibold text-white">PipeFlow</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 transition-colors hover:text-white lg:hidden"
            aria-label="Fechar menu"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Workspace switcher */}
        <div className="relative shrink-0 border-b border-gray-800 px-3 py-3">
          <button
            onClick={() => setSwitcherOpen(!switcherOpen)}
            className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <div className="flex size-7 shrink-0 items-center justify-center rounded bg-brand text-brand-foreground text-xs font-bold">
              {activeWorkspace.initial}
            </div>
            <span className="flex-1 truncate text-left text-sm font-medium">
              {activeWorkspace.name}
            </span>
            <ChevronDown
              className={cn(
                'size-4 shrink-0 text-gray-500 transition-transform',
                switcherOpen && 'rotate-180',
              )}
            />
          </button>

          {switcherOpen && (
            <div className="absolute left-3 right-3 top-full z-10 mt-1 rounded-md border border-gray-700 bg-gray-800 py-1 shadow-lg">
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    setActiveWorkspace(ws)
                    setSwitcherOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700 hover:text-white',
                    ws.id === activeWorkspace.id && 'bg-gray-700 text-white',
                  )}
                >
                  <div className="flex size-6 shrink-0 items-center justify-center rounded bg-brand text-brand-foreground text-xs font-bold">
                    {ws.initial}
                  </div>
                  {ws.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-brand text-brand-foreground'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                    )}
                  >
                    <item.icon className="size-5 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User */}
        <div className="shrink-0 border-t border-gray-800 px-3 py-4">
          <div className="flex items-center gap-3 rounded-md px-2 py-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground text-xs font-bold">
              {mockUser.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{mockUser.name}</p>
              <p className="truncate text-xs text-gray-500">{mockUser.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
