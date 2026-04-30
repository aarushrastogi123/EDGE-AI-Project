'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Bell, Palette, Cpu, Shield, Info,
  ChevronRight, Save, Sun, Moon, Sliders,
  Mail, Smartphone, AlertTriangle, Code, ExternalLink,
} from 'lucide-react'

type Tab = 'account' | 'appearance' | 'notifications' | 'devices' | 'about'

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'account',       label: 'Account',       icon: User    },
  { id: 'appearance',    label: 'Appearance',    icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell    },
  { id: 'devices',       label: 'Devices',       icon: Cpu     },
  { id: 'about',         label: 'About',         icon: Info    },
]

function ToggleRow({ label, sub, defaultOn = false }: { label: string; sub: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-200">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
      </div>
      <label className="toggle-switch" onClick={() => setOn(!on)}>
        <input type="checkbox" checked={on} readOnly />
        <span className="toggle-slider" />
      </label>
    </div>
  )
}

function SliderRow({ label, sub, min, max, defaultVal, unit }: { label: string; sub: string; min: number; max: number; defaultVal: number; unit: string }) {
  const [val, setVal] = useState(defaultVal)
  return (
    <div className="py-4 border-b border-white/5 last:border-0">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-medium text-slate-200">{label}</p>
          <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
        </div>
        <span className="text-sm font-bold text-cyan-400">{val}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} value={val}
        onChange={e => setVal(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right, #00D4FF ${((val - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) ${((val - min) / (max - min)) * 100}%)` }}
      />
    </div>
  )
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('account')
  const [darkMode,  setDarkMode]  = useState(true)
  const [accent,    setAccent]    = useState('cyan')
  const [saved,     setSaved]     = useState(false)
  const [name,      setName]      = useState('Aarush Rastogi')
  const [email,     setEmail]     = useState('aarush@example.com')

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const accents = [
    { id: 'cyan',    color: '#00D4FF', label: 'Cyan'    },
    { id: 'purple',  color: '#7C3AED', label: 'Purple'  },
    { id: 'emerald', color: '#10B981', label: 'Emerald' },
    { id: 'amber',   color: '#F59E0B', label: 'Amber'   },
  ]

  return (
    <div className="space-y-6">
      {/* Tab Selector */}
      <div className="glass-card p-1.5 flex gap-1 flex-wrap">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              id={`settings-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all flex-1 justify-center sm:flex-initial sm:justify-start ${
                activeTab === tab.id
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-4">
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-5">Profile Information</h3>
                <div className="flex items-center gap-5 mb-6 pb-6 border-b border-white/5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-2xl font-black text-white flex-shrink-0">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">{name}</p>
                    <p className="text-sm text-slate-500">{email}</p>
                    <button className="text-xs text-cyan-400 hover:text-cyan-300 mt-1">Change avatar →</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
                    <input
                      id="settings-name"
                      className="input-field mt-2"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                    <input
                      id="settings-email"
                      type="email"
                      className="input-field mt-2"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-5">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Password</label>
                    <input id="settings-current-pwd" type="password" placeholder="••••••••" className="input-field mt-2" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">New Password</label>
                      <input id="settings-new-pwd" type="password" placeholder="••••••••" className="input-field mt-2" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirm New</label>
                      <input id="settings-confirm-pwd" type="password" placeholder="••••••••" className="input-field mt-2" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card p-5 border border-red-500/15">
                <h3 className="text-sm font-semibold text-red-400 mb-2">Danger Zone</h3>
                <p className="text-xs text-slate-500 mb-3">Permanently delete your account and all associated data.</p>
                <button className="btn-secondary px-4 py-2 text-sm rounded-xl text-red-400 border-red-500/20 hover:bg-red-500/10">
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-5">Theme</h3>
                <div className="flex gap-3">
                  {[
                    { id: true,  label: 'Dark',  Icon: Moon, desc: 'Comfortable for low-light use' },
                    { id: false, label: 'Light', Icon: Sun,  desc: 'Clean and bright interface'    },
                  ].map(mode => (
                    <button
                      key={String(mode.id)}
                      id={`settings-theme-${mode.label.toLowerCase()}`}
                      onClick={() => setDarkMode(mode.id)}
                      className={`flex-1 p-4 rounded-xl border transition-all text-left ${
                        darkMode === mode.id
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                          : 'glass-card border-white/8 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <mode.Icon size={20} className="mb-2" />
                      <p className="font-semibold text-sm">{mode.label}</p>
                      <p className="text-xs mt-0.5 opacity-70">{mode.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-5">Accent Color</h3>
                <div className="flex gap-3 flex-wrap">
                  {accents.map(a => (
                    <button
                      key={a.id}
                      id={`settings-accent-${a.id}`}
                      onClick={() => setAccent(a.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all ${
                        accent === a.id ? 'border-white/30 bg-white/8' : 'border-white/8 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full" style={{ background: a.color }} />
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-1">Chart Animation Speed</h3>
                <SliderRow label="Animation Duration" sub="How fast charts animate on load" min={200} max={2000} defaultVal={600} unit="ms" />
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-2">Alert Preferences</h3>
              <p className="text-xs text-slate-500 mb-5">Configure when and how EdgeVisionNet notifies you.</p>
              <div>
                <ToggleRow label="CPU Overheat Alert"    sub="Notify when CPU exceeds 90°C"             defaultOn />
                <ToggleRow label="Battery Low Warning"   sub="Alert when battery drops below 20%"       defaultOn />
                <ToggleRow label="Device Offline Alert"  sub="Notify when a device goes offline"        defaultOn />
                <ToggleRow label="Prediction Complete"   sub="Show toast when inference finishes"       defaultOn />
                <ToggleRow label="Weekly Energy Report"  sub="Email summary every Monday"               defaultOn={false} />
                <ToggleRow label="Anomaly Detection"     sub="Alert on unusual power spikes"            defaultOn={false} />
                <ToggleRow label="Push Notifications"    sub="Browser push for real-time alerts"        defaultOn={false} />
              </div>

              <div className="mt-5 pt-5 border-t border-white/5">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Alert Thresholds</h4>
                <SliderRow label="CPU Alert Threshold" sub="Trigger alert above this usage" min={50} max={100} defaultVal={90} unit="%" />
                <SliderRow label="Temperature Limit"   sub="Overheat warning threshold"      min={60} max={100} defaultVal={85} unit="°C" />
                <SliderRow label="Battery Low %"       sub="Low battery alert threshold"     min={5}  max={50}  defaultVal={20} unit="%" />
              </div>
            </div>
          )}

          {/* Devices Tab */}
          {activeTab === 'devices' && (
            <div className="space-y-4">
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-5">Device Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Default Device ID</label>
                    <input
                      id="settings-device-id"
                      className="input-field mt-2 font-mono"
                      defaultValue="laptop_01"
                    />
                  </div>
                  <SliderRow
                    label="Telemetry Poll Interval"
                    sub="How often to fetch live metrics"
                    min={1000} max={10000} defaultVal={2000} unit="ms"
                  />
                  <SliderRow
                    label="Chart Window"
                    sub="Number of data points to keep in charts"
                    min={10} max={120} defaultVal={60} unit=" pts"
                  />
                </div>
              </div>
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-2">Telemetry Settings</h3>
                <ToggleRow label="Auto-start on Login"  sub="Begin telemetry polling automatically"      defaultOn />
                <ToggleRow label="Store History Locally" sub="Cache telemetry in localStorage"           defaultOn={false} />
                <ToggleRow label="Show Offline Devices" sub="Display devices that are not connected"     defaultOn />
              </div>
            </div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="space-y-4">
              <div className="glass-card p-8 text-center border border-cyan-500/15">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-glow-cyan">
                  <Cpu size={28} className="text-white" />
                </div>
                <h2 className="text-2xl font-black gradient-text mb-1">EdgeVisionNet</h2>
                <p className="text-slate-500 text-sm mb-3">Real-Time AI Energy Intelligence Platform</p>
                <span className="badge-pro">v1.0.0 PRO</span>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-4">Technology Stack</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    ['Next.js 16',        'Frontend framework'],
                    ['FastAPI',           'Python backend'],
                    ['TensorFlow Lite',   'Edge inference'],
                    ['Tailwind CSS v4',   'UI styling'],
                    ['Framer Motion',     'Animations'],
                    ['Recharts',          'Data visualization'],
                    ['SQLite',            'Local database'],
                    ['JWT Auth',          'Security'],
                    ['psutil',            'Telemetry agent'],
                  ].map(([name, desc]) => (
                    <div key={name} className="glass-card p-3">
                      <p className="text-xs font-semibold text-slate-200">{name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-slate-300 mb-4">Links & Resources</h3>
                <div className="space-y-2">
                  {[
                    { icon: Code,      label: 'Source Code',    href: '#', sub: 'github.com/aarushrastogi123/EDGE-AI-Project' },
                    { icon: ExternalLink, label: 'API Docs',      href: 'http://localhost:8000/docs', sub: 'FastAPI Swagger UI — localhost:8000' },
                    { icon: Shield,      label: 'Privacy Policy', href: '#', sub: 'How we handle your data' },
                  ].map(item => {
                    const Icon = item.icon
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/4 transition-colors group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                          <Icon size={16} className="text-slate-400 group-hover:text-cyan-400 transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-300">{item.label}</p>
                          <p className="text-xs text-slate-600 truncate">{item.sub}</p>
                        </div>
                        <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                      </a>
                    )
                  })}
                </div>
              </div>

              <div className="glass-card p-4 text-center">
                <p className="text-xs text-slate-600">
                  Final Year Major Research Project · Built with ❤️ for edge AI energy intelligence
                </p>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Save Button — shown for account/appearance/notifications/devices tabs */}
      {activeTab !== 'about' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end"
        >
          <motion.button
            id="settings-save-btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            className="btn-primary px-6 py-2.5 text-sm font-semibold flex items-center gap-2 relative z-10"
          >
            <Save size={15} />
            {saved ? '✓ Saved!' : 'Save Changes'}
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}
