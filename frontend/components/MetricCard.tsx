'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MetricCardProps {
  id:       string
  label:    string
  value:    string | number
  unit?:    string
  subtitle?: string
  icon:     React.ReactNode
  color:    'cyan' | 'purple' | 'emerald' | 'amber' | 'danger'
  trend?:   'up' | 'down' | 'neutral'
  alert?:   boolean
  index?:   number
}

const colorMap = {
  cyan:    { bg: 'from-cyan-500/10 to-cyan-500/0',     border: 'border-cyan-500/20',   text: 'text-cyan-400',   icon: 'bg-cyan-500/15'   },
  purple:  { bg: 'from-purple-500/10 to-purple-500/0', border: 'border-purple-500/20', text: 'text-purple-400', icon: 'bg-purple-500/15' },
  emerald: { bg: 'from-emerald-500/10 to-emerald-500/0', border: 'border-emerald-500/20', text: 'text-emerald-400', icon: 'bg-emerald-500/15' },
  amber:   { bg: 'from-amber-500/10 to-amber-500/0',   border: 'border-amber-500/20',  text: 'text-amber-400',  icon: 'bg-amber-500/15'  },
  danger:  { bg: 'from-red-500/10 to-red-500/0',       border: 'border-red-500/20',    text: 'text-red-400',    icon: 'bg-red-500/15'    },
}

export default function MetricCard({
  id, label, value, unit, subtitle, icon, color, trend, alert, index = 0,
}: MetricCardProps) {
  const c = colorMap[color]
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`glass-card p-5 relative overflow-hidden ${alert ? 'border-red-500/40' : c.border}`}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${c.bg} pointer-events-none`} />

      {/* Alert pulse */}
      {alert && (
        <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-red-500">
          <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
        </div>
      )}

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">{label}</p>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl font-bold metric-number ${c.text}`}>
              {typeof value === 'number' ? value.toFixed(value < 10 ? 2 : 1) : value}
            </span>
            {unit && <span className="text-sm text-slate-400">{unit}</span>}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1.5">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 ${
              trend === 'up' ? 'text-emerald-400' :
              trend === 'down' ? 'text-red-400' : 'text-slate-500'
            }`}>
              <TrendIcon size={12} />
              <span className="text-xs">
                {trend === 'up' ? 'Rising' : trend === 'down' ? 'Falling' : 'Stable'}
              </span>
            </div>
          )}
        </div>

        {/* Icon */}
        <div className={`w-11 h-11 rounded-xl ${c.icon} flex items-center justify-center ml-4 flex-shrink-0`}>
          <div className={c.text}>{icon}</div>
        </div>
      </div>
    </motion.div>
  )
}
