'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  Cpu, Zap, Brain, BarChart3, Shield, Globe, ArrowRight,
  ChevronDown, Activity, Sparkles, Monitor, Leaf, TrendingUp,
  CheckCircle, Star,
} from 'lucide-react'

/* ── Neural Network Canvas Background ── */
function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const nodes: { x: number; y: number; vx: number; vy: number; r: number }[] = []
    const NODE_COUNT = 60

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.12
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      // Draw nodes
      nodes.forEach(n => {
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0, 212, 255, 0.5)'
        ctx.fill()
        // Glow
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * 3, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0, 212, 255, 0.04)'
        ctx.fill()

        // Move
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1
      })

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  )
}

/* ── Live Counter ── */
function Counter({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const step = end / (duration / 16)
    const timer = setInterval(() => {
      start = Math.min(start + step, end)
      setCount(Math.floor(start))
      if (start >= end) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [end, duration])

  return <span>{count.toLocaleString()}{suffix}</span>
}

/* ── Data ── */
const features = [
  {
    icon: Brain,
    color: '#00d4ff',
    bg: 'rgba(0,212,255,0.1)',
    title: 'Edge AI Inference',
    desc: 'Run MobileNetV2, EfficientNet, ShuffleNet and custom EdgeVisionNet models directly on device — sub-50ms latency.',
  },
  {
    icon: Activity,
    color: '#10b981',
    bg: 'rgba(16,185,129,0.1)',
    title: 'Real-Time Telemetry',
    desc: 'Live CPU, RAM, temperature, battery and power monitoring with 2-second polling and anomaly detection.',
  },
  {
    icon: BarChart3,
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.1)',
    title: 'Analytics Dashboard',
    desc: 'Historical telemetry trends, time-series charts, energy comparisons and instant CSV/PDF export.',
  },
  {
    icon: Leaf,
    color: '#10b981',
    bg: 'rgba(16,185,129,0.1)',
    title: 'Energy Intelligence',
    desc: 'Real-time edge vs cloud energy comparison with CO₂ savings projection and daily/monthly reports.',
  },
  {
    icon: Shield,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    title: 'Secure JWT Auth',
    desc: 'Enterprise-grade authentication with JWT tokens, session management and demo access for evaluation.',
  },
  {
    icon: Globe,
    color: '#00d4ff',
    bg: 'rgba(0,212,255,0.1)',
    title: 'Multi-Model Benchmark',
    desc: 'Run all 4 AI models simultaneously on any image and compare accuracy, latency and energy side-by-side.',
  },
]

const models = [
  { name: 'EdgeVisionNet', acc: 74.2, ms: 38,  mb: 11,  badge: '★ Custom',  color: '#00d4ff' },
  { name: 'MobileNetV2',   acc: 71.8, ms: 42,  mb: 14,  badge: 'Lightweight', color: '#8b5cf6' },
  { name: 'EfficientNet-B0', acc: 77.1, ms: 68, mb: 21, badge: 'Accurate',   color: '#10b981' },
  { name: 'ShuffleNet',    acc: 69.4, ms: 31,  mb: 8,   badge: 'Fastest',    color: '#f59e0b' },
]

const testimonials = [
  { name: 'Dr. Sarah Chen', role: 'ML Research Lead, Stanford', text: 'EdgeVisionNet cut our inference latency by 68% while reducing power consumption to a fraction of what cloud compute costs.', stars: 5 },
  { name: 'James Okafor', role: 'CTO, Embedded Systems Co.', text: 'The real-time energy monitoring is exceptional. We now have full visibility into our edge fleet performance.', stars: 5 },
  { name: 'Priya Mehta', role: 'AI Platform Engineer, DeepTech', text: 'Clean architecture, beautiful dashboards. This is the production-ready edge AI platform we\'ve been searching for.', stars: 5 },
]

const stats = [
  { label: 'Edge Inferences', value: 48291, suffix: '+', color: 'text-cyan-400' },
  { label: 'Energy Saved',    value: 98,    suffix: '%', color: 'text-emerald-400' },
  { label: 'Avg Latency',     value: 38,    suffix: 'ms', color: 'text-purple-400' },
  { label: 'Models Supported',value: 4,     suffix: '',   color: 'text-amber-400' },
]

const workflowSteps = [
  { icon: '📸', label: 'Image Upload' },
  { icon: '✅', label: 'Validation' },
  { icon: '⚙️', label: 'Preprocessing' },
  { icon: '🧠', label: 'Model Inference' },
  { icon: '📊', label: 'Prediction + Confidence' },
  { icon: '💾', label: 'Database Logging' },
  { icon: '📄', label: 'Report Generation' },
]

export default function LandingPage() {
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const heroY       = useTransform(scrollY, [0, 400], [0, -60])
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.3 }
    )
    if (statsRef.current) obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-bg overflow-x-hidden">
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-bg/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/30 to-purple-600/20 border border-cyan-500/30 flex items-center justify-center glow-blue">
            <Cpu size={17} className="text-cyan-400" />
          </div>
          <span className="text-base font-bold text-white tracking-tight">EdgeVisionNet</span>
          <span className="badge-pro ml-1">PRO</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Models', 'Analytics', 'Pricing'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-slate-400 hover:text-white transition-colors">
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <button className="btn-secondary px-4 py-2 text-sm">Sign In</button>
          </Link>
          <Link href="/signup">
            <button className="btn-primary px-5 py-2 text-sm">
              Get Started <ArrowRight size={14} />
            </button>
          </Link>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <NeuralBackground />

        {/* Radial glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-400/3 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 text-center max-w-5xl mx-auto px-6"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass-card border border-cyan-500/20 rounded-full mb-8 text-sm text-cyan-400"
          >
            <Sparkles size={14} />
            <span>Enterprise Edge AI Platform · v1.0.0</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.05]"
          >
            <span className="text-white">The Future of</span>
            <br />
            <span className="hero-gradient-text">Edge AI Intelligence</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Real-time telemetry monitoring, multi-model AI inference, and energy intelligence —
            all in a single enterprise-grade platform built for the edge.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary px-8 py-3.5 text-base font-semibold"
                style={{ boxShadow: '0 0 30px rgba(0,212,255,0.3)' }}
              >
                Start Free Trial <ArrowRight size={17} />
              </motion.button>
            </Link>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="btn-secondary px-8 py-3.5 text-base font-medium"
              >
                <Zap size={17} className="text-amber-400" /> Demo Access
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-12 text-xs text-slate-600"
          >
            {['No credit card required', 'Sub-50ms inference', '68% energy savings vs cloud', 'Open source models'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={12} className="text-emerald-500" /> {t}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-600"
        >
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* ─── Stats ─── */}
      <section ref={statsRef} className="py-20 px-6 relative">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 text-center"
            >
              <p className={`text-4xl font-bold ${s.color} mb-2`}>
                {statsVisible ? <Counter end={s.value} suffix={s.suffix} /> : `0${s.suffix}`}
              </p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-4 block">Platform Features</span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
              Everything you need for
              <br />
              <span className="gradient-text-cyan">enterprise edge AI</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              A complete suite of tools for monitoring, inference, analytics and reporting — all in one platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="feature-card group"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: f.bg }}
                >
                  <f.icon size={22} style={{ color: f.color }} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI Workflow ─── */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent via-cyan-500/2 to-transparent">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-4 block">AI Pipeline</span>
            <h2 className="text-4xl font-bold text-white mb-4">
              From upload to insight
              <br />
              <span className="text-purple-400">in milliseconds</span>
            </h2>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {workflowSteps.map((step, i) => (
              <React.Fragment key={step.label}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card px-5 py-3 flex items-center gap-2 text-sm font-medium text-white"
                >
                  <span>{step.icon}</span>
                  <span>{step.label}</span>
                </motion.div>
                {i < workflowSteps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.05 }}
                    className="text-cyan-500/50 font-bold text-lg"
                  >
                    →
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Model Showcase ─── */}
      <section id="models" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-4 block">Supported Models</span>
            <h2 className="text-4xl font-bold text-white mb-4">
              4 AI models,
              <br />
              <span className="gradient-text">one platform</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {models.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass-card p-5 text-center"
                style={{ borderColor: `${m.color}30` }}
              >
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center text-xl font-bold"
                  style={{ background: `${m.color}15`, color: m.color }}
                >
                  {m.name.charAt(0)}
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{m.name}</h3>
                <span
                  className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-4"
                  style={{ background: `${m.color}15`, color: m.color }}
                >
                  {m.badge}
                </span>
                <div className="space-y-2 text-left">
                  {[
                    { label: 'Accuracy', value: `${m.acc}%` },
                    { label: 'Latency',  value: `${m.ms}ms` },
                    { label: 'Size',     value: `${m.mb}MB` },
                  ].map(stat => (
                    <div key={stat.label} className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">{stat.label}</span>
                      <span className="font-semibold" style={{ color: m.color }}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent via-purple-500/2 to-transparent">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-4 block">Testimonials</span>
            <h2 className="text-4xl font-bold text-white">Trusted by AI teams worldwide</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-5">"{t.text}"</p>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/4 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-3xl mx-auto text-center"
        >
          <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to deploy
            <br />
            <span className="hero-gradient-text">intelligent edge AI?</span>
          </h2>
          <p className="text-lg text-slate-400 mb-10">
            Join the edge AI revolution. Get started in minutes with our full-featured platform.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary px-10 py-4 text-lg font-semibold"
                style={{ boxShadow: '0 0 40px rgba(0,212,255,0.35)' }}
              >
                Get Started Free <ArrowRight size={20} />
              </motion.button>
            </Link>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="btn-secondary px-10 py-4 text-lg"
              >
                <Zap size={18} className="text-amber-400" /> Demo Login
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/30 to-purple-600/20 border border-cyan-500/30 flex items-center justify-center">
              <Cpu size={14} className="text-cyan-400" />
            </div>
            <span className="text-sm font-bold text-white">EdgeVisionNet</span>
          </div>
          <p className="text-xs text-slate-600 text-center">
            © 2026 EdgeVisionNet. Enterprise Edge AI Platform. Built with Next.js, FastAPI & TensorFlow Lite.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-600">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
            <a href="/login" className="hover:text-slate-400 transition-colors">Sign In</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
