'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { Cpu, Eye, EyeOff, ArrowRight, Zap, Activity, Shield, BarChart3, CheckCircle } from 'lucide-react'

const leftFeatures = [
  { icon: Zap,       text: 'Real-time energy telemetry', sub: '2-second live refresh' },
  { icon: Activity,  text: 'Live CPU, RAM & battery monitoring', sub: 'All metrics in one view' },
  { icon: BarChart3, text: 'Historical analytics & CSV export', sub: 'Up to 7 days of data' },
  { icon: Shield,    text: 'JWT secured with Bearer tokens', sub: 'Enterprise-grade auth' },
]

function LoginForm() {
  const { login } = useAuth()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Login failed. Check credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#0A0F1E]">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex flex-col justify-between relative overflow-hidden p-12"
           style={{ background: 'linear-gradient(135deg, #0A0F1E 0%, #0F172A 40%, #1a0b35 100%)' }}>

        {/* Ambient glows */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Grid lines */}
        <div className="absolute inset-0 grid-bg opacity-50" />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-glow-cyan">
            <Cpu size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold gradient-text">EdgeVisionNet</p>
            <p className="text-[10px] text-slate-500 font-mono">v1.0.0 · Edge AI Platform</p>
          </div>
        </motion.div>

        {/* Central orb + text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 flex-1 flex flex-col justify-center"
        >
          {/* Animated orb visual */}
          <div className="relative w-48 h-48 mx-auto mb-10">
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.25) 0%, rgba(124,58,237,0.15) 50%, transparent 70%)' }}
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-4 rounded-full border border-cyan-400/20"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-8 rounded-full border border-purple-400/20"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400/80 to-purple-600/80 flex items-center justify-center shadow-glow-cyan">
                <Cpu size={36} className="text-white" />
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-black text-center mb-3">
            Welcome to <span className="gradient-text">Edge AI</span>
          </h2>
          <p className="text-slate-400 text-center text-sm leading-relaxed max-w-xs mx-auto mb-8">
            Monitor your devices, run AI predictions, and track energy savings in real time.
          </p>

          {/* Feature list */}
          <div className="space-y-3">
            {leftFeatures.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={15} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-300">{f.text}</p>
                    <p className="text-[10px] text-slate-600">{f.sub}</p>
                  </div>
                  <CheckCircle size={13} className="text-emerald-400 ml-auto flex-shrink-0" />
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Bottom badge */}
        <div className="relative z-10 text-center">
          <span className="text-xs text-slate-600">Secure JWT Authentication · Zero data leaves your device</span>
        </div>
      </div>

      {/* ── Right Panel: Form ── */}
      <div className="flex items-center justify-center px-6 py-12 relative">
        <div className="fixed top-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
              <Cpu size={16} className="text-white" />
            </div>
            <span className="font-bold gradient-text">EdgeVisionNet</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-100 mb-1">Welcome back</h1>
            <p className="text-slate-500">Sign in to your edge AI dashboard</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-5 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input-field mt-2"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Forgot password?</a>
              </div>
              <div className="relative mt-2">
                <input
                  id="login-password"
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2 mt-2 relative z-10"
            >
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><span>Sign In</span> <ArrowRight size={16} /></>}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-slate-600">or continue with</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Google SSO (UI only) */}
          <button
            id="login-google-btn"
            className="btn-google w-full py-3 text-sm font-medium"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-slate-500 mt-6">
            No account?{' '}
            <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold">
              Create one free →
            </Link>
          </p>

          <p className="text-center text-xs text-slate-700 mt-4 flex items-center justify-center gap-1">
            <Zap size={11} className="text-amber-500" />
            Secure JWT · Real device telemetry · Edge AI inference
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  )
}
