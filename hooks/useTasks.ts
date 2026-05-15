'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { Task, Status } from '@/lib/types'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .order('position')
    setTasks(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const createTask = async (payload: Partial<Task> & { title: string; created_by: string }) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('tasks')
      .insert(payload)
      .select()
      .single()
    if (error) throw error
    return data as Task
  }

  const updateTask = async (id: string, payload: Partial<Task>) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('tasks')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Task
  }

  const deleteTask = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) throw error
  }

  const moveTask = async (id: string, status: Status, position: number) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('tasks')
      .update({ status, position, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  }

  return { tasks, setTasks, loading, createTask, updateTask, deleteTask, moveTask, refetch: fetchTasks }
}
