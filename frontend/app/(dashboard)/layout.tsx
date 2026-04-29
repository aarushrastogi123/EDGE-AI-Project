'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import Sidebar from '@/components/Sidebar'

function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { isAuthed, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthed) {
      router.push('/login')
    }
  }, [isAuthed, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Authenticating…</p>
        </div>
      </div>
    )
  }

  if (!isAuthed) return null

  return (
    <div className="min-h-screen bg-navy">
      <Sidebar />
      {/* Main content area — offset by sidebar width on desktop */}
      <main className="lg:pl-60 pt-14 lg:pt-0">
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
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
