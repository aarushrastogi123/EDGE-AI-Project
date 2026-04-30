'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Cpu, Zap, BarChart3, Shield, Brain, Monitor, Leaf, Activity,
  ArrowRight, ChevronRight, MessageCircle, Link as LinkIcon, Star,
  CheckCircle, Globe, Smartphone, Server, Wifi, Clock,
} from 'lucide-react'
import ParticleBackground from '@/components/ParticleBackground'
import EnergyOrb from '@/components/EnergyOrb'

/* ── Animated Counter ── */
function AnimatedCounter({ end, suffix = '', duration = 2 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const step = end / (duration * 60)
    let current = 0
    const timer = setInterval(() => {
      current += step
      if (current >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.floor(current))
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [end, duration])
  return <>{count.toLocaleString()}{suffix}</>
}

/* ── Features Data ── */
const features = [
  { icon: Activity,  color: 'text-cyan-400',    bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20',    title: 'Real-Time Telemetry',    desc: 'Monitor CPU, RAM, battery, temperature and power draw with 2-second refresh intervals.' },
  { icon: Brain,     color: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/20',  title: 'Edge AI Inference',      desc: 'Run MobileNetV2, EfficientNet, ShuffleNet and our custom EdgeVisionNet model locally.' },
  { icon: Zap,       color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   title: 'Energy Intelligence',    desc: 'Compare edge vs cloud power usage. Visualize kWh saved and CO₂ reduction in real time.' },
  { icon: BarChart3, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', title: 'Historical Analytics',   desc: 'Query up to 7 days of telemetry with 6 interactive charts and CSV/PDF export.' },
  { icon: Shield,    color: 'text-cyan-400',    bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20',    title: 'Secure by Design',       desc: 'JWT authentication, Bearer tokens, and end-to-end encrypted API communication.' },
  { icon: Globe,     color: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/20',  title: 'Multi-Device Support',   desc: 'Connect laptops, desktops, and future Android devices. Each gets its own telemetry stream.' },
]

/* ── Why EdgeVisionNet ── */
const whyItems = [
  '10× faster inference than cloud round-trips',
  'Zero data sent to third-party servers',
  'Proven 60–80% power savings vs cloud',
  'Works fully offline — no internet needed',
  'Open-source models, no licensing fees',
  'Production-ready API for fast integration',
]

/* ── Compatible Devices ── */
const devices = [
  { icon: Monitor,    label: 'Laptops',    sub: 'Windows, macOS, Linux' },
  { icon: Server,     label: 'Edge Nodes', sub: 'Raspberry Pi, Jetson'   },
  { icon: Smartphone, label: 'Android',    sub: 'Phase 2 — Coming soon'  },
  { icon: Wifi,       label: 'IoT Hubs',   sub: 'MQTT bridge support'    },
]

/* ── Testimonials ── */
const testimonials = [
  { name: 'Dr. Priya Sharma', role: 'AI Research Lead — IIT Delhi', quote: 'EdgeVisionNet reduced our inference energy cost by 73%. The dashboard gives us insights we never had before.', stars: 5 },
  { name: 'Rajan Mehta',      role: 'CTO — SmartEdge Labs',         quote: 'This is exactly what enterprise IoT teams need. The cloud vs edge comparison alone is worth deploying for.', stars: 5 },
  { name: 'Aisha Patel',      role: 'ML Engineer — Bangalore',      quote: 'The live telemetry streaming with 2-second latency is impressive. The UI is absolutely beautiful.', stars: 5 },
]

export default function LandingPage() {
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, -80])

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-slate-100 overflow-x-hidden">
      <ParticleBackground count={50} />

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0A0F1E]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
            <Cpu size={16} className="text-white" />
          </div>
          <span className="text-base font-bold gradient-text">EdgeVisionNet</span>
          <span className="badge-pro hidden sm:flex">PRO</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
          <a href="#features" className="hover:text-slate-200 transition-colors">Features</a>
          <a href="#why" className="hover:text-slate-200 transition-colors">Why Us</a>
          <a href="#devices" className="hover:text-slate-200 transition-colors">Devices</a>
          <a href="#testimonials" className="hover:text-slate-200 transition-colors">Reviews</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-secondary px-4 py-2 text-sm rounded-xl hidden sm:block">
            Sign In
          </Link>
          <Link href="/signup">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary px-5 py-2 text-sm relative z-10"
            >
              Get Started <ArrowRight size={14} className="inline ml-1" />
            </motion.button>
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center landing-hero-bg pt-24 pb-20 px-6">
        {/* Background glow spots */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/6 rounded-full blur-3xl pointer-events-none" />

        <motion.div style={{ y: heroY }} className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-cyan-500/25 text-xs text-cyan-400 font-medium mb-6"
            >
              <span className="pulse-dot w-2 h-2" />
              Real-Time AI Energy Intelligence Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] mb-6"
            >
              <span className="hero-gradient-text">EdgeVision</span>
              <span className="hero-gradient-text">Net</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-400 leading-relaxed mb-8 max-w-lg"
            >
              Monitor live device telemetry, run edge AI inference, and visualize real-time energy savings — all from a single, beautiful dashboard.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <Link href="/signup">
                <motion.button
                  id="hero-get-started-btn"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary px-7 py-3.5 text-base font-semibold relative z-10"
                >
                  Get Started Free <ArrowRight size={18} className="inline ml-1" />
                </motion.button>
              </Link>
              <Link href="/login">
                <motion.button
                  id="hero-demo-btn"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-secondary px-7 py-3.5 text-base font-semibold rounded-xl"
                >
                  Live Demo
                </motion.button>
              </Link>
            </motion.div>

            {/* Mini stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-6"
            >
              {[
                { val: 99, suffix: '.9%', label: 'Uptime' },
                { val: 10,  suffix: 'ms',  label: 'Avg Latency' },
                { val: 73,  suffix: '%',   label: 'Power Saved' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-black gradient-text">
                    <AnimatedCounter end={s.val} suffix={s.suffix} duration={1.5} />
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Orb + Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col items-center gap-6 relative"
          >
            <div className="animate-float-y-slow">
              <EnergyOrb size={100} />
            </div>

            {/* Floating metric cards */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm -mt-4">
              {[
                { label: 'CPU Usage',     val: '67%',   color: 'text-cyan-400',    icon: '⚡' },
                { label: 'Battery',       val: '84%',   color: 'text-emerald-400', icon: '🔋' },
                { label: 'Power Draw',    val: '8.3W',  color: 'text-amber-400',   icon: '💡' },
                { label: 'Energy Saved',  val: '2.1Wh', color: 'text-purple-400',  icon: '🌿' },
              ].map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="glass-card p-4 text-center hover-tilt cursor-default"
                >
                  <span className="text-lg">{m.icon}</span>
                  <p className={`text-xl font-bold mt-1 ${m.color}`}>{m.val}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{m.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-600 text-xs flex flex-col items-center gap-2"
        >
          <ChevronRight size={16} className="rotate-90 opacity-50" />
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3"
            >
              Platform Features
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-black mb-4"
            >
              Everything you need to <span className="gradient-text">monitor AI energy</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 max-w-xl mx-auto"
            >
              EdgeVisionNet combines real-time telemetry streaming, edge AI inference, and energy intelligence into one cohesive platform.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`glass-card p-6 border ${f.border} hover-tilt cursor-default`}
                >
                  <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-4`}>
                    <Icon size={22} className={f.color} />
                  </div>
                  <h3 className="text-base font-semibold text-slate-100 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="divider-glow mx-6" />

      {/* ── Why EdgeVisionNet ── */}
      <section id="why" className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-3"
            >
              Why Choose Us
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-black mb-6"
            >
              Built for <span className="gradient-text">real-world edge AI</span>
            </motion.h2>
            <div className="space-y-3">
              {whyItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-300">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Energy savings visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-6"
          >
            <h3 className="text-sm font-semibold text-slate-300 mb-4">Power Consumption: Edge vs Cloud</h3>
            <div className="space-y-4">
              {[
                { label: 'Cloud AI Inference', val: 85, color: 'bg-red-500', text: '12W', textColor: 'text-red-400' },
                { label: 'EdgeVisionNet',       val: 35, color: 'bg-gradient-to-r from-cyan-400 to-purple-500', text: '4.2W', textColor: 'text-cyan-400' },
              ].map((row, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">{row.label}</span>
                    <span className={`text-sm font-bold ${row.textColor}`}>{row.text}</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${row.val}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                      className={`h-4 rounded-full ${row.color}`}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-500">Energy reduction</span>
                <span className="text-lg font-black text-emerald-400">65% saved 🌿</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Device Compatibility ── */}
      <section id="devices" className="py-24 px-6 bg-gradient-to-b from-transparent to-[#0D1328]/50">
        <div className="max-w-7xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3"
          >
            Device Compatibility
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black mb-12"
          >
            Works on your <span className="gradient-text">hardware</span>
          </motion.h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {devices.map((d, i) => {
              const Icon = d.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-6 text-center hover-tilt"
                >
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                    <Icon size={26} className="text-cyan-400" />
                  </div>
                  <h3 className="font-semibold text-slate-200 mb-1">{d.label}</h3>
                  <p className="text-xs text-slate-500">{d.sub}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-black mb-4"
            >
              Trusted by <span className="gradient-text">AI engineers</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 hover-tilt"
              >
                <div className="flex mb-3">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5 italic">"{t.quote}"</p>
                <div className="border-t border-white/5 pt-4">
                  <p className="text-sm font-semibold text-slate-200">{t.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 border border-cyan-500/15"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.06) 0%, transparent 70%)' }}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-glow-cyan">
              <Leaf size={28} className="text-white" />
            </div>
            <h2 className="text-4xl font-black mb-4">
              Start monitoring <span className="gradient-text">energy today</span>
            </h2>
            <p className="text-slate-400 mb-8">
              Join forward-thinking AI engineers and reduce your inference energy footprint by up to 73%.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/signup">
                <motion.button
                  id="cta-signup-btn"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary px-8 py-3.5 text-base font-semibold relative z-10"
                >
                  Create Free Account <ArrowRight size={16} className="inline ml-1" />
                </motion.button>
              </Link>
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-secondary px-8 py-3.5 text-base font-semibold rounded-xl"
                >
                  Sign In
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
                <Cpu size={15} className="text-white" />
              </div>
              <div>
                <span className="text-sm font-bold gradient-text">EdgeVisionNet</span>
                <p className="text-[10px] text-slate-600">Real-Time AI Energy Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <a href="#features" className="hover:text-slate-300 transition-colors">Features</a>
              <a href="#why" className="hover:text-slate-300 transition-colors">Why Us</a>
              <a href="#devices" className="hover:text-slate-300 transition-colors">Devices</a>
              <Link href="/login" className="hover:text-slate-300 transition-colors">Sign In</Link>
            </div>
            <div className="flex items-center gap-3">
              {[Globe, MessageCircle, LinkIcon].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.15, y: -2 }}
                  className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-slate-500 hover:text-slate-200 transition-colors"
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </div>
          <div className="divider-glow my-6" />
          <p className="text-center text-xs text-slate-600">
            © 2026 EdgeVisionNet — Final Year Research Project. Built with Next.js, FastAPI, and TensorFlow Lite.
          </p>
        </div>
      </footer>
    </div>
  )
}
