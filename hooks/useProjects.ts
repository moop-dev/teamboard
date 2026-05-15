'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { Project } from '@/lib/types'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProjects = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at')
    setProjects(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const createProject = async (name: string, color: string) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('projects')
      .insert({ name, color })
      .select()
      .single()
    if (error) throw error
    return data as Project
  }

  return { projects, setProjects, loading, createProject, refetch: fetchProjects }
}
