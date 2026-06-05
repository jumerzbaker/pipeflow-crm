'use client'

import { useState, useEffect, useTransition } from 'react'
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
import { Loader2 } from 'lucide-react'
import { createDeal, updateDeal } from '@/app/actions/deals'
import { STAGE_CONFIG } from '@/types/deal'
import type { Deal, DealStage } from '@/types/deal'

interface AvailableLead {
  id: string
  name: string
  company: string
}

interface Member {
  id: string
  name: string
}

interface DealFormState {
  title: string
  value: number | ''
  leadId: string
  ownerId: string
  dueDate: string
  stage: DealStage
}

interface DealSheetProps {
  open: boolean
  onClose: () => void
  initialStage?: DealStage
  dealToEdit?: Deal
  availableLeads: AvailableLead[]
  members: Member[]
  workspaceId: string
  onSuccess: () => void
}

export function DealSheet({
  open,
  onClose,
  initialStage = 'novo_lead',
  dealToEdit,
  availableLeads,
  members,
  workspaceId,
  onSuccess,
}: DealSheetProps) {
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState('')

  const emptyForm = (stage: DealStage): DealFormState => ({
    title: '',
    value: '',
    leadId: availableLeads[0]?.id ?? '',
    ownerId: members[0]?.id ?? '',
    dueDate: '',
    stage,
  })

  const [form, setForm] = useState<DealFormState>(emptyForm(initialStage))

  useEffect(() => {
    if (open) {
      setServerError('')
      setForm(
        dealToEdit
          ? {
              title: dealToEdit.title,
              value: dealToEdit.value,
              leadId: dealToEdit.leadId ?? availableLeads[0]?.id ?? '',
              ownerId: dealToEdit.ownerId ?? members[0]?.id ?? '',
              dueDate: dealToEdit.dueDate,
              stage: dealToEdit.stage,
            }
          : emptyForm(initialStage),
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialStage, dealToEdit])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.dueDate) return

    const payload = {
      title: form.title.trim(),
      value: Number(form.value) || 0,
      stage: form.stage,
      lead_id: form.leadId || null,
      owner_id: form.ownerId || null,
      due_date: form.dueDate || null,
    }

    startTransition(async () => {
      const result = dealToEdit
        ? await updateDeal(workspaceId, dealToEdit.id, payload)
        : await createDeal(workspaceId, payload)

      if (result.error) {
        setServerError(result.error)
      } else {
        onSuccess()
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{dealToEdit ? 'Editar negócio' : 'Novo negócio'}</SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-2"
        >
          {serverError && (
            <p className="rounded-md bg-rose-500/10 px-3 py-2 text-xs text-rose-400">
              {serverError}
            </p>
          )}

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
              value={form.value}
              onChange={(e) =>
                setForm({ ...form, value: e.target.value === '' ? '' : Number(e.target.value) })
              }
            />
          </div>

          {availableLeads.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <Label>Lead vinculado</Label>
              <Select
                value={form.leadId}
                onValueChange={(v) => v && setForm({ ...form, leadId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar lead" />
                </SelectTrigger>
                <SelectContent>
                  {availableLeads.map((lead) => (
                    <SelectItem key={lead.id} value={lead.id}>
                      {lead.name} — {lead.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {members.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <Label>Responsável</Label>
              <Select
                value={form.ownerId}
                onValueChange={(v) => v && setForm({ ...form, ownerId: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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
          <Button variant="ghost" onClick={onClose} type="button" disabled={isPending}>
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isPending || !form.title.trim() || !form.dueDate}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                Salvando…
              </>
            ) : dealToEdit ? (
              'Salvar alterações'
            ) : (
              'Criar negócio'
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
