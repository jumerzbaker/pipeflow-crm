'use client'

import { useEffect, useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StatusBadge } from '@/components/leads/StatusBadge'
import { MOCK_OWNERS } from '@/lib/mock/leads'
import type { Lead, LeadStatus } from '@/types/lead'

const STATUSES: LeadStatus[] = [
  'novo',
  'contatado',
  'proposta',
  'negociacao',
  'ganho',
  'perdido',
]

const EMPTY_FORM: Omit<Lead, 'id' | 'createdAt'> = {
  name: '',
  email: '',
  phone: '',
  company: '',
  role: '',
  status: 'novo',
  owner: MOCK_OWNERS[0],
  notes: '',
}

interface LeadSheetProps {
  open: boolean
  onClose: () => void
  lead?: Lead | null
  onSave: (data: Omit<Lead, 'id' | 'createdAt'>) => void
}

export function LeadSheet({ open, onClose, lead, onSave }: LeadSheetProps) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof typeof EMPTY_FORM, string>>>({})

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        role: lead.role,
        status: lead.status,
        owner: lead.owner,
        notes: lead.notes ?? '',
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setErrors({})
  }, [lead, open])

  function validate() {
    const e: typeof errors = {}
    if (!form.name.trim()) e.name = 'Nome é obrigatório'
    if (!form.email.trim()) {
      e.email = 'E-mail é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'E-mail inválido'
    }
    if (!form.company.trim()) e.company = 'Empresa é obrigatória'
    return e
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    onSave(form)
    onClose()
  }

  function set<K extends keyof typeof EMPTY_FORM>(key: K, value: (typeof EMPTY_FORM)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-gray-800 bg-gray-900 p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-gray-800 px-6 py-4">
          <SheetTitle className="text-base font-semibold text-white">
            {lead ? 'Editar Lead' : 'Novo Lead'}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="lead-name" className="text-sm text-gray-300">
                Nome <span className="text-rose-400">*</span>
              </Label>
              <Input
                id="lead-name"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Ex: Maria Silva"
                className="border-white/10 bg-gray-800 text-white placeholder-gray-600 focus-visible:ring-violet-500/50"
              />
              {errors.name && <p className="text-xs text-rose-400">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="lead-email" className="text-sm text-gray-300">
                E-mail <span className="text-rose-400">*</span>
              </Label>
              <Input
                id="lead-email"
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="maria@empresa.com.br"
                className="border-white/10 bg-gray-800 text-white placeholder-gray-600 focus-visible:ring-violet-500/50"
              />
              {errors.email && <p className="text-xs text-rose-400">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="lead-phone" className="text-sm text-gray-300">
                Telefone
              </Label>
              <Input
                id="lead-phone"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="(11) 99999-9999"
                className="border-white/10 bg-gray-800 text-white placeholder-gray-600 focus-visible:ring-violet-500/50"
              />
            </div>

            {/* Company */}
            <div className="space-y-1.5">
              <Label htmlFor="lead-company" className="text-sm text-gray-300">
                Empresa <span className="text-rose-400">*</span>
              </Label>
              <Input
                id="lead-company"
                value={form.company}
                onChange={(e) => set('company', e.target.value)}
                placeholder="Acme Corp"
                className="border-white/10 bg-gray-800 text-white placeholder-gray-600 focus-visible:ring-violet-500/50"
              />
              {errors.company && <p className="text-xs text-rose-400">{errors.company}</p>}
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <Label htmlFor="lead-role" className="text-sm text-gray-300">
                Cargo
              </Label>
              <Input
                id="lead-role"
                value={form.role}
                onChange={(e) => set('role', e.target.value)}
                placeholder="Ex: Diretor de TI"
                className="border-white/10 bg-gray-800 text-white placeholder-gray-600 focus-visible:ring-violet-500/50"
              />
            </div>

            {/* Status + Owner row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm text-gray-300">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => set('status', v as LeadStatus)}
                >
                  <SelectTrigger className="border-white/10 bg-gray-800 text-white focus:ring-violet-500/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800">
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s} className="text-white focus:bg-gray-700">
                        <StatusBadge status={s} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm text-gray-300">Responsável</Label>
                <Select
                  value={form.owner}
                  onValueChange={(v) => { if (v) set('owner', v) }}
                >
                  <SelectTrigger className="border-white/10 bg-gray-800 text-white focus:ring-violet-500/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800">
                    {MOCK_OWNERS.map((o) => (
                      <SelectItem key={o} value={o} className="text-white focus:bg-gray-700">
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="lead-notes" className="text-sm text-gray-300">
                Observações
              </Label>
              <Textarea
                id="lead-notes"
                value={form.notes}
                onChange={(e) => set('notes', e.target.value)}
                placeholder="Informações adicionais sobre o lead…"
                rows={3}
                className="resize-none border-white/10 bg-gray-800 text-white placeholder-gray-600 focus-visible:ring-violet-500/50"
              />
            </div>
          </div>

          <SheetFooter className="border-t border-gray-800 px-6 py-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-gray-400 hover:bg-gray-800 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-violet-600 text-white hover:bg-violet-500"
            >
              {lead ? 'Salvar alterações' : 'Criar lead'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
