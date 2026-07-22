'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import {
  LayoutDashboard, BarChart3, Brain, Monitor,
  Zap, LogOut, Menu, X, FileBarChart2, Settings,
  Cpu, ChevronRight, Activity, Sparkles,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard',     icon: LayoutDashboard, color: '#00d4ff',   section: 'main' },
  { href: '/analytics', label: 'Analytics',     icon: BarChart3,       color: '#8b5cf6',   section: 'main' },
  { href: '/predict',   label: 'AI Predict',    icon: Brain,           color: '#10b981',   section: 'main' },
  { href: '/devices',   label: 'Devices',       icon: Monitor,         color: '#f59e0b',   section: 'main' },
  { href: '/compare',   label: 'Edge vs Cloud', icon: Zap,             color: '#00d4ff',   section: 'main' },
  { href: '/reports',   label: 'Reports',       icon: FileBarChart2,   color: '#8b5cf6',   section: 'config' },
  { href: '/settings',  label: 'Settings',      icon: Settings,        color: '#64748b',   section: 'config' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  useEffect(() => { setOpen(false) }, [pathname])

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5 flex-shrink-0">
        <div className="relative">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/30 to-purple-600/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 shadow-glow-cyan">
            <Cpu size={17} className="text-cyan-400" />
          </div>
          <motion.div
            className="absolute -inset-1 rounded-xl border border-cyan-400/20"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white truncate tracking-tight">EdgeVisionNet</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] text-slate-600 font-mono">v1.0.0</span>
            <span className="badge-pro text-[9px] py-0 px-1.5">PRO</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-none">
        {/* Main Section */}
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 pb-1.5">Main</p>
        {navItems.filter(i => i.section === 'main').map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                className={`sidebar-link ${active ? 'active' : ''}`}
              >
                <Icon
                  size={16}
                  style={{ color: active ? item.color : undefined }}
                  className={active ? '' : 'text-slate-500'}
                />
                <span className="flex-1">{item.label}</span>
                {active && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="w-1 h-1 rounded-full bg-cyan-400 flex-shrink-0"
                  />
                )}
              </motion.div>
            </Link>
          )
        })}

        {/* Config Section */}
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 pb-1.5 pt-4">Reports & Config</p>
        {navItems.filter(i => i.section === 'config').map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                className={`sidebar-link ${active ? 'active' : ''}`}
              >
                <Icon
                  size={16}
                  style={{ color: active ? item.color : undefined }}
                  className={active ? '' : 'text-slate-500'}
                />
                <span className="flex-1">{item.label}</span>
                {active && (
                  <motion.div
                    layoutId={`sidebar-indicator-${item.href}`}
                    className="w-1 h-1 rounded-full bg-cyan-400 flex-shrink-0"
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* AI Status Widget */}
      <div className="px-3 pb-3 flex-shrink-0">
        <div className="glass-card p-3 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <Sparkles size={14} className="text-emerald-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold text-emerald-400">AI Engine Active</p>
            <p className="text-[10px] text-slate-600 truncate">EdgeVisionNet v1.0</p>
          </div>
          <span className="pulse-dot ml-auto flex-shrink-0" />
        </div>
      </div>

      {/* User + Logout */}
      <div className="px-3 pb-4 flex-shrink-0 border-t border-white/5 pt-3">
        <div className="glass-card p-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.name ?? 'User'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email ?? ''}</p>
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={logout}
          id="sidebar-logout-btn"
          className="sidebar-link w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/20"
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
      <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-[#090c16]/95 border-r border-white/5 fixed left-0 top-0 z-30 backdrop-blur-md">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3.5 bg-[#090c16]/95 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500/30 to-purple-600/20 border border-cyan-500/30 flex items-center justify-center">
            <Cpu size={13} className="text-cyan-400" />
          </div>
          <span className="text-sm font-bold text-white">EdgeVisionNet</span>
        </div>
        <button
          id="mobile-menu-btn"
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg glass-card text-slate-400 hover:text-white transition-colors"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
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
              className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 z-50 bg-[#090c16] border-r border-white/5"
            >
              <SidebarContent mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
