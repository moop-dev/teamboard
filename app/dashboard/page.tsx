'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Filters, FilterState } from '@/components/Filters'
import { KanbanBoard } from '@/components/KanbanBoard'
import { ProjectModal } from '@/components/ProjectModal'
import { TaskModal } from '@/components/TaskModal'
import { useProjects } from '@/hooks/useProjects'
import { useProfiles } from '@/hooks/useProfiles'
import { useTasks } from '@/hooks/useTasks'
import { useRealtime } from '@/hooks/useRealtime'
import { Task, Project, Status } from '@/lib/types'
import { createClient } from '@/lib/supabaseClient'

export default function DashboardPage() {
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const { projects, setProjects, createProject } = useProjects()
  const { profiles } = useProfiles()
  const { tasks, setTasks, createTask, updateTask, deleteTask, moveTask } = useTasks()

  const [filters, setFilters] = useState<FilterState>({
    projectId: null,
    assigneeId: null,
    priority: null,
  })

  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const currentUserId = useRef<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login')
      } else {
        currentUserId.current = data.user.id
        setAuthChecked(true)
      }
    })
  }, [router])

  const handleTaskInsert = useCallback((task: Task) => {
    setTasks((prev) => {
      if (prev.find((t) => t.id === task.id)) return prev
      return [...prev, task]
    })
  }, [setTasks])

  const handleTaskUpdate = useCallback((task: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)))
  }, [setTasks])

  const handleTaskDelete = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [setTasks])

  const handleProjectInsert = useCallback((project: Project) => {
    setProjects((prev) => {
      if (prev.find((p) => p.id === project.id)) return prev
      return [...prev, project]
    })
  }, [setProjects])

  const handleProjectUpdate = useCallback((project: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === project.id ? project : p)))
  }, [setProjects])

  useRealtime({
    onTaskInsert: handleTaskInsert,
    onTaskUpdate: handleTaskUpdate,
    onTaskDelete: handleTaskDelete,
    onProjectInsert: handleProjectInsert,
    onProjectUpdate: handleProjectUpdate,
  })

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.projectId && task.project_id !== filters.projectId) return false
      if (filters.assigneeId === 'unassigned' && task.assignee_id !== null) return false
      if (filters.assigneeId && filters.assigneeId !== 'unassigned' && task.assignee_id !== filters.assigneeId) return false
      if (filters.priority && task.priority !== filters.priority) return false
      return true
    })
  }, [tasks, filters])

  const handleCreateTask = async (data: Partial<Task>) => {
    if (!currentUserId.current) return
    const maxPosition = tasks.filter((t) => t.status === (data.status ?? 'backlog')).length * 1000
    await createTask({
      ...data,
      title: data.title!,
      created_by: currentUserId.current,
      position: maxPosition,
    })
  }

  const handleUpdateTask = async (id: string, data: Partial<Task>) => {
    await updateTask(id, data)
  }

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id)
  }

  const handleMoveTask = async (id: string, status: Status, position: number) => {
    await moveTask(id, status, position)
  }

  const handleCreateProject = async (name: string, color: string) => {
    await createProject(name, color)
  }

  if (!authChecked) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0d0d0f]">
        <div className="text-slate-500 text-sm">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header
        onNewProject={() => setShowProjectModal(true)}
        onNewTask={() => {
          setSelectedTask(null)
          setShowTaskModal(true)
        }}
      />

      <Filters
        projects={projects}
        profiles={profiles}
        filters={filters}
        onChange={setFilters}
      />

      <div className="flex-1 overflow-hidden">
        <KanbanBoard
          tasks={filteredTasks}
          projects={projects}
          profiles={profiles}
          onTasksChange={setTasks}
          onMoveTask={handleMoveTask}
          onTaskClick={(task) => {
            setSelectedTask(task)
            setShowTaskModal(true)
          }}
        />
      </div>

      {showProjectModal && (
        <ProjectModal
          onClose={() => setShowProjectModal(false)}
          onCreate={handleCreateProject}
        />
      )}

      {showTaskModal && (
        <TaskModal
          task={selectedTask}
          projects={projects}
          profiles={profiles}
          onClose={() => {
            setShowTaskModal(false)
            setSelectedTask(null)
          }}
          onCreate={handleCreateTask}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  )
}