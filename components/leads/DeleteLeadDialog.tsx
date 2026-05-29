'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Lead } from '@/types/lead'

interface DeleteLeadDialogProps {
  lead: Lead | null
  onClose: () => void
  onConfirm: (id: string) => void
}

export function DeleteLeadDialog({ lead, onClose, onConfirm }: DeleteLeadDialogProps) {
  return (
    <Dialog open={!!lead} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="border-gray-800 bg-gray-900 text-white sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-white">Excluir lead</DialogTitle>
          <DialogDescription className="text-gray-400">
            Tem certeza que deseja excluir{' '}
            <span className="font-medium text-white">{lead?.name}</span>? Essa ação
            não poderá ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (lead) onConfirm(lead.id)
              onClose()
            }}
            className="bg-rose-600 hover:bg-rose-500"
          >
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
