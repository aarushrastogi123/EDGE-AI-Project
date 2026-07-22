'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

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
        <div className="flex flex-col items-center gap-5">
          {/* Animated logo rings */}
          <div className="relative w-16 h-16">
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-cyan-400/30"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
              style={{ borderTopColor: '#00d4ff', borderRightColor: 'transparent' }}
            />
            <motion.div
              className="absolute inset-2 rounded-lg border border-purple-500/30"
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}
              style={{ borderBottomColor: '#8b5cf6', borderLeftColor: 'transparent' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-glow-cyan" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-semibold text-white">EdgeVisionNet</p>
            <p className="text-xs text-slate-500">Authenticating…</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthed) return null

  return (
    <div className="min-h-screen bg-bg">
      {/* Ambient radial glow */}
      <div
        className="fixed top-0 left-0 right-0 h-[500px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at 30% 0%, rgba(0,212,255,0.04) 0%, transparent 70%)' }}
      />
      <div
        className="fixed bottom-0 right-0 w-[600px] h-[600px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at 70% 100%, rgba(139,92,246,0.04) 0%, transparent 70%)' }}
      />

      {/* Sidebar */}
      <Sidebar />

      {/* Navbar */}
      <Navbar />

      {/* Main content — offset by sidebar width on desktop */}
      <main className="relative z-10 lg:pl-60 pt-[60px] min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="p-6 max-w-[1400px] mx-auto w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
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
