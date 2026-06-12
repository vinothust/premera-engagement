// Shared RAG status model for all status-reporting slides.

export type StatusKey =
  | 'onTrack'
  | 'atRisk'
  | 'complete'
  | 'delayed'
  | 'notStarted'

export interface StatusMeta {
  key: StatusKey
  label: string
  color: string
}

export const STATUS: Record<StatusKey, StatusMeta> = {
  onTrack: { key: 'onTrack', label: 'On Track', color: '#1aa260' },
  atRisk: { key: 'atRisk', label: 'At Risk', color: '#f2b705' },
  complete: { key: 'complete', label: 'Complete', color: '#8e44ad' },
  delayed: { key: 'delayed', label: 'Delayed', color: '#e0392b' },
  notStarted: { key: 'notStarted', label: 'Not Started', color: '#b0b6bd' },
}

export const LEGEND_ORDER: StatusKey[] = [
  'onTrack',
  'atRisk',
  'complete',
  'delayed',
  'notStarted',
]
