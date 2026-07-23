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
  Sparkles, ArrowRight, Plus, FileBarChart2, Activity,
  TrendingUp, Wifi,
} from 'lucide-react'
import Link from 'next/link'

const DEVICE_ID    = 'laptop_01'
const POLL_MS      = 2000
const CHART_WINDOW = 60

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

const quickActions = [
  { label: 'Run Inference',  href: '/predict',  icon: Brain,         color: 'btn-primary' },
  { label: 'Export Report',  href: '/reports',  icon: FileBarChart2, color: 'btn-secondary' },
  { label: 'Add Device',     href: '/devices',  icon: Plus,          color: 'btn-secondary' },
]

export default function DashboardPage() {
  const [live,        setLive]        = useState<Telemetry | null>(null)
  const [chartData,   setChartData]   = useState<TelemetryHistory[]>([])
  const [summary,     setSummary]     = useState<any | null>(null)
  const [loading,     setLoading]     = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [alert,       setAlert]       = useState<string | null>(null)
  const [isMock,      setIsMock]      = useState(false)
  const [insightIdx,  setInsightIdx]  = useState(0)
  const intervalRef = useRef<any>(null)
  const insightRef  = useRef<any>(null)

  const fetchLive = useCallback(async () => {
    try {
      const [liveRes, summaryRes] = await Promise.all([
        telemetryAPI.live(DEVICE_ID),
        telemetryAPI.summary(DEVICE_ID, 24).catch(() => null),
      ])
      const data: Telemetry = liveRes.data
      setLive(data)
      if (summaryRes?.data) setSummary(summaryRes.data)
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
          timestamp: data.timestamp, cpu: data.cpu, ram: data.ram,
          battery: data.battery, temp: data.temp, power_w: data.power_w,
          charging: data.charging ? 1 : 0,
        }
        return [...prev, point].slice(-CHART_WINDOW)
      })
    } catch {
      const mock = generateMockTelemetry()
      setLive(mock)
      setIsMock(true)
      setLastUpdated(new Date())
      setLoading(false)
      setChartData(prev => {
        const point: TelemetryHistory = {
          timestamp: mock.timestamp, cpu: mock.cpu, ram: mock.ram,
          battery: mock.battery, temp: mock.temp, power_w: mock.power_w,
          charging: mock.charging ? 1 : 0,
        }
        return [...prev, point].slice(-CHART_WINDOW)
      })
    }
  }, [alert])

  useEffect(() => {
    const now = Date.now()
    const initialHistory: TelemetryHistory[] = Array.from({ length: 30 }, (_, i) => {
      const cpu = 45 + Math.random() * 30
      return {
        timestamp: new Date(now - (30 - i) * POLL_MS).toISOString(),
        cpu: +cpu.toFixed(1), ram: +(50 + Math.random() * 25).toFixed(1),
        battery: +(75 + Math.random() * 15).toFixed(1),
        temp: +(55 + cpu * 0.35).toFixed(1), power_w: +(4 + cpu * 0.1).toFixed(2),
        charging: 1,
      }
    })
    setChartData(initialHistory)
    fetchLive()
    intervalRef.current = setInterval(fetchLive, POLL_MS)
    insightRef.current  = setInterval(() => setInsightIdx(i => (i + 1) % AI_INSIGHTS.length), 6000)
    return () => { clearInterval(intervalRef.current); clearInterval(insightRef.current) }
  }, [fetchLive])

  const totalEnergySaved = chartData.reduce((acc, d) => {
    const cloudW = 12
    const savedW = Math.max(cloudW - (d.power_w || 0), 0)
    return acc + savedW * (POLL_MS / 1000 / 3600)
  }, 0)

  return (
    <div className="space-y-6">
      {/* ── Header Row ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Status badges */}
          <div className="flex items-center gap-3 mb-4">
            {live?.online || isMock ? (
              <span className="badge-online">
                <span className="pulse-dot" /> {isMock ? 'Demo Mode' : 'Online'}
              </span>
            ) : (
              <span className="badge-offline">
                <span className="w-2 h-2 rounded-full bg-slate-500 inline-block" /> Offline
              </span>
            )}
            {isMock && (
              <span className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                ⚡ Simulated data — start backend for live metrics
              </span>
            )}
            {lastUpdated && (
              <p className="text-xs text-slate-600">
                Updated {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            {quickActions.map(({ label, href, icon: Icon, color }) => (
              <Link key={href} href={href}>
                <motion.button
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className={`${color} px-4 py-2 text-sm flex items-center gap-1.5`}
                >
                  <Icon size={14} /> {label}
                </motion.button>
              </Link>
            ))}
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
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.35 }}
          className="glass-card p-4 border border-purple-500/20 flex items-center gap-3"
          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.06) 0%, rgba(0,212,255,0.03) 100%)' }}
        >
          <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center flex-shrink-0">
            <Sparkles size={15} className="text-purple-400" />
          </div>
          <p className="text-sm text-slate-300 flex-1">{AI_INSIGHTS[insightIdx]}</p>
          <Link href="/analytics" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 flex-shrink-0 transition-colors">
            View <ArrowRight size={11} />
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
            className="flex items-center gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 text-sm"
          >
            <AlertTriangle size={16} className="flex-shrink-0" />
            {alert}
            <button onClick={() => setAlert(null)} className="ml-auto text-amber-500 hover:text-amber-300 text-xl leading-none">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Summary Stats ── */}
      {summary && !loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Health Score',    value: summary.health_score, unit: '/100', color: 'text-emerald-400', icon: <Activity size={16} /> },
            { label: 'Avg Power',       value: `${summary.avg_power_w}W`,          color: 'text-amber-400',  icon: <Zap size={16} /> },
            { label: 'Total Energy',    value: `${(summary.total_energy_kwh * 1000).toFixed(2)}Wh`, color: 'text-cyan-400', icon: <TrendingUp size={16} /> },
            { label: 'CO₂ Generated',   value: `${summary.co2_generated_kg}kg`,    color: 'text-purple-400', icon: <Leaf size={16} /> },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-4 flex items-center gap-3"
            >
              <div className={`${s.color} opacity-60`}>{s.icon}</div>
              <div>
                <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[11px] text-slate-500">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Metric Cards ── */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard id="card-device"   index={0} label="Device"         value={live?.online || isMock ? 'Connected' : 'Offline'}  icon={<MonitorDot size={18} />} color="cyan"    subtitle={DEVICE_ID} />
          <MetricCard id="card-cpu"      index={1} label="CPU Usage"      value={live?.cpu ?? 0}     unit="%"  icon={<Cpu size={18} />}           color="cyan"    trend={live && live.cpu > 70 ? 'up' : 'neutral'} alert={!!(live && live.cpu > 90)} />
          <MetricCard id="card-ram"      index={2} label="RAM Usage"      value={live?.ram ?? 0}     unit="%"  icon={<MemoryStick size={18} />}   color="purple"  trend={live && live.ram > 80 ? 'up' : 'neutral'} alert={!!(live && live.ram > 95)} />
          <MetricCard id="card-battery"  index={3} label="Battery"        value={live?.battery ?? 0} unit="%"  icon={<BatteryCharging size={18} />} color="emerald" subtitle={live?.charging ? '⚡ Charging' : 'On battery'} trend={live?.charging ? 'up' : 'down'} />
          <MetricCard id="card-temp"     index={4} label="Temperature"    value={live?.temp ?? 0}    unit="°C" icon={<Thermometer size={18} />}   color={live && live.temp > 80 ? 'danger' : 'amber'} alert={!!live?.overheat} subtitle={live?.overheat ? 'OVERHEATING' : 'Normal'} />
          <MetricCard id="card-power"    index={5} label="Power Draw"     value={live?.power_w ?? 0} unit="W"  icon={<Zap size={18} />}           color="amber"   subtitle={`Base: 15W @ CPU ${live?.cpu?.toFixed(0) ?? 0}%`} />
          <MetricCard id="card-energy"   index={6} label="Energy Saved"   value={(totalEnergySaved * 1000).toFixed(4)} unit="mWh" icon={<Leaf size={18} />} color="emerald" subtitle="vs cloud baseline (12W)" trend="up" />
          <MetricCard id="card-cpu-freq" index={7} label="CPU Frequency"  value={live?.cpu_freq ?? 0} unit="MHz" icon={<RefreshCw size={18} />}  color="purple"  subtitle={`Disk: ${live?.disk?.toFixed(0) ?? 0}% used`} />
        </div>
      )}

      {/* ── Live Charts ── */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
          <Wifi size={14} className="text-cyan-400" /> Live Telemetry Streams
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <LiveChart id="chart-cpu"      title="CPU Usage (%)"           data={chartData} series={[{ key: 'cpu',     label: 'CPU',    color: '#00d4ff' }]} unit="%"  referenceValue={90} referenceLabel="90% critical" type="area" />
          <LiveChart id="chart-ram"      title="RAM Usage (%)"           data={chartData} series={[{ key: 'ram',     label: 'RAM',    color: '#8b5cf6' }]} unit="%"  type="area" />
          <LiveChart id="chart-battery"  title="Battery Level (%)"       data={chartData} series={[{ key: 'battery', label: 'Battery',color: '#10b981' }]} unit="%"  type="area" />
          <LiveChart id="chart-temp"     title="Temperature (°C)"        data={chartData} series={[{ key: 'temp',    label: 'Temp',   color: '#f59e0b' }]} unit="°C" referenceValue={85} referenceLabel="85°C limit" type="area" />
          <LiveChart id="chart-power"    title="Estimated Power Draw (W)" data={chartData} series={[{ key: 'power_w', label: 'Edge Power', color: '#00d4ff' }]} unit="W" referenceValue={12} referenceLabel="Cloud 12W" type="area" />
          <LiveChart id="chart-combined" title="CPU + RAM Overlay (%)"   data={chartData} series={[{ key: 'cpu', label: 'CPU', color: '#00d4ff' }, { key: 'ram', label: 'RAM', color: '#8b5cf6', dashed: true }]} unit="%" type="line" />
        </div>
      </div>

      {/* Agent setup hint */}
      {!isMock && !live?.online && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-6 border border-cyan-500/20"
        >
          <h3 className="text-base font-semibold text-white mb-2">Start your laptop agent</h3>
          <p className="text-sm text-slate-400 mb-4">
            Run the agent on this machine to stream live telemetry to the dashboard.
          </p>
          <div className="bg-[#050810] rounded-lg p-4 font-mono text-sm text-emerald-400 overflow-x-auto border border-white/5">
            <span className="text-slate-600"># In a new terminal:</span><br />
            <span className="text-slate-500">cd </span>agent<br />
            pip install -r requirements.txt<br />
            python laptop_agent.py
          </div>
        </motion.div>
      )}
    </div>
  )
}
