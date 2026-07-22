'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { Cpu, Eye, EyeOff, ArrowRight, Zap } from 'lucide-react'

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
    <div className="min-h-screen flex items-center justify-center bg-bg relative overflow-hidden">
      {/* Ambient Backgrounds */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-none blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-none blur-3xl pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10 px-6 py-12"
      >
        <div className="scifi-card p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="w-12 h-12 rounded-none bg-gradient-to-br from-cyan-400/20 to-transparent flex items-center justify-center glow-blue mb-4">
              <Cpu size={24} className="text-cyan-400" />
            </div>
            <h1 className="text-2xl font-mono uppercase tracking-widest text-glow-cyan text-cyan-400 text-cyan-400 mb-1 tracking-tight">Welcome back</h1>
            <p className="text-sm text-cyan-400/70">Sign in to your Edge AI dashboard</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 rounded-none p-3 mb-5 text-red-400 text-sm flex items-center gap-2"
            >
              <Zap size={16} /> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="scifi-label text-cyan-400/70 uppercase tracking-wider block mb-2">Email Address</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input-field"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="scifi-label text-cyan-400/70 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs text-cyan-400 hover:text-cyan-400/80 transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400/50 hover:text-cyan-400/90"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <motion.button
                id="login-submit-btn"
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2"
              >
                {loading
                  ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-none animate-spin" />
                  : <><span>Sign In</span> <ArrowRight size={16} /></>}
              </motion.button>

              <motion.button
                id="demo-login-btn"
                type="button"
                disabled={loading}
                onClick={async () => {
                  setLoading(true)
                  setError('')
                  try {
                    // Try login first, if fail auto signup
                    try {
                      await login('demo@edgevisionnet.ai', 'demo123456')
                    } catch {
                      const { authAPI } = await import('@/lib/api')
                      await authAPI.signup('Demo Engineer', 'demo@edgevisionnet.ai', 'demo123456')
                      await login('demo@edgevisionnet.ai', 'demo123456')
                    }
                  } catch (err: any) {
                    setError('Demo login failed.')
                  } finally {
                    setLoading(false)
                  }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary py-3 px-4 text-xs font-mono text-cyan-400 border-cyan-400/40 hover:border-cyan-400 flex items-center justify-center gap-1.5"
              >
                <Zap size={14} className="text-amber-400" /> Demo Access
              </motion.button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-cyan-400/10" />
            <span className="text-xs text-cyan-400/50 uppercase tracking-wider font-medium">or continue with</span>
            <div className="flex-1 h-px bg-cyan-400/10" />
          </div>

          {/* Google SSO */}
          <button
            id="login-google-btn"
            className="btn-google w-full py-3 text-xs font-mono uppercase tracking-wider"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Google
          </button>
        </div>

        <p className="text-center text-sm text-cyan-400/50 mt-8">
          No account?{' '}
          <Link href="/signup" className="text-cyan-400 hover:text-cyan-400/80 font-semibold transition-colors">
            Create one free &rarr;
          </Link>
        </p>
      </motion.div>
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
