'use client'

import React, { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import {
  LayoutDashboard, Activity, Cpu, BarChart3, Monitor,
  Zap, LogOut, Menu, X, Brain, ChevronRight,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard, color: 'text-cyan-400'   },
  { href: '/analytics',  label: 'Analytics',  icon: BarChart3,       color: 'text-purple-400' },
  { href: '/predict',    label: 'AI Predict', icon: Brain,           color: 'text-emerald-400' },
  { href: '/devices',    label: 'Devices',    icon: Monitor,         color: 'text-amber-400'  },
  { href: '/compare',    label: 'Edge vs Cloud', icon: Zap,          color: 'text-cyan-400'   },
]

export default function Sidebar() {
  const pathname   = usePathname()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  // Close mobile sidebar on route change
  useEffect(() => { setOpen(false) }, [pathname])

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-glow-cyan">
          <Cpu size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold gradient-text">EdgeVisionNet</p>
          <p className="text-[10px] text-slate-500 font-mono">v1.0.0 • Edge AI</p>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon    = item.icon
          const active  = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                className={`sidebar-link ${active ? 'active' : ''}`}
              >
                <Icon size={18} className={active ? 'text-cyan-400' : item.color} />
                <span>{item.label}</span>
                {active && (
                  <ChevronRight size={14} className="ml-auto text-cyan-400" />
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className="glass-card p-3 mb-3">
          <p className="text-xs font-semibold text-slate-200 truncate">{user?.name}</p>
          <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={logout}
          className="sidebar-link w-full text-red-400 hover:bg-red-500/10"
          id="sidebar-logout-btn"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </motion.button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-[#090E1C] border-r border-white/5 fixed left-0 top-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Header + Drawer */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-[#090E1C]/90 backdrop-blur border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
            <Cpu size={14} className="text-white" />
          </div>
          <span className="text-sm font-bold gradient-text">EdgeVisionNet</span>
        </div>
        <button
          id="mobile-menu-btn"
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg glass-card text-slate-400 hover:text-white"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 z-50 bg-[#090E1C] border-r border-white/5"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
