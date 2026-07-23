'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
} from 'recharts'
import { energyAPI, predictionAPI } from '@/lib/api'
import type { Comparison, EnergyReport, ModelStat } from '@/lib/types'
import { Zap, Leaf, TrendingDown, Cloud, Cpu, BarChart3, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

const DEVICE_ID = 'laptop_01'
type SortKey = 'model' | 'accuracy' | 'avg_latency_ms' | 'model_size_mb' | 'energy_wh'
type SortDir = 'asc' | 'desc'

const tooltipStyle = {
  contentStyle: {
    background: 'rgba(8,11,18,0.95)', border: '1px solid rgba(0,212,255,0.2)',
    borderRadius: '10px', fontSize: 12, fontFamily: 'JetBrains Mono',
  },
  cursor: { fill: 'rgba(255,255,255,0.03)' },
}

export default function ComparePage() {
  const [comparison, setComparison] = useState<Comparison | null>(null)
  const [report,     setReport]     = useState<EnergyReport | null>(null)
  const [models,     setModels]     = useState<ModelStat[]>([])
  const [sortKey,    setSortKey]    = useState<SortKey>('accuracy')
  const [sortDir,    setSortDir]    = useState<SortDir>('desc')
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [c, r, m] = await Promise.all([
          energyAPI.comparison(DEVICE_ID),
          energyAPI.report(),
          predictionAPI.modelStats(),
        ])
        setComparison(c.data)
        setReport(r.data)
        setModels(m.data)
      } catch {}
      finally { setLoading(false) }
    }
    load()
  }, [])

  const sortModels = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const sortedModels = [...models].sort((a, b) => {
    const v = (x: ModelStat) => (typeof x[sortKey] === 'number' ? x[sortKey] as number : 0)
    return sortDir === 'asc' ? v(a) - v(b) : v(b) - v(a)
  })

  const barData = comparison ? [
    { name: 'Cloud AI',       power: comparison.cloud_watt, fill: '#ef4444' },
    { name: 'Edge (Current)', power: comparison.edge_watt,  fill: '#00d4ff' },
  ] : []

  const radarData = models.map(m => ({
    model:   m.model.replace('EfficientNet-', 'Eff-'),
    accuracy: m.accuracy,
    speed:    Math.max(0, 100 - m.avg_latency_ms),
    efficiency: Math.max(0, 100 - m.energy_wh * 1e7),
    compact:  Math.max(0, 100 - m.model_size_mb * 2),
  }))

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k
      ? sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
      : <ChevronsUpDown size={12} className="opacity-30" />

  const TH = ({ k, label }: { k: SortKey; label: string }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-cyan-400 select-none transition-colors"
      onClick={() => sortModels(k)}
    >
      <span className="flex items-center gap-1">{label} <SortIcon k={k} /></span>
    </th>
  )

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-40 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Edge vs Cloud Comparison</h1>
        <p className="page-subtitle">Energy savings, CO₂ reduction, and model benchmark analytics</p>
      </div>

      {/* Savings Cards */}
      {comparison && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Edge Power',  value: `${comparison.edge_watt.toFixed(2)}W`,           icon: <Cpu size={20} />,   color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/20',   sub: 'Current device draw' },
            { label: 'Cloud Equiv', value: `${comparison.cloud_watt}W`,                      icon: <Cloud size={20} />, color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20',    sub: 'Simulated cloud cost' },
            { label: 'Power Saved', value: `${comparison.saved_watt.toFixed(2)}W`,           icon: <Zap size={20} />,   color: 'text-emerald-400',bg: 'bg-emerald-500/10',border: 'border-emerald-500/20',sub: 'Per inference' },
            { label: 'Monthly CO₂', value: `${comparison.monthly_co2_kg.toFixed(3)}kg`,     icon: <Leaf size={20} />,  color: 'text-emerald-400',bg: 'bg-emerald-500/10',border: 'border-emerald-500/20',sub: 'Saved vs cloud' },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`glass-card p-5 border ${card.border}`}
            >
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center ${card.color} mb-4`}>{card.icon}</div>
              <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
              <p className="text-sm font-medium text-slate-300 mt-1">{card.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{card.sub}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Charts Row */}
      {comparison && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Bar chart */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Power Consumption Comparison (W)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} barCategoryGap="40%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="power" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Projection */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Energy Savings Projection</h3>
            <div className="space-y-3">
              {[
                { label: 'Daily Energy Saved',    value: `${(comparison.daily_kwh * 1000).toFixed(4)} Wh`,  icon: <TrendingDown size={14} className="text-emerald-400" /> },
                { label: 'Monthly Energy Saved',  value: `${comparison.monthly_kwh.toFixed(4)} kWh`,         icon: <TrendingDown size={14} className="text-emerald-400" /> },
                { label: 'Daily CO₂ Reduction',   value: `${comparison.daily_co2_kg.toFixed(6)} kg`,          icon: <Leaf size={14} className="text-emerald-400" /> },
                { label: 'Monthly CO₂ Reduction', value: `${comparison.monthly_co2_kg.toFixed(4)} kg`,         icon: <Leaf size={14} className="text-emerald-400" /> },
                { label: 'Assumption',            value: `${comparison.daily_inferences} inferences/day`,      icon: <BarChart3 size={14} className="text-cyan-400" /> },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                  <span className="flex items-center gap-2 text-sm text-slate-400">{row.icon} {row.label}</span>
                  <span className="text-sm font-semibold text-white">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Radar chart + Energy Report */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {radarData.length > 0 && (
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Model Performance Radar</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="model" tick={{ fill: '#64748b', fontSize: 11 }} />
                <PolarRadiusAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                {['accuracy', 'speed', 'efficiency', 'compact'].map((key, i) => {
                  const colors = ['#00d4ff', '#8b5cf6', '#10b981', '#f59e0b']
                  return (
                    <Radar key={key} name={key} dataKey={key} stroke={colors[i]} fill={colors[i]} fillOpacity={0.05} strokeWidth={1.5} />
                  )
                })}
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {report && (
          <div className="glass-card p-5 border border-emerald-500/20">
            <h3 className="text-sm font-semibold text-slate-200 mb-4">Your Energy Usage Report</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Total Predictions',  value: report.total_predictions.toString(),             color: 'text-cyan-400' },
                { label: 'Total Energy Used',   value: `${(report.total_energy_wh * 1e6).toFixed(2)} µWh`, color: 'text-amber-400' },
                { label: 'Avg Latency',         value: `${report.avg_latency_ms.toFixed(1)} ms`,       color: 'text-purple-400' },
                { label: 'Cloud Equiv',          value: `${(report.cloud_equiv_wh * 1e6).toFixed(2)} µWh`, color: 'text-red-400' },
                { label: 'Energy Saved',         value: `${(report.energy_saved_wh * 1e6).toFixed(2)} µWh`, color: 'text-emerald-400' },
                { label: 'CO₂ Saved',            value: `${report.co2_saved_kg.toFixed(8)} kg`,        color: 'text-emerald-400' },
              ].map((item) => (
                <div key={item.label} className="glass-card p-3">
                  <p className={`text-base font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Model Benchmark Table */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-white/6">
          <h3 className="text-sm font-semibold text-slate-200">Model Analytics — Benchmark Comparison</h3>
          <p className="text-xs text-slate-500 mt-0.5">Click column headers to sort</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/2">
              <tr>
                <TH k="model"          label="Model"        />
                <TH k="accuracy"       label="Accuracy (%)" />
                <TH k="avg_latency_ms" label="Latency (ms)" />
                <TH k="model_size_mb"  label="Size (MB)"    />
                <TH k="energy_wh"      label="Energy/inf"   />
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sortedModels.map((m, i) => (
                <motion.tr
                  key={m.model}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className={`hover:bg-white/3 transition-colors ${m.model === 'EdgeVisionNet' ? 'bg-cyan-500/4' : ''}`}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-white">{m.model}</span>
                      {m.model === 'EdgeVisionNet' && (
                        <span className="px-1.5 py-0.5 bg-cyan-500/20 border border-cyan-500/30 rounded text-[10px] text-cyan-400">★ Edge</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-white/5 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${m.accuracy}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                      <span className="text-sm text-slate-300">{m.accuracy}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-purple-400 font-mono">{m.avg_latency_ms} ms</td>
                  <td className="px-4 py-3.5 text-sm text-slate-300">{m.model_size_mb} MB</td>
                  <td className="px-4 py-3.5 text-sm text-amber-400 font-mono">{(m.energy_wh * 1e6).toFixed(2)} µWh</td>
                  <td className="px-4 py-3.5 text-xs text-slate-500 max-w-xs">{m.description}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
