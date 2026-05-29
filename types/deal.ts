export type DealStage =
  | 'novo_lead'
  | 'contato_realizado'
  | 'proposta_enviada'
  | 'negociacao'
  | 'fechado_ganho'
  | 'fechado_perdido'

export interface Deal {
  id: string
  title: string
  value: number
  leadName: string
  owner: string
  ownerInitials: string
  dueDate: string
  stage: DealStage
}

export interface StageConfig {
  key: DealStage
  label: string
  color: string
  dimColor: string
}

export const STAGE_CONFIG: StageConfig[] = [
  {
    key: 'novo_lead',
    label: 'Novo Lead',
    color: '#5B7FFF',
    dimColor: 'rgba(91,127,255,0.08)',
  },
  {
    key: 'contato_realizado',
    label: 'Contato Realizado',
    color: '#00B4D8',
    dimColor: 'rgba(0,180,216,0.08)',
  },
  {
    key: 'proposta_enviada',
    label: 'Proposta Enviada',
    color: '#CAFF33',
    dimColor: 'rgba(202,255,51,0.08)',
  },
  {
    key: 'negociacao',
    label: 'Negociação',
    color: '#FF6B35',
    dimColor: 'rgba(255,107,53,0.08)',
  },
  {
    key: 'fechado_ganho',
    label: 'Fechado Ganho',
    color: '#2ED573',
    dimColor: 'rgba(46,213,115,0.08)',
  },
  {
    key: 'fechado_perdido',
    label: 'Fechado Perdido',
    color: '#FF4757',
    dimColor: 'rgba(255,71,87,0.08)',
  },
]
