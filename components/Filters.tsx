'use client'

import { Project, Profile, Priority, PRIORITY_LABELS } from '@/lib/types'

export interface FilterState {
  projectId: string | null
  assigneeId: string | 'unassigned' | null
  priority: Priority | null
}

interface FiltersProps {
  projects: Project[]
  profiles: Profile[]
  filters: FilterState
  onChange: (filters: FilterState) => void
}

export function Filters({ projects, profiles, filters, onChange }: FiltersProps) {
  return (
    <div className="flex items-center gap-3 px-6 py-3 border-b border-white/10 bg-[#0d0d0f] shrink-0 flex-wrap">
      <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Filtros</span>

      {/* Project filter */}
      <select
        value={filters.projectId ?? ''}
        onChange={(e) => onChange({ ...filters, projectId: e.target.value || null })}
        className="h-7 px-2 rounded-md text-xs bg-white/5 border border-white/10 text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
      >
        <option value="">Todos los proyectos</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      {/* Assignee filter */}
      <select
        value={filters.assigneeId ?? ''}
        onChange={(e) => {
          const v = e.target.value
          onChange({ ...filters, assigneeId: v === '' ? null : v === 'unassigned' ? 'unassigned' : v })
        }}
        className="h-7 px-2 rounded-md text-xs bg-white/5 border border-white/10 text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
      >
        <option value="">Todos los miembros</option>
        <option value="unassigned">Sin asignar</option>
        {profiles.map((p) => (
          <option key={p.id} value={p.id}>{p.full_name || p.email}</option>
        ))}
      </select>

      {/* Priority filter */}
      <select
        value={filters.priority ?? ''}
        onChange={(e) => onChange({ ...filters, priority: (e.target.value as Priority) || null })}
        className="h-7 px-2 rounded-md text-xs bg-white/5 border border-white/10 text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
      >
        <option value="">Todas las prioridades</option>
        {(['low', 'medium', 'high', 'urgent'] as Priority[]).map((p) => (
          <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
        ))}
      </select>

      {/* Clear */}
      {(filters.projectId || filters.assigneeId || filters.priority) && (
        <button
          onClick={() => onChange({ projectId: null, assigneeId: null, priority: null })}
          className="h-7 px-2 rounded-md text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          Limpiar
        </button>
      )}
    </div>
  )
}
