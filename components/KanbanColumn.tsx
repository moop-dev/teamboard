'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Task, Project, Profile, Status, STATUS_LABELS } from '@/lib/types'
import { TaskCard } from './TaskCard'

interface KanbanColumnProps {
  status: Status
  tasks: Task[]
  projects: Project[]
  profiles: Profile[]
  onTaskClick: (task: Task) => void
}

export function KanbanColumn({ status, tasks, profiles, projects, onTaskClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className="flex flex-col w-64 shrink-0">
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {STATUS_LABELS[status]}
        </span>
        <span className="text-xs text-slate-600 font-medium ml-auto">
          {tasks.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[200px] rounded-xl p-2 flex flex-col gap-2 transition-colors ${
          isOver ? 'bg-violet-500/10 ring-1 ring-violet-500/30' : 'bg-white/[0.02]'
        }`}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              project={projects.find((p) => p.id === task.project_id)}
              assignee={profiles.find((p) => p.id === task.assignee_id)}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-xs text-slate-700">Vacío</span>
          </div>
        )}
      </div>
    </div>
  )
}
