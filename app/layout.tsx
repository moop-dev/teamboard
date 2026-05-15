import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TeamBoard',
  description: 'Kanban interno',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="bg-[#0d0d0f] text-white antialiased">
        {children}
      </body>
    </html>
  )
}
