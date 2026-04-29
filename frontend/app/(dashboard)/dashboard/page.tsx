'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { telemetryAPI } from '@/lib/api'
import type { Telemetry, TelemetryHistory } from '@/lib/types'
import MetricCard from '@/components/MetricCard'
import LiveChart from '@/components/LiveChart'
import {
  Cpu, MemoryStick, BatteryCharging, Thermometer,
  Zap, Leaf, Brain, MonitorDot, AlertTriangle, RefreshCw,
} from 'lucide-react'

const DEVICE_ID    = 'laptop_01'
const POLL_MS      = 2000
const CHART_WINDOW = 60  // max data points kept

export default function DashboardPage() {
  const [live,         setLive]         = useState<Telemetry | null>(null)
  const [chartData,    setChartData]    = useState<TelemetryHistory[]>([])
  const [loading,      setLoading]      = useState(true)
  const [lastUpdated,  setLastUpdated]  = useState<Date | null>(null)
  const [alert,        setAlert]        = useState<string | null>(null)
  const intervalRef    = useRef<any>(null)

  const fetchLive = useCallback(async () => {
    try {
      const res = await telemetryAPI.live(DEVICE_ID)
      const data: Telemetry = res.data
      setLive(data)
      setLastUpdated(new Date())
      setLoading(false)

      // Alert on overheat
      if (data.overheat) {
        setAlert(`⚠️ Device overheating: ${data.temp.toFixed(1)}°C! Consider throttling workload.`)
      } else if (alert?.includes('overheating')) {
        setAlert(null)
      }

      // Append to rolling chart window
      setChartData((prev) => {
        const next = [...prev, { ...data, timestamp: data.timestamp }]
        return next.slice(-CHART_WINDOW)
      })
    } catch {
      setLoading(false)
    }
  }, [alert])

  // Fetch initial history + start polling
  useEffect(() => {
    const init = async () => {
      try {
        const res = await telemetryAPI.history(DEVICE_ID, 0.5)
        setChartData(res.data.slice(-CHART_WINDOW))
      } catch {}
      fetchLive()
    }
    init()
    intervalRef.current = setInterval(fetchLive, POLL_MS)
    return () => clearInterval(intervalRef.current)
  }, [fetchLive])

  const totalEnergySaved = chartData.reduce((acc, d) => {
    const cloudW = 12
    const savedW = Math.max(cloudW - (d.power_w || 0), 0)
    return acc + savedW * (POLL_MS / 1000 / 3600)
  }, 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Live <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time edge device telemetry & energy intelligence
          </p>
        </div>
        <div className="flex items-center gap-3">
          {live?.online ? (
            <span className="badge-online">
              <span className="pulse-dot" />
              Online
            </span>
          ) : (
            <span className="badge-offline">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              Offline — Start agent
            </span>
          )}
          {lastUpdated && (
            <p className="text-xs text-slate-600 font-mono">
              {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      {/* Alert Banner */}
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="flex items-center gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-sm"
          >
            <AlertTriangle size={16} className="flex-shrink-0" />
            {alert}
            <button onClick={() => setAlert(null)} className="ml-auto text-amber-500 hover:text-amber-300 text-lg leading-none">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metric Cards — 4 columns */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            id="card-device" index={0}
            label="Device" value={live?.online ? 'Connected' : 'Offline'}
            icon={<MonitorDot size={20} />} color="cyan"
            subtitle={DEVICE_ID}
          />
          <MetricCard
            id="card-cpu" index={1}
            label="CPU Usage" value={live?.cpu ?? 0} unit="%"
            icon={<Cpu size={20} />} color="cyan"
            trend={live && live.cpu > 70 ? 'up' : 'neutral'}
            alert={live && live.cpu > 90}
          />
          <MetricCard
            id="card-ram" index={2}
            label="RAM Usage" value={live?.ram ?? 0} unit="%"
            icon={<MemoryStick size={20} />} color="purple"
            trend={live && live.ram > 80 ? 'up' : 'neutral'}
            alert={live && live.ram > 95}
          />
          <MetricCard
            id="card-battery" index={3}
            label="Battery" value={live?.battery ?? 0} unit="%"
            icon={<BatteryCharging size={20} />} color="emerald"
            subtitle={live?.charging ? '⚡ Charging' : 'On battery'}
            trend={live?.charging ? 'up' : 'down'}
          />
          <MetricCard
            id="card-temp" index={4}
            label="Temperature" value={live?.temp ?? 0} unit="°C"
            icon={<Thermometer size={20} />} color={live && live.temp > 80 ? 'danger' : 'amber'}
            alert={live?.overheat}
            subtitle={live?.overheat ? 'OVERHEATING' : 'Normal range'}
          />
          <MetricCard
            id="card-power" index={5}
            label="Est. Power Draw" value={live?.power_w ?? 0} unit="W"
            icon={<Zap size={20} />} color="amber"
            subtitle={`Base: 15W @ CPU ${live?.cpu?.toFixed(0) ?? 0}%`}
          />
          <MetricCard
            id="card-energy-saved" index={6}
            label="Energy Saved" value={(totalEnergySaved * 1000).toFixed(4)} unit="mWh"
            icon={<Leaf size={20} />} color="emerald"
            subtitle="vs cloud baseline (12W)"
          />
          <MetricCard
            id="card-cpu-freq" index={7}
            label="CPU Frequency" value={live?.cpu_freq ?? 0} unit="MHz"
            icon={<RefreshCw size={20} />} color="purple"
            subtitle={`Disk: ${live?.disk?.toFixed(0) ?? 0}% used`}
          />
        </div>
      )}

      {/* Live Charts — 2 column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LiveChart
          id="chart-cpu"
          title="CPU Usage Over Time (%)"
          data={chartData}
          series={[{ key: 'cpu', label: 'CPU', color: '#00D4FF' }]}
          unit="%"
          referenceValue={90}
          referenceLabel="90% critical"
        />
        <LiveChart
          id="chart-ram"
          title="RAM Usage Over Time (%)"
          data={chartData}
          series={[{ key: 'ram', label: 'RAM', color: '#7C3AED' }]}
          unit="%"
        />
        <LiveChart
          id="chart-battery"
          title="Battery Level Trend (%)"
          data={chartData}
          series={[{ key: 'battery', label: 'Battery', color: '#10B981' }]}
          unit="%"
        />
        <LiveChart
          id="chart-temp"
          title="Temperature Trend (°C)"
          data={chartData}
          series={[{ key: 'temp', label: 'Temp', color: '#F59E0B' }]}
          unit="°C"
          referenceValue={85}
          referenceLabel="85°C limit"
        />
        <LiveChart
          id="chart-power"
          title="Estimated Power Draw (W)"
          data={chartData}
          series={[
            { key: 'power_w', label: 'Edge Power', color: '#00D4FF' },
          ]}
          unit="W"
          referenceValue={12}
          referenceLabel="Cloud 12W"
          type="area"
        />
      </div>

      {/* Agent setup hint if offline */}
      {!live?.online && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-6 border border-cyan-500/20"
        >
          <h3 className="text-lg font-semibold text-cyan-400 mb-2">Start your laptop agent</h3>
          <p className="text-sm text-slate-400 mb-4">
            Run the agent on this machine to stream live telemetry to the dashboard.
          </p>
          <div className="bg-navy rounded-xl p-4 font-mono text-sm text-emerald-400 overflow-x-auto">
            <span className="text-slate-500"># In a new terminal:</span><br />
            <span className="text-slate-400">cd </span>agent<br />
            pip install -r requirements.txt<br />
            python laptop_agent.py
          </div>
        </motion.div>
      )}
    </div>
  )
}
