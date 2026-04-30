'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { telemetryAPI } from '@/lib/api'
import type { Telemetry, TelemetryHistory } from '@/lib/types'
import MetricCard from '@/components/MetricCard'
import LiveChart from '@/components/LiveChart'
import EnergyOrb from '@/components/EnergyOrb'
import {
  Cpu, MemoryStick, BatteryCharging, Thermometer,
  Zap, Leaf, Brain, MonitorDot, AlertTriangle, RefreshCw,
  Sparkles, ArrowRight, Plus, FileBarChart2,
} from 'lucide-react'
import Link from 'next/link'

const DEVICE_ID    = 'laptop_01'
const POLL_MS      = 2000
const CHART_WINDOW = 60

/* ── Mock fallback data when backend is offline ── */
function generateMockTelemetry(): Telemetry {
  const cpu  = 45 + Math.random() * 35
  const temp = 55 + cpu * 0.4 + Math.random() * 5
  return {
    device_id: DEVICE_ID,
    timestamp:  new Date().toISOString(),
    cpu:        +cpu.toFixed(1),
    ram:        +(50 + Math.random() * 30).toFixed(1),
    battery:    +(70 + Math.random() * 20).toFixed(1),
    temp:       +temp.toFixed(1),
    power_w:    +(4 + cpu * 0.12).toFixed(2),
    cpu_freq:   +(2200 + Math.random() * 600).toFixed(0),
    disk:       +(40 + Math.random() * 20).toFixed(1),
    net_sent:   Math.floor(Math.random() * 1000),
    net_recv:   Math.floor(Math.random() * 5000),
    charging:   Math.random() > 0.4,
    online:     true,
    overheat:   temp > 88,
  }
}

const AI_INSIGHTS = [
  '⚡ CPU thermal profile is stable. EdgeVisionNet recommends maintaining current workload.',
  '🔋 Battery health optimal. Consider plugging in when below 20% for best longevity.',
  '🌿 Running 68% more energy-efficient than equivalent cloud inference. Excellent!',
  '🤖 EdgeVisionNet model inference averaged 38ms this session — well within optimal range.',
  '📊 RAM usage trending upward. Consider closing unused applications for peak AI performance.',
]

