'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { telemetryAPI } from '@/lib/api'
import type { TelemetryHistory } from '@/lib/types'
import LiveChart from '@/components/LiveChart'
import { BarChart3, Clock, Download, RefreshCw } from 'lucide-react'

const DEVICE_ID = 'laptop_01'
const TIME_OPTIONS = [
  { label: '30 min', hours: 0.5 },
  { label: '1 hour', hours: 1   },
  { label: '6 hours', hours: 6  },
  { label: '24 hours', hours: 24 },
  { label: '7 days', hours: 168 },
]

export default function AnalyticsPage() {
  const [data,    setData]    = useState<TelemetryHistory[]>([])
  const [hours,   setHours]   = useState(1)
  const [loading, setLoading] = useState(true)
  const [stats,   setStats]   = useState({ avgCpu: 0, avgRam: 0, avgTemp: 0, avgPower: 0, count: 0 })

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    try {
      const res = await telemetryAPI.history(DEVICE_ID, hours)
      const records: TelemetryHistory[] = res.data
      setData(records)

      if (records.length > 0) {
        const n = records.length
        setStats({
          avgCpu:   records.reduce((s, r) => s + r.cpu, 0)     / n,
          avgRam:   records.reduce((s, r) => s + r.ram, 0)     / n,
          avgTemp:  records.reduce((s, r) => s + r.temp, 0)    / n,
          avgPower: records.reduce((s, r) => s + r.power_w, 0) / n,
          count:    n,
        })
      }
    } catch {}
    finally { setLoading(false) }
  }, [hours])

  useEffect(() => { fetchHistory() }, [fetchHistory])

  // CSV Export
  const exportCSV = () => {
    const header = 'timestamp,cpu,ram,battery,temp,power_w,charging\n'
    const rows   = data
      .map((r) => `${r.timestamp},${r.cpu},${r.ram},${r.battery},${r.temp},${r.power_w},${r.charging}`)
      .join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `edgevisionnet_telemetry_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // PDF / Print
  const exportPDF = () => window.print()

  const summaryCards = [
    { label: 'Avg CPU',   value: `${stats.avgCpu.toFixed(1)}%`,  color: 'text-cyan-400'   },
    { label: 'Avg RAM',   value: `${stats.avgRam.toFixed(1)}%`,  color: 'text-purple-400' },
    { label: 'Avg Temp',  value: `${stats.avgTemp.toFixed(1)}°C`, color: 'text-amber-400'  },
    { label: 'Avg Power', value: `${stats.avgPower.toFixed(2)}W`, color: 'text-emerald-400'},
    { label: 'Data Points', value: stats.count.toString(),        color: 'text-cyan-400'   },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Historical <span className="gradient-text">Analytics</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Telemetry trends over time</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Time range selector */}
          <div className="flex items-center gap-1 glass-card p-1 rounded-xl">
            {TIME_OPTIONS.map((opt) => (
              <button
                key={opt.hours}
                onClick={() => setHours(opt.hours)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  hours === opt.hours
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <motion.button
            id="analytics-refresh-btn"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={fetchHistory}
            className="btn-secondary px-3 py-2 rounded-xl flex items-center gap-2 text-xs"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </motion.button>
          <motion.button
            id="export-csv-btn"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={exportCSV}
            className="btn-secondary px-3 py-2 rounded-xl flex items-center gap-2 text-xs"
          >
            <Download size={14} />
            CSV
          </motion.button>
          <motion.button
            id="export-pdf-btn"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={exportPDF}
            className="btn-primary px-3 py-2 rounded-xl flex items-center gap-2 text-xs relative z-10"
          >
            <Download size={14} />
            PDF Report
          </motion.button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-4 text-center"
          >
            <p className="text-xs text-slate-500 mb-1">{card.label}</p>
            <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-52 rounded-2xl" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <BarChart3 size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No telemetry data for this time range.</p>
          <p className="text-slate-600 text-sm mt-1">Start the laptop agent and collect some data first.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <LiveChart id="hist-cpu"     title="CPU Usage (%)"           data={data} series={[{ key: 'cpu',     label: 'CPU',     color: '#00D4FF' }]} unit="%" />
          <LiveChart id="hist-ram"     title="RAM Usage (%)"           data={data} series={[{ key: 'ram',     label: 'RAM',     color: '#7C3AED' }]} unit="%" />
          <LiveChart id="hist-battery" title="Battery Level (%)"       data={data} series={[{ key: 'battery', label: 'Battery', color: '#10B981' }]} unit="%" />
          <LiveChart id="hist-temp"    title="Temperature (°C)"        data={data} series={[{ key: 'temp',    label: 'Temp',    color: '#F59E0B' }]} unit="°C" referenceValue={85} />
          <LiveChart id="hist-power"   title="Estimated Power Draw (W)" data={data} series={[{ key: 'power_w', label: 'Power', color: '#00D4FF' }]} unit="W" referenceValue={12} referenceLabel="Cloud 12W" />
          <LiveChart
            id="hist-combined"
            title="CPU + RAM Overlay (%)"
            data={data}
            type="line"
            series={[
              { key: 'cpu', label: 'CPU', color: '#00D4FF' },
              { key: 'ram', label: 'RAM', color: '#7C3AED', dashed: true },
            ]}
            unit="%"
          />
        </div>
      )}
    </div>
  )
}
