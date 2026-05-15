export type Status = 'backlog' | 'pending' | 'in_progress' | 'review' | 'done'
export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  color: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  title: string
  description: string | null
  project_id: string | null
  assignee_id: string | null
  status: Status
  priority: Priority
  due_date: string | null
  position: number
  created_by: string | null
  created_at: string
  updated_at: string
}

export const STATUS_LABELS: Record<Status, string> = {
  backlog: 'Backlog',
  pending: 'Pendiente',
  in_progress: 'En curso',
  review: 'En revisión',
  done: 'Hecho',
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  urgent: 'Urgente',
}

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'text-slate-400',
  medium: 'text-blue-400',
  high: 'text-amber-400',
  urgent: 'text-red-400',
}

export const ALL_STATUSES: Status[] = ['backlog', 'pending', 'in_progress', 'review', 'done']
