'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { Cpu, Eye, EyeOff, ArrowRight, Zap, Shield, BarChart3, Monitor, Smartphone, Server } from 'lucide-react'

const deviceIcons = [Monitor, Smartphone, Server, Cpu]

function PasswordStrength({ password }: { password: string }) {
  const getStrength = () => {
    let score = 0
    if (password.length >= 6)  score++
    if (password.length >= 10) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  }
  const score = getStrength()
  const labels  = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
  const colors  = ['', '#EF4444', '#F59E0B', '#10B981', '#00D4FF', '#7C3AED']
  if (!password) return null
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ background: i <= score ? colors[score] : 'rgba(255,255,255,0.08)' }}
          />
        ))}
      </div>
      <p className="text-[10px]" style={{ color: colors[score] || '#64748b' }}>
        {labels[score] || 'Enter password'}
      </p>
    </div>
  )
}

function SignupForm() {
  const { signup } = useAuth()
  const [name,      setName]      = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [showPwd,   setShowPwd]   = useState(false)
  const [showConf,  setShowConf]  = useState(false)
  const [agreed,    setAgreed]    = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (!agreed) { setError('Please accept the terms to continue.'); return }
    setError('')
    setLoading(true)
    try {
      await signup(name, email, password)
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Signup failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#0A0F1E]">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex flex-col justify-between relative overflow-hidden p-12"
           style={{ background: 'linear-gradient(135deg, #0A0F1E 0%, #12082e 40%, #0F172A 100%)' }}>

        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 grid-bg opacity-50" />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-glow-purple">
            <Cpu size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold gradient-text">EdgeVisionNet</p>
            <p className="text-[10px] text-slate-500 font-mono">v1.0.0 · Edge AI Platform</p>
          </div>
        </motion.div>

        {/* Central visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 flex-1 flex flex-col justify-center items-center"
        >
          {/* Orbiting device icons */}
          <div className="relative w-52 h-52 mx-auto mb-8">
            <motion.div
              animate={{ scale: [1, 1.06, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, rgba(0,212,255,0.1) 50%, transparent 70%)' }}
            />
            {deviceIcons.map((Icon, i) => {
              const angle = (i / deviceIcons.length) * 360
              const rad   = (angle * Math.PI) / 180
              const r     = 80
              const x     = r * Math.cos(rad)
              const y     = r * Math.sin(rad)
              return (
                <motion.div
                  key={i}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear', delay: i * 0.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear', delay: i * 0.5 }}
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/20 flex items-center justify-center"
                  >
                    <Icon size={18} className="text-purple-300" />
                  </motion.div>
                </motion.div>
              )
            })}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/80 to-cyan-500/80 flex items-center justify-center shadow-glow-purple">
                <Zap size={32} className="text-white" />
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-black text-center mb-3">
            Join the <span className="gradient-text">Edge AI</span> revolution
          </h2>
          <p className="text-slate-400 text-center text-sm leading-relaxed max-w-xs mx-auto mb-8">
            Create your free account and start monitoring your devices' energy intelligence today.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 w-full">
            {[
              { val: '50K+', label: 'Predictions' },
              { val: '73%',  label: 'Power Saved' },
              { val: '99.9%', label: 'Uptime'     },
            ].map((s, i) => (
              <div key={i} className="text-center glass-card p-3">
                <p className="text-lg font-black gradient-text">{s.val}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="relative z-10 text-center">
          <span className="text-xs text-slate-600">No credit card required · Free forever plan</span>
        </div>
      </div>

      {/* ── Right Panel: Form ── */}
      <div className="flex items-center justify-center px-6 py-12 relative overflow-y-auto">
        <div className="fixed top-1/3 right-1/3 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

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
            <h1 className="text-3xl font-black text-slate-100 mb-1">Create your account</h1>
            <p className="text-slate-500">Start monitoring your edge AI devices for free</p>
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
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Aarush Rastogi"
                required
                className="input-field mt-2"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input-field mt-2"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative mt-2">
                <input
                  id="signup-password"
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  className="input-field pr-12"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <PasswordStrength password={password} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirm Password</label>
              <div className="relative mt-2">
                <input
                  id="signup-confirm"
                  type={showConf ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat password"
                  required
                  className={`input-field pr-12 ${confirm && confirm !== password ? 'border-red-500/50' : confirm && confirm === password ? 'border-emerald-500/50' : ''}`}
                />
                <button type="button" onClick={() => setShowConf(!showConf)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showConf ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirm && confirm !== password && (
                <p className="text-[11px] text-red-400 mt-1">Passwords do not match</p>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 accent-cyan-400"
                id="signup-terms"
              />
              <span className="text-xs text-slate-500 leading-relaxed">
                I agree to the <span className="text-cyan-400 hover:text-cyan-300 cursor-pointer">Terms of Service</span> and <span className="text-cyan-400 hover:text-cyan-300 cursor-pointer">Privacy Policy</span>
              </span>
            </label>

            <motion.button
              id="signup-submit-btn"
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2 mt-2 relative z-10 disabled:opacity-50"
            >
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><span>Create Account</span> <ArrowRight size={16} /></>}
            </motion.button>
          </form>

          {/* Google */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-slate-600">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>
          <button id="signup-google-btn" className="btn-google w-full py-3 text-sm font-medium">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">
              Sign in →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <AuthProvider>
      <SignupForm />
    </AuthProvider>
  )
}
