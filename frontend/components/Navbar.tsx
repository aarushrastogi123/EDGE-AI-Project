'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, User, ChevronDown, Settings, LogOut, Search, Cpu } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavbarProps {
  title?: string
  subtitle?: string
}

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Live Dashboard',       subtitle: 'Real-time edge device telemetry' },
  '/analytics': { title: 'Analytics',            subtitle: 'Historical trends & export tools' },
  '/predict':   { title: 'AI Prediction Engine', subtitle: 'Upload & run EdgeVisionNet inference' },
  '/devices':   { title: 'Device Management',    subtitle: 'Connected edge devices' },
  '/compare':   { title: 'Edge vs Cloud',        subtitle: 'Energy savings & model benchmarks' },
  '/reports':   { title: 'Reports',              subtitle: 'Energy usage & downloadable reports' },
  '/settings':  { title: 'Settings',             subtitle: 'Account, security & preferences' },
}

const notifications = [
  { id: 1, icon: '⚡', text: 'CPU spiked to 94% on laptop_01', time: '2m ago', unread: true },
  { id: 2, icon: '🔋', text: 'Battery below 20% — on battery power', time: '8m ago', unread: true },
  { id: 3, icon: '🤖', text: 'EdgeVisionNet inference completed in 38ms', time: '15m ago', unread: false },
  { id: 4, icon: '📊', text: 'Weekly energy report is ready', time: '1h ago', unread: false },
]

export default function Navbar({ title, subtitle }: NavbarProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [search,      setSearch]      = useState('')
  const [showProfile, setShowProfile] = useState(false)
  const [showNotifs,  setShowNotifs]  = useState(false)

  const meta = pageTitles[pathname] ?? { title: title ?? 'EdgeVisionNet', subtitle: subtitle ?? '' }
  const unread = notifications.filter(n => n.unread).length

  return (
    <header className="fixed top-0 left-0 right-0 lg:left-60 z-20 flex items-center justify-between px-6 py-3.5 bg-[#080b12]/90 backdrop-blur-xl border-b border-white/5">
      {/* Left: Page title */}
      <div className="hidden lg:flex flex-col min-w-0">
        <h1 className="text-[15px] font-semibold text-white leading-tight truncate">{meta.title}</h1>
        {meta.subtitle && (
          <p className="text-[11px] text-slate-500 leading-tight">{meta.subtitle}</p>
        )}
      </div>

      {/* Mobile: Brand */}
      <div className="flex lg:hidden items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500/30 to-purple-600/20 border border-cyan-500/30 flex items-center justify-center">
          <Cpu size={13} className="text-cyan-400" />
        </div>
        <span className="text-sm font-bold text-white">EdgeVisionNet</span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden xl:block">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            id="navbar-search"
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="navbar-search pl-8"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            id="navbar-notifications-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false) }}
            className="relative p-2 rounded-lg glass-card text-slate-400 hover:text-white transition-colors"
          >
            <Bell size={17} />
            {unread > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center"
              >
                {unread}
              </motion.span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-80 glass-card border border-white/10 overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Notifications</span>
                  <span className="text-xs text-cyan-400 cursor-pointer hover:text-cyan-300">Mark all read</span>
                </div>
                <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className={`flex items-start gap-3 px-4 py-3 hover:bg-white/3 transition-colors cursor-pointer ${n.unread ? 'bg-cyan-500/3' : ''}`}
                    >
                      <span className="text-lg flex-shrink-0 mt-0.5">{n.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-300 leading-relaxed">{n.text}</p>
                        <p className="text-[10px] text-slate-600 mt-0.5">{n.time}</p>
                      </div>
                      {n.unread && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0 mt-1.5" />}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <motion.button
            id="navbar-profile-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setShowProfile(!showProfile); setShowNotifs(false) }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-card hover:border-white/15 transition-colors"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500/30 to-purple-600/30 border border-white/10 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
              </span>
            </div>
            <span className="text-xs font-medium text-slate-300 hidden sm:block max-w-[100px] truncate">
              {user?.name?.split(' ')[0] ?? 'User'}
            </span>
            <ChevronDown size={12} className="text-slate-500 flex-shrink-0" />
          </motion.button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-56 glass-card border border-white/10 overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/settings"
                    onClick={() => setShowProfile(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Settings size={14} /> Settings
                  </Link>
                </div>
                <div className="border-t border-white/5 py-1">
                  <button
                    id="navbar-logout-btn"
                    onClick={() => { setShowProfile(false); logout() }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Click outside */}
      {(showProfile || showNotifs) && (
        <div className="fixed inset-0 z-[-1]" onClick={() => { setShowProfile(false); setShowNotifs(false) }} />
      )}
    </header>
  )
}
