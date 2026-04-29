'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { telemetryAPI } from '@/lib/api'
import type { Device } from '@/lib/types'
import { Monitor, Smartphone, Plus, RefreshCw, Wifi, WifiOff, Clock } from 'lucide-react'

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

  const allDevices = [
    ...devices,
    PLACEHOLDER_PHONE,
  ]

  const DeviceIcon = ({ type }: { type: string }) =>
    type === 'android' ? <Smartphone size={28} /> : <Monitor size={28} />

  const typeColor = (t: string) => t === 'android' ? 'text-emerald-400' : 'text-cyan-400'
  const typeBg    = (t: string) => t === 'android' ? 'bg-emerald-500/10' : 'bg-cyan-500/10'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Device <span className="gradient-text">Management</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Connected edge devices and their status</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            id="refresh-devices-btn"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={fetchDevices}
            className="btn-secondary px-3 py-2 rounded-xl flex items-center gap-2 text-sm"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </motion.button>
          <motion.button
            id="add-device-btn"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="btn-primary px-4 py-2 rounded-xl flex items-center gap-2 text-sm relative z-10"
          >
            <Plus size={16} /> Add Device
          </motion.button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Devices',  value: allDevices.length,                        color: 'text-cyan-400'   },
          { label: 'Online',         value: allDevices.filter(d => d.status === 'online').length,  color: 'text-emerald-400' },
          { label: 'Offline',        value: allDevices.filter(d => d.status === 'offline').length, color: 'text-slate-400'  },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Device Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[0, 1].map((i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allDevices.map((device, i) => {
            const isPlaceholder = device.id === 999
            return (
              <motion.div
                key={device.device_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card p-6 relative overflow-hidden ${
                  isPlaceholder ? 'border-dashed opacity-60' : ''
                } ${device.status === 'online' ? 'border-emerald-500/20' : ''}`}
              >
                {isPlaceholder && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 bg-amber-500/15 border border-amber-500/30 rounded-full text-amber-400 text-[10px] font-medium">
                      Phase 2
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl ${typeBg(device.device_type)} flex items-center justify-center flex-shrink-0 ${typeColor(device.device_type)}`}>
                    <DeviceIcon type={device.device_type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-100 truncate">{device.device_name}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{device.device_id}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      {device.status === 'online' ? (
                        <>
                          <Wifi size={12} className="text-emerald-400" />
                          <span className="text-xs text-emerald-400 font-medium">Online</span>
                          <span className="pulse-dot ml-1" />
                        </>
                      ) : (
                        <>
                          <WifiOff size={12} className="text-slate-500" />
                          <span className="text-xs text-slate-500">Offline</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Type</span>
                    <span className={`font-medium capitalize ${typeColor(device.device_type)}`}>
                      {device.device_type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Last Seen</span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock size={10} />
                      {device.last_seen
                        ? new Date(device.last_seen).toLocaleTimeString()
                        : isPlaceholder ? 'Not yet connected' : 'Never'}
                    </span>
                  </div>
                </div>

                {isPlaceholder && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-xs text-slate-600 text-center">
                      Android integration coming in Phase 2
                    </p>
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
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center flex-shrink-0">
            <Smartphone size={20} className="text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-200 mb-1">Phase 2: Android Integration</h3>
            <p className="text-sm text-slate-400">
              The backend is already ready for Android devices. Deploy the future phone agent
              or build a native Android app to stream telemetry. The dashboard will automatically
              detect and display new devices.
            </p>
            <div className="mt-3 font-mono text-xs text-emerald-400 bg-navy rounded-lg p-3">
              python agent/future_phone_agent.py --adb
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
