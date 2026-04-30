'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import {
  Download, FileText, Leaf, Zap, Brain, BarChart3,
  TrendingUp, TrendingDown, Calendar, FileBarChart2, Printer,
} from 'lucide-react'

/* ── Mock Data ── */
const weeklyEnergy = Array.from({ length: 7 }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() - (6 - i))
  return {
    day:   d.toLocaleDateString('en', { weekday: 'short' }),
    saved: +(Math.random() * 3 + 1).toFixed(2),
    used:  +(Math.random() * 8 + 4).toFixed(2),
  }
})

const monthlyPredictions = Array.from({ length: 30 }, (_, i) => ({
  day:   i + 1,
  count: Math.floor(Math.random() * 120 + 20),
}))

const recentPredictions = [
  { id: 1, image: 'cat.jpg',    model: 'EdgeVisionNet',   class: 'Egyptian Cat',  conf: 0.94, latency: 38,  energy: 0.000021, time: '2m ago',  status: 'success' },
  { id: 2, image: 'dog.jpg',    model: 'MobileNetV2',     class: 'Golden Retriever', conf: 0.87, latency: 42, energy: 0.000019, time: '8m ago', status: 'success' },
  { id: 3, image: 'bird.jpg',   model: 'EfficientNet-B0', class: 'Robin',         conf: 0.91, latency: 71,  energy: 0.000031, time: '23m ago', status: 'success' },
  { id: 4, image: 'car.jpg',    model: 'ShuffleNet',      class: 'Sports Car',    conf: 0.78, latency: 33,  energy: 0.000015, time: '1h ago',  status: 'success' },
  { id: 5, image: 'flower.jpg', model: 'EdgeVisionNet',   class: 'Sunflower',     conf: 0.96, latency: 36,  energy: 0.000020, time: '2h ago',  status: 'success' },
]

const summaryCards = [
  {
    label: 'Weekly Energy Saved',
    value: '14.7 Wh',
    sub:   'vs cloud baseline (12W)',
    icon:  Leaf,
    color: 'text-emerald-400',
    bg:    'bg-emerald-500/10',
    border:'border-emerald-500/20',
    trend: 'up', trendVal: '+12.3%',
  },
  {
    label: 'Monthly AI Usage',
    value: '2,847',
    sub:   'Predictions this month',
    icon:  Brain,
    color: 'text-purple-400',
    bg:    'bg-purple-500/10',
    border:'border-purple-500/20',
    trend: 'up', trendVal: '+24.1%',
  },
  {
    label: 'Top Model',
    value: 'EdgeVisionNet',
    sub:   '74.2% avg accuracy',
    icon:  BarChart3,
    color: 'text-cyan-400',
    bg:    'bg-cyan-500/10',
    border:'border-cyan-500/20',
    trend: 'neutral', trendVal: 'Stable',
  },
  {
    label: 'CO₂ Reduction',
    value: '0.038 kg',
    sub:   'Saved vs cloud this month',
    icon:  Zap,
    color: 'text-amber-400',
    bg:    'bg-amber-500/10',
    border:'border-amber-500/20',
    trend: 'up', trendVal: '+8.5%',
  },
]

const tooltipStyle = {
  contentStyle: { background: 'rgba(13,19,40,0.95)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '10px', fontSize: 12 },
  cursor: { fill: 'rgba(255,255,255,0.03)' },
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly')

  const exportCSV = () => {
    const rows = recentPredictions.map(p =>
      `${p.id},${p.image},${p.model},${p.class},${(p.conf * 100).toFixed(1)}%,${p.latency}ms,${(p.energy * 1e6).toFixed(2)}µWh,${p.time}`
    )
    const csv = `ID,Image,Model,Class,Confidence,Latency,Energy,Time\n${rows.join('\n')}`
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `evn_report_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium">Auto-generated</span>
          </div>
          <p className="text-sm text-slate-500">
            {new Date().toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            id="report-export-csv"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportCSV}
            className="btn-secondary px-4 py-2 rounded-xl flex items-center gap-2 text-sm"
          >
            <Download size={14} /> Export CSV
          </motion.button>
          <motion.button
            id="report-export-pdf"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.print()}
            className="btn-primary px-4 py-2 rounded-xl flex items-center gap-2 text-sm relative z-10"
          >
            <Printer size={14} /> PDF Report
          </motion.button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => {
          const Icon = card.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`glass-card p-5 border ${card.border} relative overflow-hidden`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.bg.replace('bg-', 'from-')} to-transparent opacity-30 pointer-events-none`} />
              <div className="relative">
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                  <Icon size={20} className={card.color} />
                </div>
                <p className="text-xs text-slate-500 mb-1">{card.label}</p>
                <p className={`text-xl font-bold ${card.color} mb-1`}>{card.value}</p>
                <p className="text-[10px] text-slate-600">{card.sub}</p>
                <div className={`flex items-center gap-1 mt-2 text-xs ${card.trend === 'up' ? 'text-emerald-400' : card.trend === 'down' ? 'text-red-400' : 'text-slate-500'}`}>
                  {card.trend === 'up' ? <TrendingUp size={11} /> : card.trend === 'down' ? <TrendingDown size={11} /> : null}
                  {card.trendVal}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Energy Trend */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-300">7-Day Energy Overview (Wh)</h3>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1"><div className="w-3 h-0.5 rounded bg-emerald-400" /> Saved</span>
              <span className="flex items-center gap-1"><div className="w-3 h-0.5 rounded bg-cyan-400" /> Used</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyEnergy} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="rGradSaved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rGradUsed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="saved" name="Saved" stroke="#10B981" strokeWidth={2} fill="url(#rGradSaved)" dot={false} />
              <Area type="monotone" dataKey="used"  name="Used"  stroke="#00D4FF" strokeWidth={2} fill="url(#rGradUsed)"  dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Predictions */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">Daily Predictions (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyPredictions} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="count" name="Predictions" radius={[4, 4, 0, 0]}>
                {monthlyPredictions.map((_, i) => (
                  <Cell key={i} fill={i % 2 === 0 ? 'rgba(0,212,255,0.7)' : 'rgba(124,58,237,0.7)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Predictions Table */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div>
            <h3 className="text-sm font-semibold text-slate-300">Recent Predictions</h3>
            <p className="text-xs text-slate-500 mt-0.5">Last {recentPredictions.length} inference runs</p>
          </div>
          <FileBarChart2 size={18} className="text-slate-600" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/2">
              <tr>
                {['Image', 'Model', 'Predicted Class', 'Confidence', 'Latency', 'Energy', 'Time', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentPredictions.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-white/3 transition-colors"
                >
                  <td className="px-4 py-3 text-xs text-slate-400 font-mono">{p.image}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${p.model === 'EdgeVisionNet' ? 'text-cyan-400' : 'text-slate-300'}`}>{p.model}</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-200">{p.class}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-white/5 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500" style={{ width: `${p.conf * 100}%` }} />
                      </div>
                      <span className="text-xs text-slate-300">{(p.conf * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-purple-400 font-mono">{p.latency}ms</td>
                  <td className="px-4 py-3 text-xs text-amber-400 font-mono">{(p.energy * 1e6).toFixed(2)}µWh</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{p.time}</td>
                  <td className="px-4 py-3">
                    <span className="badge-online text-[10px]">✓ Success</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
