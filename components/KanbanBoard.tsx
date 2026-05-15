'use client'

import { useState, useCallback, useRef } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { Task, Project, Profile, Status, ALL_STATUSES } from '@/lib/types'
import { KanbanColumn } from './KanbanColumn'
import { TaskCard } from './TaskCard'

interface KanbanBoardProps {
  tasks: Task[]
  projects: Project[]
  profiles: Profile[]
  onTasksChange: (tasks: Task[]) => void
  onMoveTask: (id: string, status: Status, position: number) => Promise<void>
  onTaskClick: (task: Task) => void
}

export function KanbanBoard({
  tasks,
  projects,
  profiles,
  onTasksChange,
  onMoveTask,
  onTaskClick,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const pendingMove = useRef<{ id: string; status: Status; position: number } | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const getColumnTasks = (status: Status) =>
    tasks.filter((t) => t.status === status).sort((a, b) => a.position - b.position)

  const handleDragStart = useCallback((event: { active: { id: string | number } }) => {
    const task = tasks.find((t) => t.id === event.active.id)
    setActiveTask(task ?? null)
  }, [tasks])

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event
      if (!over) return

      const activeId = active.id as string
      const overId = over.id as string

      const activeTask = tasks.find((t) => t.id === activeId)
      if (!activeTask) return

      const overStatus = ALL_STATUSES.includes(overId as Status)
        ? (overId as Status)
        : tasks.find((t) => t.id === overId)?.status

      if (!overStatus || activeTask.status === overStatus) return

      onTasksChange(
        tasks.map((t) => (t.id === activeId ? { ...t, status: overStatus } : t))
      )
    },
    [tasks, onTasksChange]
  )

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event
      setActiveTask(null)

      if (!over) return

      const activeId = active.id as string
      const overId = over.id as string

      const activeTask = tasks.find((t) => t.id === activeId)
      if (!activeTask) return

      const overStatus = ALL_STATUSES.includes(overId as Status)
        ? (overId as Status)
        : tasks.find((t) => t.id === overId)?.status ?? activeTask.status

      const columnTasks = tasks
        .filter((t) => t.status === overStatus)
        .sort((a, b) => a.position - b.position)

      let newTasks = [...tasks]
      const activeIdx = columnTasks.findIndex((t) => t.id === activeId)
      const overIdx = columnTasks.findIndex((t) => t.id === overId)

      let reordered: Task[]
      if (activeTask.status !== overStatus) {
        const withoutActive = newTasks.filter((t) => t.id !== activeId)
        const updatedActive = { ...activeTask, status: overStatus }
        reordered = [...withoutActive, updatedActive]
      } else if (activeIdx !== overIdx && overIdx !== -1) {
        const arr = arrayMove(columnTasks, activeIdx, overIdx)
        reordered = newTasks.map((t) => {
          const idx = arr.findIndex((a) => a.id === t.id)
          return idx !== -1 ? { ...t, position: idx * 1000 } : t
        })
      } else {
        reordered = newTasks
      }

      const finalColumnTasks = reordered
        .filter((t) => t.status === overStatus)
        .sort((a, b) => a.position - b.position)

      const movedTask = finalColumnTasks.find((t) => t.id === activeId)
      const newPosition = movedTask?.position ?? finalColumnTasks.length * 1000

      onTasksChange(reordered)
      await onMoveTask(activeId, overStatus, newPosition)
    },
    [tasks, onTasksChange, onMoveTask]
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 px-6 py-4 overflow-x-auto h-full items-start">
        {ALL_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={getColumnTasks(status)}
            projects={projects}
            profiles={profiles}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask && (
          <div className="rotate-2 opacity-90">
            <TaskCard
              task={activeTask}
              project={projects.find((p) => p.id === activeTask.project_id)}
              assignee={profiles.find((p) => p.id === activeTask.assignee_id)}
              onClick={() => {}}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
