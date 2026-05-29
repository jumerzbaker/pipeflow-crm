'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Kanban,
  Settings,
  ChevronDown,
  X,
  Check,
  Plus,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const workspaceColors = [
  'bg-[#5b7fff]',
  'bg-[#2ed573]',
  'bg-[#ff6b35]',
  'bg-[#00b4d8]',
] as const

const workspaces = [
  { id: '1', name: 'Acme Corp', plan: 'Pro', colorIdx: 0 },
  { id: '2', name: 'Globex Inc.', plan: 'Free', colorIdx: 1 },
]

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leads', label: 'Leads', icon: Users },
  { href: '/pipeline', label: 'Pipeline', icon: Kanban },
  { href: '/settings', label: 'Configurações', icon: Settings },
]

const mockUser = {
  name: 'João Melo',
  email: 'joao@acme.com',
  initials: 'JM',
}

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [activeWorkspace, setActiveWorkspace] = useState(workspaces[0])
  const [switcherOpen, setSwitcherOpen] = useState(false)

  function handleWorkspaceSelect(ws: (typeof workspaces)[0]) {
    setActiveWorkspace(ws)
    setSwitcherOpen(false)
  }

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-pf-surface transition-transform duration-300 ease-in-out',
          'border-r border-pf-border-subtle',
          'lg:static lg:translate-x-0 lg:z-auto',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* ── Logo ─────────────────────────────────────────────── */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-pf-border-subtle px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-md bg-pf-accent text-[0.7rem] font-bold tracking-tight text-pf-accent-fg"
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              P
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-pf-text" style={{ fontFamily: 'var(--font-syne)' }}>
                PipeFlow
              </span>
              <span className="text-[10px] font-normal text-pf-text-muted" style={{ fontFamily: 'var(--font-syne)' }}>
                CRM
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-pf-text-muted transition-colors hover:bg-pf-surface-2 hover:text-pf-text-sec lg:hidden"
            aria-label="Fechar menu"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* ── Workspace switcher ───────────────────────────────── */}
        <div className="relative shrink-0 border-b border-pf-border-subtle p-2">
          <button
            onClick={() => setSwitcherOpen(!switcherOpen)}
            className={cn(
              'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 transition-colors',
              switcherOpen
                ? 'bg-pf-surface-2 text-pf-text'
                : 'text-pf-text-sec hover:bg-pf-surface-2 hover:text-pf-text',
            )}
          >
            <div
              className={cn(
                'flex size-6 shrink-0 items-center justify-center rounded text-white text-[11px] font-bold',
                workspaceColors[activeWorkspace.colorIdx],
              )}
            >
              {activeWorkspace.name[0]}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-xs font-medium text-pf-text leading-none">
                {activeWorkspace.name}
              </p>
              <p className="mt-0.5 text-[10px] text-pf-text-muted leading-none font-mono">
                Plano {activeWorkspace.plan}
              </p>
            </div>
            <ChevronDown
              className={cn(
                'size-3.5 shrink-0 text-pf-text-muted transition-transform duration-200',
                switcherOpen && 'rotate-180',
              )}
            />
          </button>

          {/* Dropdown */}
          {switcherOpen && (
            <div className="absolute left-2 right-2 top-full z-20 mt-1 overflow-hidden rounded-lg border border-pf-border bg-pf-surface-2 shadow-xl shadow-black/40">
              <div className="p-1">
                <p className="px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wider text-pf-text-muted font-mono">
                  Workspaces
                </p>
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => handleWorkspaceSelect(ws)}
                    className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 transition-colors hover:bg-pf-border"
                  >
                    <div
                      className={cn(
                        'flex size-6 shrink-0 items-center justify-center rounded text-white text-[11px] font-bold',
                        workspaceColors[ws.colorIdx],
                      )}
                    >
                      {ws.name[0]}
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="truncate text-xs font-medium text-pf-text">
                        {ws.name}
                      </p>
                      <p className="text-[10px] text-pf-text-muted font-mono">
                        Plano {ws.plan}
                      </p>
                    </div>
                    {ws.id === activeWorkspace.id && (
                      <Check className="size-3.5 shrink-0 text-pf-accent" />
                    )}
                  </button>
                ))}
              </div>
              <div className="border-t border-pf-border-subtle p-1">
                <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-xs text-pf-text-sec transition-colors hover:bg-pf-border hover:text-pf-text">
                  <Plus className="size-3.5 shrink-0" />
                  Novo workspace
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Navigation ──────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium transition-colors',
                      active
                        ? 'bg-[color-mix(in_srgb,#caff33_10%,transparent)] text-pf-accent'
                        : 'text-pf-text-sec hover:bg-pf-surface-2 hover:text-pf-text',
                    )}
                  >
                    <item.icon
                      className={cn(
                        'size-4 shrink-0',
                        active ? 'text-pf-accent' : 'text-pf-text-muted',
                      )}
                    />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* ── User footer ─────────────────────────────────────── */}
        <div className="shrink-0 border-t border-pf-border-subtle p-2">
          <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 transition-colors hover:bg-pf-surface-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-pf-surface-2 border border-pf-border text-pf-text-sec text-xs font-bold font-mono">
              {mockUser.initials}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-xs font-medium text-pf-text">
                {mockUser.name}
              </p>
              <p className="truncate text-[10px] text-pf-text-muted font-mono">
                {mockUser.email}
              </p>
            </div>
          </button>
        </div>
      </aside>
    </>
  )
}
