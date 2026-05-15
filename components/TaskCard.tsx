'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Task, Project, Profile, PRIORITY_LABELS, PRIORITY_COLORS } from '@/lib/types'

interface TaskCardProps {
  task: Task
  project: Project | undefined
  assignee: Profile | undefined
  onClick: () => void
}

export function TaskCard({ task, project, assignee, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const initials = assignee
    ? (assignee.full_name || assignee.email)
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : null

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="group bg-[#17171a] border border-white/8 rounded-lg p-3 cursor-pointer hover:border-white/20 transition-all select-none"
    >
      {/* Project badge */}
      {project && (
        <div className="flex items-center gap-1.5 mb-2">
          <div
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: project.color }}
          />
          <span className="text-[10px] font-medium text-slate-500 truncate">{project.name}</span>
        </div>
      )}

      {/* Title */}
      <p className="text-sm text-slate-200 font-medium leading-snug mb-3 line-clamp-2">
        {task.title}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Priority */}
          <span className={`text-[10px] font-semibold uppercase tracking-wide ${PRIORITY_COLORS[task.priority]}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>

          {/* Due date */}
          {task.due_date && (
            <span className="text-[10px] text-slate-600">
              {new Date(task.due_date + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
            </span>
          )}
        </div>

        {/* Assignee avatar */}
        {initials ? (
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
            style={{ backgroundColor: project?.color ?? '#6366f1' }}
            title={assignee?.full_name || assignee?.email}
          >
            {initials}
          </div>
        ) : (
          <div className="w-5 h-5 rounded-full bg-white/5 shrink-0" />
        )}
      </div>
    </div>
  )
}
