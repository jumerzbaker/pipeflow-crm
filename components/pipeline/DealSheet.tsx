'use client'

import { useState, useEffect } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MOCK_LEADS, MOCK_OWNERS } from '@/lib/mock/leads'
import { STAGE_CONFIG } from '@/types/deal'
import type { Deal, DealStage } from '@/types/deal'

type DealFormData = Omit<Deal, 'id'>

interface DealSheetProps {
  open: boolean
  onClose: () => void
  initialStage?: DealStage
  dealToEdit?: Deal
  onSave: (data: DealFormData) => void
}

function getOwnerInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

const EMPTY_FORM = (stage: DealStage): DealFormData => ({
  title: '',
  value: 0,
  leadName: MOCK_LEADS[0].name,
  owner: MOCK_OWNERS[0],
  ownerInitials: getOwnerInitials(MOCK_OWNERS[0]),
  dueDate: '',
  stage,
})

export function DealSheet({ open, onClose, initialStage = 'novo_lead', dealToEdit, onSave }: DealSheetProps) {
  const [form, setForm] = useState<DealFormData>(EMPTY_FORM(initialStage))

  useEffect(() => {
    if (open) {
      setForm(dealToEdit
        ? { title: dealToEdit.title, value: dealToEdit.value, leadName: dealToEdit.leadName, owner: dealToEdit.owner, ownerInitials: dealToEdit.ownerInitials, dueDate: dealToEdit.dueDate, stage: dealToEdit.stage }
        : EMPTY_FORM(initialStage)
      )
    }
  }, [open, initialStage, dealToEdit])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.dueDate) return
    onSave(form)
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{dealToEdit ? 'Editar negócio' : 'Novo negócio'}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="deal-title">Título do negócio</Label>
            <Input
              id="deal-title"
              placeholder="Ex: Contrato Anual — Empresa XYZ"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="deal-value">Valor (R$)</Label>
            <Input
              id="deal-value"
              type="number"
              min={0}
              placeholder="0"
              value={form.value || ''}
              onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Lead vinculado</Label>
            <Select
              value={form.leadName}
              onValueChange={(v) => v && setForm({ ...form, leadName: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MOCK_LEADS.map((lead) => (
                  <SelectItem key={lead.id} value={lead.name}>
                    {lead.name} — {lead.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Responsável</Label>
            <Select
              value={form.owner}
              onValueChange={(v) =>
                v && setForm({ ...form, owner: v, ownerInitials: getOwnerInitials(v) })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MOCK_OWNERS.map((owner) => (
                  <SelectItem key={owner} value={owner}>
                    {owner}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="deal-due">Prazo</Label>
            <Input
              id="deal-due"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Etapa inicial</Label>
            <Select
              value={form.stage}
              onValueChange={(v) => v && setForm({ ...form, stage: v as DealStage })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STAGE_CONFIG.map((s) => (
                  <SelectItem key={s.key} value={s.key}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>

        <SheetFooter className="border-t border-border pt-4">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!form.title.trim() || !form.dueDate}
          >
            {dealToEdit ? 'Salvar alterações' : 'Criar negócio'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
