'use client'

import { useState } from 'react'
import { Phone, Mail, Users, FileText, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Activity, ActivityType } from '@/types/lead'

const ACTIVITY_CONFIG: Record<
  ActivityType,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }
> = {
  ligacao: { label: 'Ligação', icon: Phone, color: 'text-sky-400', bg: 'bg-sky-500/15 ring-sky-500/30' },
  email: { label: 'E-mail', icon: Mail, color: 'text-violet-400', bg: 'bg-violet-500/15 ring-violet-500/30' },
  reuniao: { label: 'Reunião', icon: Users, color: 'text-amber-400', bg: 'bg-amber-500/15 ring-amber-500/30' },
  nota: { label: 'Nota', icon: FileText, color: 'text-gray-400', bg: 'bg-gray-500/15 ring-gray-500/30' },
}

const TYPES: ActivityType[] = ['ligacao', 'email', 'reuniao', 'nota']

function formatDateTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

let nextActivityId = 100

interface ActivityTimelineProps {
  leadId: string
  initialActivities: Activity[]
}

export function ActivityTimeline({ leadId, initialActivities }: ActivityTimelineProps) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities)
  const [formOpen, setFormOpen] = useState(false)
  const [type, setType] = useState<ActivityType>('ligacao')
  const [description, setDescription] = useState('')
  const [pending, setPending] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!description.trim()) return

    setPending(true)
    // Simulate async save
    setTimeout(() => {
      const newActivity: Activity = {
        id: String(nextActivityId++),
        leadId,
        type,
        description: description.trim(),
        author: 'João Melo',
        occurredAt: new Date().toISOString(),
      }
      setActivities((prev) => [newActivity, ...prev])
      setDescription('')
      setType('ligacao')
      setFormOpen(false)
      setPending(false)
    }, 600)
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Atividades
        </h2>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setFormOpen((v) => !v)}
          className="h-7 gap-1.5 text-xs text-violet-400 hover:bg-violet-500/10 hover:text-violet-300"
        >
          <Plus className="size-3.5" />
          Registrar
        </Button>
      </div>

      {/* Inline form */}
      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 space-y-3 rounded-lg border border-gray-800 bg-gray-800/50 p-4"
        >
          <Select value={type} onValueChange={(v) => setType(v as ActivityType)}>
            <SelectTrigger className="w-40 border-white/10 bg-gray-800 text-sm text-white focus:ring-violet-500/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-gray-700 bg-gray-800">
              {TYPES.map((t) => {
                const cfg = ACTIVITY_CONFIG[t]
                return (
                  <SelectItem key={t} value={t} className="text-white focus:bg-gray-700">
                    <span className="flex items-center gap-2">
                      <cfg.icon className={`size-3.5 ${cfg.color}`} />
                      {cfg.label}
                    </span>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva a atividade…"
            rows={3}
            className="resize-none border-white/10 bg-gray-800 text-sm text-white placeholder-gray-600 focus-visible:ring-violet-500/50"
            required
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setFormOpen(false)}
              className="text-gray-400 hover:bg-gray-700 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={pending || !description.trim()}
              className="bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-50"
            >
              {pending ? (
                <>
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                  Salvando…
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </div>
        </form>
      )}

      {/* Timeline */}
      {activities.length === 0 ? (
        <div className="py-10 text-center text-sm text-gray-600">
          Nenhuma atividade registrada ainda.
        </div>
      ) : (
        <ol className="relative space-y-0">
          {activities.map((activity, idx) => {
            const cfg = ACTIVITY_CONFIG[activity.type]
            const Icon = cfg.icon
            const isLast = idx === activities.length - 1

            return (
              <li key={activity.id} className="relative flex gap-3 pb-6">
                {/* Vertical line */}
                {!isLast && (
                  <div className="absolute left-[14px] top-7 bottom-0 w-px bg-gray-800" />
                )}

                {/* Icon */}
                <div
                  className={`relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ${cfg.bg}`}
                >
                  <Icon className={`size-3.5 ${cfg.color}`} />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-xs font-medium text-gray-300">{cfg.label}</span>
                    <span className="text-xs text-gray-600">por {activity.author}</span>
                    <span className="ml-auto shrink-0 text-xs text-gray-600">
                      {formatDateTime(activity.occurredAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-gray-400">
                    {activity.description}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
