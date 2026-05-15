'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { Task, Project } from '@/lib/types'

interface UseRealtimeProps {
  onTaskInsert: (task: Task) => void
  onTaskUpdate: (task: Task) => void
  onTaskDelete: (id: string) => void
  onProjectInsert: (project: Project) => void
  onProjectUpdate: (project: Project) => void
}

export function useRealtime({
  onTaskInsert,
  onTaskUpdate,
  onTaskDelete,
  onProjectInsert,
  onProjectUpdate,
}: UseRealtimeProps) {
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'tasks' },
        (payload) => onTaskInsert(payload.new as Task)
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'tasks' },
        (payload) => onTaskUpdate(payload.new as Task)
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'tasks' },
        (payload) => onTaskDelete(payload.old.id as string)
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'projects' },
        (payload) => onProjectInsert(payload.new as Project)
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'projects' },
        (payload) => onProjectUpdate(payload.new as Project)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [onTaskInsert, onTaskUpdate, onTaskDelete, onProjectInsert, onProjectUpdate])
}
