'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'
import type { User } from '@/lib/types'

interface AuthContextType {
  user:     User | null
  token:    string | null
  loading:  boolean
  login:    (email: string, password: string) => Promise<void>
  signup:   (name: string, email: string, password: string) => Promise<void>
  logout:   () => void
  isAuthed: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null)
  const [token,   setToken]   = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('evn_token')
    const storedUser  = localStorage.getItem('evn_user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const res = await authAPI.login(email, password)
    const { access_token, user: u } = res.data
    localStorage.setItem('evn_token', access_token)
    localStorage.setItem('evn_user',  JSON.stringify(u))
    setToken(access_token)
    setUser(u)
    router.push('/dashboard')
  }

  const signup = async (name: string, email: string, password: string) => {
    const res = await authAPI.signup(name, email, password)
    const { access_token, user: u } = res.data
    localStorage.setItem('evn_token', access_token)
    localStorage.setItem('evn_user',  JSON.stringify(u))
    setToken(access_token)
    setUser(u)
    router.push('/dashboard')
  }

  const logout = () => {
    localStorage.removeItem('evn_token')
    localStorage.removeItem('evn_user')
    setToken(null)
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{
      user, token, loading, login, signup, logout,
      isAuthed: !!token,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