export default function DashboardPage() {
  const [live,        setLive]        = useState<Telemetry | null>(null)
  const [chartData,   setChartData]   = useState<TelemetryHistory[]>([])
  const [loading,     setLoading]     = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [alert,       setAlert]       = useState<string | null>(null)
  const [isMock,      setIsMock]      = useState(false)
  const [insightIdx,  setInsightIdx]  = useState(0)
  const intervalRef   = useRef<any>(null)
  const insightRef    = useRef<any>(null)

  const fetchLive = useCallback(async () => {
    try {
      const res  = await telemetryAPI.live(DEVICE_ID)
      const data: Telemetry = res.data
      setLive(data)
      setIsMock(false)
      setLastUpdated(new Date())
      setLoading(false)

      if (data.overheat) {
        setAlert(`⚠️ Device overheating: ${data.temp.toFixed(1)}°C! Consider throttling workload.`)
      } else if (alert?.includes('overheating')) {
        setAlert(null)
      }

      setChartData(prev => {
        const point: TelemetryHistory = {
          timestamp: data.timestamp,
          cpu:       data.cpu,
          ram:       data.ram,
          battery:   data.battery,
          temp:      data.temp,
          power_w:   data.power_w,
          charging:  data.charging ? 1 : 0,
        }
        return [...prev, point].slice(-CHART_WINDOW)
      })
    } catch {
      // Fall back to mock data
      const mock = generateMockTelemetry()
      setLive(mock)
      setIsMock(true)
      setLastUpdated(new Date())
      setLoading(false)
      setChartData(prev => {
        const point: TelemetryHistory = {
          timestamp: mock.timestamp,
          cpu:       mock.cpu,
          ram:       mock.ram,
          battery:   mock.battery,
          temp:      mock.temp,
          power_w:   mock.power_w,
          charging:  mock.charging ? 1 : 0,
        }
        return [...prev, point].slice(-CHART_WINDOW)
      })
    }
  }, [alert])

  useEffect(() => {
    // Pre-populate chart with mock history so it doesn't start empty
    const now = Date.now()
    const initialHistory: TelemetryHistory[] = Array.from({ length: 30 }, (_, i) => {
      const cpu = 45 + Math.random() * 30
      return {
        timestamp: new Date(now - (30 - i) * POLL_MS).toISOString(),
        cpu:       +cpu.toFixed(1),
        ram:       +(50 + Math.random() * 25).toFixed(1),
        battery:   +(75 + Math.random() * 15).toFixed(1),
        temp:      +(55 + cpu * 0.35).toFixed(1),
        power_w:   +(4 + cpu * 0.1).toFixed(2),
        charging:  1,
      }
    })
    setChartData(initialHistory)

    fetchLive()
    intervalRef.current = setInterval(fetchLive, POLL_MS)

    // Rotate AI insights
    insightRef.current = setInterval(() => {
      setInsightIdx(i => (i + 1) % AI_INSIGHTS.length)
    }, 6000)

    return () => {
      clearInterval(intervalRef.current)
      clearInterval(insightRef.current)
    }
  }, [fetchLive])

  const totalEnergySaved = chartData.reduce((acc, d) => {
    const cloudW = 12
    const savedW = Math.max(cloudW - (d.power_w || 0), 0)
    return acc + savedW * (POLL_MS / 1000 / 3600)
  }, 0)

  return (
    <div className="space-y-6">
      {/* ── Hero row: Status + Orb ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1">
          {/* Status badge */}
          <div className="flex items-center gap-3 mb-3">
            {live?.online || isMock ? (
              <span className="badge-online">
                <span className="pulse-dot" /> {isMock ? 'Demo Mode' : 'Online'}
              </span>
            ) : (
              <span className="badge-offline">
                <span className="w-2 h-2 rounded-full bg-slate-500" /> Offline
              </span>
            )}
            {isMock && (
              <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                ⚡ Simulated data — Start backend for live metrics
              </span>
            )}
            {lastUpdated && (
              <p className="text-xs text-slate-600 font-mono">{lastUpdated.toLocaleTimeString()}</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Link href="/predict">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary px-4 py-2 text-xs font-semibold flex items-center gap-1.5 relative z-10"
              >
                <Brain size={13} /> Run Inference
              </motion.button>
            </Link>
            <Link href="/reports">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="btn-secondary px-4 py-2 text-xs font-medium rounded-xl flex items-center gap-1.5"
              >
                <FileBarChart2 size={13} /> Export Report
              </motion.button>
            </Link>
            <Link href="/devices">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="btn-secondary px-4 py-2 text-xs font-medium rounded-xl flex items-center gap-1.5"
              >
                <Plus size={13} /> Add Device
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Energy Orb */}
        <div className="hidden sm:block animate-float-y">
          <EnergyOrb size={60} showOrbit />
        </div>
      </div>

      {/* ── AI Insights Banner ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={insightIdx}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.4 }}
          className="glass-card p-4 border border-purple-500/20 flex items-center gap-3"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(0,212,255,0.03) 100%)' }}
        >
          <div className="w-8 h-8 rounded-xl bg-purple-500/15 flex items-center justify-center flex-shrink-0">
            <Sparkles size={16} className="text-purple-400" />
          </div>
          <p className="text-sm text-slate-300 flex-1">{AI_INSIGHTS[insightIdx]}</p>
          <Link href="/analytics" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 flex-shrink-0">
            View <ArrowRight size={12} />
          </Link>
        </motion.div>
      </AnimatePresence>

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

      {/* ── Metric Cards ── */}
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
            label="Device" value={live?.online || isMock ? 'Connected' : 'Offline'}
            icon={<MonitorDot size={20} />} color="cyan"
            subtitle={DEVICE_ID}
          />
          <MetricCard
            id="card-cpu" index={1}
            label="CPU Usage" value={live?.cpu ?? 0} unit="%"
            icon={<Cpu size={20} />} color="cyan"
            trend={live && live.cpu > 70 ? 'up' : 'neutral'}
            alert={!!(live && live.cpu > 90)}
          />
          <MetricCard
            id="card-ram" index={2}
            label="RAM Usage" value={live?.ram ?? 0} unit="%"
            icon={<MemoryStick size={20} />} color="purple"
            trend={live && live.ram > 80 ? 'up' : 'neutral'}
            alert={!!(live && live.ram > 95)}
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
            alert={!!live?.overheat}
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
            trend="up"
          />
          <MetricCard
            id="card-cpu-freq" index={7}
            label="CPU Frequency" value={live?.cpu_freq ?? 0} unit="MHz"
            icon={<RefreshCw size={20} />} color="purple"
            subtitle={`Disk: ${live?.disk?.toFixed(0) ?? 0}% used`}
          />
        </div>
      )}

      {/* ── Live Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LiveChart
          id="chart-cpu"
          title="CPU Usage Over Time (%)"
          data={chartData}
          series={[{ key: 'cpu', label: 'CPU', color: '#00D4FF' }]}
          unit="%"
          referenceValue={90}
          referenceLabel="90% critical"
          type="area"
        />
        <LiveChart
          id="chart-ram"
          title="RAM Usage Over Time (%)"
          data={chartData}
          series={[{ key: 'ram', label: 'RAM', color: '#7C3AED' }]}
          unit="%"
          type="area"
        />
        <LiveChart
          id="chart-battery"
          title="Battery Level Trend (%)"
          data={chartData}
          series={[{ key: 'battery', label: 'Battery', color: '#10B981' }]}
          unit="%"
          type="area"
        />
        <LiveChart
          id="chart-temp"
          title="Temperature Trend (°C)"
          data={chartData}
          series={[{ key: 'temp', label: 'Temp', color: '#F59E0B' }]}
          unit="°C"
          referenceValue={85}
          referenceLabel="85°C limit"
          type="area"
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
        <LiveChart
          id="chart-combined"
          title="CPU + RAM Overlay (%)"
          data={chartData}
          type="line"
          series={[
            { key: 'cpu', label: 'CPU', color: '#00D4FF' },
            { key: 'ram', label: 'RAM', color: '#7C3AED', dashed: true },
          ]}
          unit="%"
        />
      </div>

      {/* Agent setup hint if offline (real backend) */}
      {!isMock && !live?.online && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-6 border border-cyan-500/20"
        >
          <h3 className="text-lg font-semibold text-cyan-400 mb-2">Start your laptop agent</h3>
          <p className="text-sm text-slate-400 mb-4">
            Run the agent on this machine to stream live telemetry to the dashboard.
          </p>
          <div className="bg-[#0A0F1E] rounded-xl p-4 font-mono text-sm text-emerald-400 overflow-x-auto">
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
