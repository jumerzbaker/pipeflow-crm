'use client'

import { useTransition } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { deleteLead } from '@/app/actions/leads'
import type { Lead } from '@/types/lead'

interface DeleteLeadDialogProps {
  lead: Lead | null
  onClose: () => void
  workspaceId: string
  onSuccess: () => void
}

export function DeleteLeadDialog({ lead, onClose, workspaceId, onSuccess }: DeleteLeadDialogProps) {
  const [isPending, startTransition] = useTransition()

  function handleConfirm() {
    if (!lead) return
    startTransition(async () => {
      await deleteLead(workspaceId, lead.id)
      onSuccess()
    })
  }

  return (
    <Dialog open={!!lead} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="border-gray-800 bg-gray-900 text-white sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-white">Excluir lead</DialogTitle>
          <DialogDescription className="text-gray-400">
            Tem certeza que deseja excluir{' '}
            <span className="font-medium text-white">{lead?.name}</span>? Essa ação não poderá
            ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isPending}
            className="text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
            className="bg-rose-600 hover:bg-rose-500"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                Excluindo…
              </>
            ) : (
              'Excluir'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
