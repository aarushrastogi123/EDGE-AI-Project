'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { telemetryAPI } from '@/lib/api'
import type { Device } from '@/lib/types'
import { Monitor, Smartphone, Plus, RefreshCw, Wifi, WifiOff, Clock, Cpu, Activity } from 'lucide-react'

const PLACEHOLDER_PHONE: Device = {
  id: 999,
  device_id: 'phone_01',
  device_name: 'Android Phone',
  device_type: 'android',
  status: 'offline',
  last_seen: null,
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDevices = async () => {
    setLoading(true)
    try {
      const res = await telemetryAPI.devices()
      setDevices(res.data)
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { fetchDevices() }, [])

  const allDevices = [...devices, PLACEHOLDER_PHONE]
  const online  = allDevices.filter(d => d.status === 'online').length
  const offline = allDevices.filter(d => d.status !== 'online').length

  const DeviceIcon = ({ type, size = 24 }: { type: string; size?: number }) =>
    type === 'android' ? <Smartphone size={size} /> : <Monitor size={size} />

  const colorForType = (t: string) => t === 'android'
    ? { text: 'text-emerald-400', bg: 'bg-emerald-500/12', border: 'border-emerald-500/20' }
    : { text: 'text-cyan-400',    bg: 'bg-cyan-500/12',    border: 'border-cyan-500/20'    }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Device Management</h1>
          <p className="page-subtitle">Connected edge devices and their live status</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            id="refresh-devices-btn"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={fetchDevices}
            className="btn-secondary px-3.5 py-2 text-sm flex items-center gap-2"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </motion.button>
          <motion.button
            id="add-device-btn"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
          >
            <Plus size={15} /> Add Device
          </motion.button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Devices', value: allDevices.length, color: 'text-cyan-400',    bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20',    icon: <Cpu size={18} /> },
          { label: 'Online',         value: online,            color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: <Wifi size={18} /> },
          { label: 'Offline',        value: offline,           color: 'text-slate-400',   bg: 'bg-white/5',        border: 'border-white/8',        icon: <WifiOff size={18} /> },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`glass-card p-5 border ${s.border} flex items-center gap-4`}
          >
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center ${s.color}`}>{s.icon}</div>
            <div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Device Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[0, 1].map((i) => <div key={i} className="skeleton h-52 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allDevices.map((device, i) => {
            const isPlaceholder = device.id === 999
            const col = colorForType(device.device_type)
            return (
              <motion.div
                key={device.device_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className={`glass-card p-6 relative overflow-hidden border ${
                  isPlaceholder
                    ? 'border-dashed border-white/8 opacity-60'
                    : device.status === 'online'
                    ? 'border-emerald-500/20'
                    : 'border-white/8'
                }`}
              >
                {isPlaceholder && (
                  <div className="absolute top-3 right-3">
                    <span className="text-[9px] bg-amber-500/15 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-full font-semibold">Phase 2</span>
                  </div>
                )}

                {device.status === 'online' && (
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
                )}

                <div className="flex items-start gap-4 mb-5">
                  <div className={`w-14 h-14 rounded-2xl ${col.bg} border ${col.border} flex items-center justify-center flex-shrink-0 ${col.text}`}>
                    <DeviceIcon type={device.device_type} size={26} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate mb-0.5">{device.device_name}</h3>
                    <p className={`text-xs font-mono ${col.text} opacity-70 mb-2`}>{device.device_id}</p>
                    <div className="flex items-center gap-1.5">
                      {device.status === 'online' ? (
                        <>
                          <span className="pulse-dot" />
                          <span className="text-xs text-emerald-400 font-semibold">Online</span>
                        </>
                      ) : (
                        <>
                          <WifiOff size={11} className="text-slate-500" />
                          <span className="text-xs text-slate-500">Offline</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-2 border-t border-white/5">
                    <span className="text-slate-500">Type</span>
                    <span className={`font-semibold capitalize ${col.text}`}>{device.device_type}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-white/5">
                    <span className="text-slate-500">Last Seen</span>
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Clock size={10} />
                      {device.last_seen
                        ? new Date(device.last_seen).toLocaleTimeString()
                        : isPlaceholder ? 'Not connected' : 'Never'}
                    </span>
                  </div>
                </div>

                {isPlaceholder && (
                  <div className="mt-4 pt-3 border-t border-white/5">
                    <p className="text-[11px] text-slate-600 text-center">Android integration coming in Phase 2</p>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Phase 2 Info Card */}
      <div className="glass-card p-6 border border-purple-500/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
            <Smartphone size={18} className="text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1.5">Phase 2: Android Integration</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              The backend is already ready for Android devices. Deploy the phone agent or build a
              native Android app to stream telemetry. The dashboard will automatically detect and
              display new devices.
            </p>
            <div className="bg-[#050810] rounded-lg p-3 font-mono text-xs text-emerald-400 border border-white/5">
              python agent/future_phone_agent.py --adb
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
