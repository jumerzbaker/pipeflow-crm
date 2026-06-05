export type LeadStatus =
  | 'novo'
  | 'contatado'
  | 'proposta'
  | 'negociacao'
  | 'ganho'
  | 'perdido'

export type ActivityType = 'ligacao' | 'email' | 'reuniao' | 'nota'

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  role: string
  status: LeadStatus
  ownerId: string
  owner: string
  createdAt: string
  notes?: string
}

export interface Activity {
  id: string
  leadId: string
  type: ActivityType
  description: string
  author: string
  occurredAt: string
}
