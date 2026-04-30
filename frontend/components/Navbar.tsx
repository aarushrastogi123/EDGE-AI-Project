'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, User, ChevronDown, Settings, LogOut, Shield, Cpu } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

interface NavbarProps {
  title?: string
  subtitle?: string
}

export default function Navbar({ title = 'Dashboard', subtitle }: NavbarProps) {
  const { user, logout } = useAuth()
  const [search,       setSearch]       = useState('')
  const [showProfile,  setShowProfile]  = useState(false)
  const [showNotifs,   setShowNotifs]   = useState(false)
  const [notifications] = useState([
    { id: 1, icon: '⚡', text: 'CPU spiked to 94% on laptop_01', time: '2m ago', unread: true  },
    { id: 2, icon: '🔋', text: 'Battery below 20% — On battery power', time: '8m ago', unread: true  },
    { id: 3, icon: '🤖', text: 'EdgeVisionNet inference completed in 38ms', time: '15m ago', unread: false },
    { id: 4, icon: '📊', text: 'Weekly energy report is ready', time: '1h ago', unread: false },
  ])

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#090E1C]/80 backdrop-blur-xl">
      {/* Left: Title */}
      <div>
        <h2 className="text-base font-semibold text-slate-100">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      {/* Center: Search */}
      <div className="relative hidden md:block">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search metrics, devices…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="navbar-search pl-8"
          id="navbar-search"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <motion.button
            id="navbar-notifications-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setShowNotifs(!showNotifs); setShowProfile(false) }}
            className="relative p-2 rounded-xl glass-card text-slate-400 hover:text-slate-200"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-[9px] font-bold text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-80 glass-card border border-white/8 overflow-hidden"
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
              >
                <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-200">Notifications</span>
                  <span className="text-xs text-cyan-400 cursor-pointer hover:text-cyan-300">Mark all read</span>
                </div>
                {notifications.map(n => (
                  <div key={n.id} className={`flex items-start gap-3 px-4 py-3 border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer ${n.unread ? 'bg-cyan-500/3' : ''}`}>
                    <span className="text-lg flex-shrink-0 mt-0.5">{n.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-300">{n.text}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">{n.time}</p>
                    </div>
                    {n.unread && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0 mt-1.5" />}
                  </div>
                ))}
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
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-card hover:border-cyan-500/20 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
              <User size={14} className="text-white" />
            </div>
            <span className="text-sm font-medium text-slate-300 hidden sm:block max-w-[100px] truncate">
              {user?.name?.split(' ')[0] || 'User'}
            </span>
            <ChevronDown size={12} className="text-slate-500" />
          </motion.button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-56 glass-card border border-white/8 overflow-hidden"
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
              >
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-sm font-semibold text-slate-200">{user?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
                <div className="py-1">
                  <Link href="/settings" onClick={() => setShowProfile(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-slate-200 hover:bg-white/4 transition-colors">
                    <Settings size={15} /> Settings
                  </Link>
                  <Link href="/dashboard" onClick={() => setShowProfile(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-slate-200 hover:bg-white/4 transition-colors">
                    <Cpu size={15} /> Dashboard
                  </Link>
                  <Link href="/reports" onClick={() => setShowProfile(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-slate-200 hover:bg-white/4 transition-colors">
                    <Shield size={15} /> Reports
                  </Link>
                </div>
                <div className="border-t border-white/5 py-1">
                  <button
                    id="navbar-logout-btn"
                    onClick={() => { setShowProfile(false); logout() }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/8 transition-colors"
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Click outside to close */}
      {(showProfile || showNotifs) && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => { setShowProfile(false); setShowNotifs(false) }}
        />
      )}
    </header>
  )
}
