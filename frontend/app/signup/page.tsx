'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { Cpu, Eye, EyeOff, ArrowRight, Shield, Zap, BarChart3 } from 'lucide-react'

const features = [
  { icon: Zap, text: 'Real-time edge AI inference' },
  { icon: BarChart3, text: 'Live energy analytics' },
  { icon: Shield, text: 'Secure JWT authentication' },
]

function SignupForm() {
  const { signup } = useAuth()
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
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
    <div className="min-h-screen bg-navy grid-bg flex items-center justify-center px-4">
      <div className="fixed top-1/3 left-1/3 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/3 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 items-center justify-center shadow-glow-purple mb-4">
            <Cpu size={26} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-1">EdgeVisionNet</h1>
          <p className="text-sm text-slate-500">Create your intelligence account</p>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {features.map(({ icon: Icon, text }) => (
            <span key={text} className="flex items-center gap-1.5 px-3 py-1 glass-card text-xs text-slate-400">
              <Icon size={12} className="text-cyan-400" />
              {text}
            </span>
          ))}
        </div>

        <div className="glass-card p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-100">Get started free</h2>
            <p className="text-sm text-slate-500 mt-1">Start monitoring your edge AI devices</p>
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
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Full Name</label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarush Rastogi"
                required
                className="input-field mt-1.5"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email</label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input-field mt-1.5"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative mt-1.5">
                <input
                  id="signup-password"
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
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
              id="signup-submit-btn"
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 mt-2 relative z-10"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
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
