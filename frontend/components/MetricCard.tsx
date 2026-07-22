'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react'

interface MetricCardProps {
  id?: string
  index?: number
  label: string
  value: number | string
  unit?: string
  icon: React.ReactNode
  color?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'danger'
  subtitle?: string
  trend?: 'up' | 'down' | 'neutral'
  alert?: boolean
}

const colorMap = {
  cyan:    { text: 'text-cyan-400',    bg: 'bg-cyan-500/10',    border: 'border-cyan-500/25',   glow: 'rgba(0,212,255,0.15)'    },
  purple:  { text: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/25', glow: 'rgba(139,92,246,0.15)'   },
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25',glow: 'rgba(16,185,129,0.15)'   },
  amber:   { text: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/25',  glow: 'rgba(245,158,11,0.15)'   },
  danger:  { text: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/25',    glow: 'rgba(239,68,68,0.15)'    },
}

export default function MetricCard({
  id, index = 0, label, value, unit = '', icon, color = 'cyan', subtitle, trend, alert,
}: MetricCardProps) {
  const c = colorMap[color] ?? colorMap.cyan
  const numVal = typeof value === 'number' ? value : parseFloat(value as string)
  const displayVal = typeof value === 'number'
    ? (Number.isInteger(value) ? value.toString() : value.toFixed(1))
    : value

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -2 }}
      className={`scifi-card p-5 flex flex-col gap-3 relative overflow-hidden border ${
        alert ? 'border-red-500/40' : c.border
      }`}
      style={alert ? { boxShadow: '0 0 20px rgba(239,68,68,0.15)' } : undefined}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top left, ${c.glow} 0%, transparent 60%)` }}
      />

      {/* Alert flash */}
      {alert && (
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute top-0 left-0 right-0 h-0.5 bg-red-400"
        />
      )}

      <div className="relative flex items-start justify-between gap-2">
        {/* Icon */}
        <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center flex-shrink-0 ${c.text}`}>
          {icon}
        </div>

        {/* Alert indicator */}
        {alert && (
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <AlertTriangle size={14} className="text-red-400 flex-shrink-0" />
          </motion.div>
        )}
      </div>

      <div className="relative">
        <p className="text-xs font-medium text-slate-500 mb-1.5">{label}</p>
        <div className="flex items-baseline gap-1">
          <motion.span
            key={String(displayVal)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`text-2xl font-bold tracking-tight ${c.text}`}
          >
            {displayVal}
          </motion.span>
          {unit && (
            <span className={`text-sm font-medium ${c.text} opacity-60`}>{unit}</span>
          )}
        </div>

        {/* Subtitle + trend row */}
        <div className="flex items-center justify-between mt-2">
          {subtitle && (
            <p className="text-[11px] text-slate-500 leading-snug flex-1 pr-2">{subtitle}</p>
          )}
          {trend && trend !== 'neutral' && (
            <div className={`flex items-center gap-0.5 flex-shrink-0 ${
              trend === 'up' ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {trend === 'up'
                ? <TrendingUp size={13} />
                : <TrendingDown size={13} />
              }
            </div>
          )}
        </div>
      </div>

      {/* Mini bar for numeric values */}
      {typeof value === 'number' && value <= 100 && unit === '%' && (
        <div className="relative h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 bottom-0 rounded-full"
            style={{
              background: alert
                ? 'linear-gradient(90deg, #ef4444, #f87171)'
                : `linear-gradient(90deg, ${c.text === 'text-cyan-400' ? '#00d4ff' : c.text === 'text-purple-400' ? '#8b5cf6' : c.text === 'text-emerald-400' ? '#10b981' : c.text === 'text-amber-400' ? '#f59e0b' : '#ef4444'}, transparent)`,
              boxShadow: alert ? '0 0 8px rgba(239,68,68,0.5)' : undefined,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(numVal, 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      )}
    </motion.div>
  )
}
