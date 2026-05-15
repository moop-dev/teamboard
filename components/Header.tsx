'use client'

import { createClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  onNewProject: () => void
  onNewTask: () => void
}

export function Header({ onNewProject, onNewTask }: HeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="h-14 border-b border-white/10 bg-[#0d0d0f] flex items-center px-6 gap-4 shrink-0">
      <div className="flex items-center gap-2 mr-auto">
        <div className="w-6 h-6 rounded bg-violet-500 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="5" height="5" rx="1" fill="white"/>
            <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.6"/>
            <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.6"/>
            <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity="0.3"/>
          </svg>
        </div>
        <span className="text-sm font-semibold text-white tracking-tight">TeamBoard</span>
      </div>

      <button
        onClick={onNewProject}
        className="h-8 px-3 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors border border-white/10"
      >
        + Proyecto
      </button>
      <button
        onClick={onNewTask}
        className="h-8 px-3 rounded-md text-xs font-medium bg-violet-600 hover:bg-violet-500 text-white transition-colors"
      >
        + Nueva tarea
      </button>

      <button
        onClick={handleLogout}
        className="h-8 px-3 rounded-md text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
      >
        Salir
      </button>
    </header>
  )
}
