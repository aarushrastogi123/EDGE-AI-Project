'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import { usePathname } from 'next/navigation'

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Live Dashboard',        subtitle: 'Real-time edge device telemetry & energy intelligence' },
  '/analytics': { title: 'Historical Analytics',  subtitle: 'Telemetry trends and export tools' },
  '/predict':   { title: 'AI Prediction Engine',  subtitle: 'Upload an image and run EdgeVisionNet inference' },
  '/devices':   { title: 'Device Management',     subtitle: 'Connected edge devices and their status' },
  '/compare':   { title: 'Edge vs Cloud',          subtitle: 'Energy savings, CO₂ reduction and model benchmarks' },
  '/reports':   { title: 'Reports',               subtitle: 'Energy usage summary and downloadable reports' },
  '/settings':  { title: 'Settings',              subtitle: 'Account, appearance and device preferences' },
}

function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { isAuthed, loading } = useAuth()
  const router   = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !isAuthed) {
      router.push('/login')
    }
  }, [isAuthed, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-none border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
            <div className="absolute inset-3 rounded-none border border-purple-500/20 border-b-purple-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <p className="text-cyan-400/50 text-sm">Authenticating…</p>
        </div>
      </div>
    )
  }

  if (!isAuthed) return null

  const meta = pageTitles[pathname] ?? { title: 'EdgeVisionNet', subtitle: '' }

  return (
    <div className="min-h-screen bg-bg">
      {/* Ambient background */}
      <div className="fixed top-0 left-0 right-0 h-[600px] pointer-events-none z-0"
           style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.04) 0%, transparent 70%)' }} />

      {/* Main content area */}
      <div className="min-h-screen flex flex-col pt-16">
        <Navbar title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 relative z-10 pt-4">
          <div className="p-6 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardGuard>{children}</DashboardGuard>
    </AuthProvider>
  )
}
