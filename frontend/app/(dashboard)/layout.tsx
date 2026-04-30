'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import Sidebar from '@/components/Sidebar'
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
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
            <div className="absolute inset-3 rounded-full border border-purple-500/20 border-b-purple-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <p className="text-slate-500 text-sm">Authenticating…</p>
        </div>
      </div>
    )
  }

  if (!isAuthed) return null

  const meta = pageTitles[pathname] ?? { title: 'EdgeVisionNet', subtitle: '' }

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      {/* Ambient background */}
      <div className="fixed top-0 left-0 right-0 h-[600px] pointer-events-none z-0"
           style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.04) 0%, transparent 70%)' }} />

      <Sidebar />

      {/* Main content area */}
      <div className="lg:pl-60 min-h-screen flex flex-col">
        <div className="pt-14 lg:pt-0" />
        <Navbar title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 relative z-10">
          <div className="p-6 max-w-7xl mx-auto">
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
