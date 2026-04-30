'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import {
  LayoutDashboard, Activity, Cpu, BarChart3, Monitor,
  Zap, LogOut, Menu, X, Brain, ChevronRight,
  FileBarChart2, Settings, Sparkles,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard',  label: 'Dashboard',     icon: LayoutDashboard, color: 'text-cyan-400'   },
  { href: '/analytics',  label: 'Analytics',     icon: BarChart3,       color: 'text-purple-400' },
  { href: '/predict',    label: 'AI Predict',    icon: Brain,           color: 'text-emerald-400' },
  { href: '/devices',    label: 'Devices',       icon: Monitor,         color: 'text-amber-400'  },
  { href: '/compare',    label: 'Edge vs Cloud', icon: Zap,             color: 'text-cyan-400'   },
  { href: '/reports',    label: 'Reports',       icon: FileBarChart2,   color: 'text-purple-400' },
  { href: '/settings',   label: 'Settings',      icon: Settings,        color: 'text-slate-400'  },
]

export default function Sidebar() {
  const pathname   = usePathname()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  useEffect(() => { setOpen(false) }, [pathname])

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-glow-cyan flex-shrink-0"
        >
          <Cpu size={18} className="text-white" />
        </motion.div>
        <div className="min-w-0">
          <p className="text-sm font-bold gradient-text truncate">EdgeVisionNet</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] text-slate-500 font-mono">v1.0.0</span>
            <span className="badge-pro text-[9px] py-0 px-1.5">PRO</span>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {/* Section label */}
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 pb-2">Main</p>
        {navItems.slice(0, 5).map((item) => {
          const Icon   = item.icon
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                className={`sidebar-link ${active ? 'active' : ''}`}
              >
                <Icon size={17} className={active ? 'text-cyan-400' : item.color} />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight size={13} className="text-cyan-400 flex-shrink-0" />}
              </motion.div>
            </Link>
          )
        })}

        {/* Section label */}
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 pb-2 pt-4">Reports & Config</p>
        {navItems.slice(5).map((item) => {
          const Icon   = item.icon
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                className={`sidebar-link ${active ? 'active' : ''}`}
              >
                <Icon size={17} className={active ? 'text-cyan-400' : item.color} />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight size={13} className="text-cyan-400 flex-shrink-0" />}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* AI Status */}
      <div className="px-3 py-2">
        <div className="glass-card p-3 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
            <Sparkles size={14} className="text-emerald-400" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-emerald-400">AI Engine Active</p>
            <p className="text-[10px] text-slate-600 truncate">EdgeVisionNet v1.0</p>
          </div>
          <span className="pulse-dot ml-auto flex-shrink-0" />
        </div>
      </div>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className="glass-card p-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400/30 to-purple-600/30 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-cyan-400">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email || ''}</p>
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={logout}
          className="sidebar-link w-full text-red-400 hover:bg-red-500/10 hover:text-red-300"
          id="sidebar-logout-btn"
        >
          <LogOut size={15} />
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

      {/* Mobile Header */}
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

      {/* Mobile Drawer */}
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
