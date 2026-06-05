'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  SlidersHorizontal,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  UserCircle2,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StatusBadge, STATUS_CONFIG } from '@/components/leads/StatusBadge'
import { LeadSheet } from '@/components/leads/LeadSheet'
import { DeleteLeadDialog } from '@/components/leads/DeleteLeadDialog'
import type { Lead, LeadStatus } from '@/types/lead'

const PAGE_SIZE = 8
const STATUSES: LeadStatus[] = ['novo', 'contatado', 'proposta', 'negociacao', 'ganho', 'perdido']

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

interface LeadsClientProps {
  initialLeads: Lead[]
  members: { id: string; name: string }[]
  workspaceId: string
}

export function LeadsClient({ initialLeads, members, workspaceId }: LeadsClientProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'todos'>('todos')
  const [ownerFilter, setOwnerFilter] = useState<string>('todos')
  const [page, setPage] = useState(1)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return initialLeads.filter((l) => {
      if (q && !l.name.toLowerCase().includes(q) && !l.company.toLowerCase().includes(q)) {
        return false
      }
      if (statusFilter !== 'todos' && l.status !== statusFilter) return false
      if (ownerFilter !== 'todos' && l.ownerId !== ownerFilter) return false
      return true
    })
  }, [initialLeads, search, statusFilter, ownerFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function resetPage() {
    setPage(1)
  }

  function openCreate() {
    setEditingLead(null)
    setSheetOpen(true)
  }

  function openEdit(lead: Lead) {
    setEditingLead(lead)
    setSheetOpen(true)
  }

  function onSuccess() {
    router.refresh()
    setSheetOpen(false)
    setEditingLead(null)
  }

  function onDeleteSuccess() {
    router.refresh()
    setDeletingLead(null)
  }

  const hasFilters = search || statusFilter !== 'todos' || ownerFilter !== 'todos'

  return (
    <div className="space-y-5">
      <PageHeader
        title="Leads"
        subtitle={`${initialLeads.length} contatos cadastrados`}
        action={
          <Button
            onClick={openCreate}
            className="bg-violet-600 text-white hover:bg-violet-500"
          >
            Novo Lead
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage() }}
            placeholder="Buscar por nome ou empresa…"
            className="border-white/10 bg-gray-900 pl-9 text-white placeholder-gray-600 focus-visible:ring-violet-500/50"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(v) => { setStatusFilter(v as LeadStatus | 'todos'); resetPage() }}
        >
          <SelectTrigger className="w-36 border-white/10 bg-gray-900 text-white focus:ring-violet-500/50">
            <SlidersHorizontal className="mr-2 size-3.5 text-gray-500" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800">
            <SelectItem value="todos" className="text-gray-300 focus:bg-gray-700">
              Todos os status
            </SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="text-white focus:bg-gray-700">
                <StatusBadge status={s} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={ownerFilter}
          onValueChange={(v) => { if (v) { setOwnerFilter(v); resetPage() } }}
        >
          <SelectTrigger className="w-36 border-white/10 bg-gray-900 text-white focus:ring-violet-500/50">
            <UserCircle2 className="mr-2 size-3.5 text-gray-500" />
            <SelectValue placeholder="Responsável" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800">
            <SelectItem value="todos" className="text-gray-300 focus:bg-gray-700">
              Todos
            </SelectItem>
            {members.map((m) => (
              <SelectItem key={m.id} value={m.id} className="text-white focus:bg-gray-700">
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setSearch(''); setStatusFilter('todos'); setOwnerFilter('todos'); setPage(1) }}
            className="text-xs text-gray-500 hover:text-white"
          >
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              {['Lead', 'Empresa', 'Status', 'Responsável', 'Criado em', ''].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-600">
                  Nenhum lead encontrado.
                </td>
              </tr>
            ) : (
              paginated.map((lead) => (
                <tr key={lead.id} className="group transition-colors hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/leads/${lead.id}`}
                      className="block font-medium text-white transition-colors hover:text-violet-400"
                    >
                      {lead.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-gray-500">{lead.email}</p>
                  </td>

                  <td className="px-4 py-3">
                    <p className="text-gray-200">{lead.company}</p>
                    {lead.role && (
                      <p className="mt-0.5 text-xs text-gray-500">{lead.role}</p>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge status={lead.status} />
                  </td>

                  <td className="px-4 py-3 text-gray-400">{lead.owner}</td>

                  <td className="px-4 py-3 text-gray-500">{formatDate(lead.createdAt)}</td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => openEdit(lead)}
                        className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-700 hover:text-white"
                        title="Editar"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingLead(lead)}
                        className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-700 hover:text-rose-400"
                        title="Excluir"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {filtered.length} lead{filtered.length !== 1 ? 's' : ''} • Página {currentPage} de{' '}
            {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="size-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`flex size-7 items-center justify-center rounded-md text-xs font-medium transition-colors ${
                  p === currentPage
                    ? 'bg-violet-600 text-white'
                    : 'text-gray-500 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-30"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      <LeadSheet
        open={sheetOpen}
        onClose={() => { setSheetOpen(false); setEditingLead(null) }}
        lead={editingLead}
        members={members}
        workspaceId={workspaceId}
        onSuccess={onSuccess}
      />

      <DeleteLeadDialog
        lead={deletingLead}
        onClose={() => setDeletingLead(null)}
        workspaceId={workspaceId}
        onSuccess={onDeleteSuccess}
      />
    </div>
  )
}
