'use client'

import { useState } from 'react'
import { Task, Project, Profile, Status, Priority, STATUS_LABELS, PRIORITY_LABELS, ALL_STATUSES } from '@/lib/types'

interface TaskModalProps {
  task?: Task | null
  projects: Project[]
  profiles: Profile[]
  defaultStatus?: Status
  onClose: () => void
  onCreate?: (data: Partial<Task>) => Promise<void>
  onUpdate?: (id: string, data: Partial<Task>) => Promise<void>
  onDelete?: (id: string) => Promise<void>
}

export function TaskModal({
  task,
  projects,
  profiles,
  defaultStatus = 'backlog',
  onClose,
  onCreate,
  onUpdate,
  onDelete,
}: TaskModalProps) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [projectId, setProjectId] = useState(task?.project_id ?? '')
  const [assigneeId, setAssigneeId] = useState(task?.assignee_id ?? '')
  const [status, setStatus] = useState<Status>(task?.status ?? defaultStatus)
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'medium')
  const [dueDate, setDueDate] = useState(task?.due_date ?? '')
  const [loading, setLoading] = useState(false)

  const isEditing = !!task

  const handleSubmit = async () => {
    if (!title.trim()) return
    setLoading(true)
    try {
      const data: Partial<Task> = {
        title: title.trim(),
        description: description.trim() || null,
        project_id: projectId || null,
        assignee_id: assigneeId || null,
        status,
        priority,
        due_date: dueDate || null,
      }
      if (isEditing && onUpdate) {
        await onUpdate(task.id, data)
      } else if (onCreate) {
        await onCreate(data)
      }
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!task || !onDelete) return
    if (!confirm('¿Borrar esta tarea?')) return
    setLoading(true)
    try {
      await onDelete(task.id)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-[#17171a] border border-white/10 rounded-xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-base font-semibold text-white mb-5">
          {isEditing ? 'Editar tarea' : 'Nueva tarea'}
        </h2>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Título *</label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="¿Qué hay que hacer?"
              className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Detalles opcionales..."
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none"
            />
          </div>

          {/* Row: Project + Assignee */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Proyecto</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full h-9 px-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                <option value="">Sin proyecto</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Responsable</label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full h-9 px-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                <option value="">Sin asignar</option>
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>{p.full_name || p.email}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row: Status + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full h-9 px-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Prioridad</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full h-9 px-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                {(['low', 'medium', 'high', 'urgent'] as Priority[]).map((p) => (
                  <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Due date */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Fecha límite</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div>
            {isEditing && onDelete && (
              <button
                onClick={handleDelete}
                disabled={loading}
                className="h-8 px-3 rounded-lg text-xs font-medium text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                Borrar
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="h-8 px-4 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || loading}
              className="h-8 px-4 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-500 text-white transition-colors disabled:opacity-40"
            >
              {loading ? 'Guardando...' : isEditing ? 'Guardar' : 'Crear tarea'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
